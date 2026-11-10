import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
nextEnv.loadEnvConfig(process.cwd());
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-02-19",
  useCdn: false,
  perspective: "raw",
};
const client = createClient({ ...config, token: process.env.SANITY_TOKEN }),
  anonymous = createClient(config);
const origin = process.env.MG2A_TEST_ORIGIN || "http://localhost:3006";
const uid = randomUUID(),
  projectId = "qa-project-" + uid,
  formId = "qa-form-" + uid,
  submissionId = "submissions." + uid;
let extra = [];
try {
  const source = await client.fetch(
    '*[_type=="mg2a_project" && defined(slug.current)][0]{image}',
  );
  await client.create({
    _id: projectId,
    _type: "mg2a_project",
    title: "Listing verification " + uid,
    slug: { _type: "slug", current: "qa-" + uid },
    image: source.image,
    page_builder: [{ _type: "mg2a_projectHero", _key: "hero" }],
  });
  const listing = await fetch(origin + "/projects").then((r) => r.text());
  assert(
    listing.includes("Listing verification " + uid),
    "Newly published project must appear automatically",
  );
  const detail = await fetch(origin + "/projects/qa-" + uid);
  assert.equal(detail.status, 200);
  assert((await detail.text()).includes("Listing verification " + uid));
  const industries = await fetch(origin + "/industries").then((r) => r.text());
  assert(industries.includes("/industries/manufacturing"));
  assert(industries.includes("/industries/attorneys"));
  await client.create({
    _id: formId,
    _type: "form",
    title: "Storage verification",
    notification_email: "",
    form_fields: {
      _type: "code",
      language: "json",
      code: JSON.stringify([
        { name: "name", label: "Name", type: "text", required: true },
        { name: "docs", label: "Documents", type: "file" },
      ]),
    },
  });
  const payload = {
    formId,
    requestId: uid,
    values: { name: "Non-personal test fixture" },
    pagePath: "/order-a-survey",
  };
  const multipart = new FormData();
  multipart.set("payload", JSON.stringify(payload));
  const bytes = Buffer.concat([
    Buffer.from("%PDF-1.4\n"),
    Buffer.alloc(810000, 32),
  ]);
  multipart.append(
    "attachment:docs",
    new Blob([bytes], { type: "application/pdf" }),
    "validation.pdf",
  );
  const response = await fetch(origin + "/api/submit-form", {
    method: "POST",
    body: multipart,
  });
  assert.equal(response.status, 200, await response.text());
  const saved = await client.getDocument(submissionId);
  assert(saved.attachments[0].chunks.length > 1);
  extra = saved.attachments[0].chunks;
  const chunks = await client.fetch("*[_id in $ids]{_id,data}", { ids: extra });
  const restored = Buffer.concat(
    extra.map((id) =>
      Buffer.from(chunks.find((chunk) => chunk._id === id).data, "base64"),
    ),
  );
  assert(restored.equals(bytes));
  assert.equal(
    await anonymous.fetch("count(*[_id in $ids])", {
      ids: [submissionId, ...extra],
    }),
    0,
    "Responses and document chunks must not be public",
  );
  console.log(
    "Passed: publishing a project adds its listing and detail route, industries list page records, and multipart documents save/reassemble with authenticated-only access. No email sent.",
  );
} finally {
  const leftovers = await client.fetch("*[_id==$id || _id match $prefix]._id", {
    id: submissionId,
    prefix: submissionId + "-*",
  });
  for (const id of [projectId, formId, submissionId, ...extra, ...leftovers])
    await client.delete(id);
}
