import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import nextEnv from "@next/env";
import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { createClient } from "@sanity/client";
nextEnv.loadEnvConfig(process.cwd());
const uid = randomUUID(),
  jobId = "qa-job-" + uid,
  teamId = "qa-team-" + uid,
  formId = "qa-application-" + uid,
  submissionId = "submissions." + uid;
const origin = process.env.MG2A_TEST_ORIGIN || "http://localhost:3007";
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-02-19",
  useCdn: false,
  perspective: "raw",
};
const client = createClient({ ...config, token: process.env.SANITY_TOKEN }),
  anonymous = createClient(config);
async function refresh(type) {
  const secret =
    process.env.SANITY_REVALIDATE_SECRET || process.env.NEXT_PUBLIC_SANITY_HOOK;
  if (!secret)
    throw new Error(
      "Webhook secret is required for production cache verification.",
    );
  const payload = JSON.stringify({ _type: type });
  const signature = await encodeSignatureHeader(payload, Date.now(), secret);
  assert.equal(
    (
      await fetch(origin + "/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [SIGNATURE_HEADER_NAME]: signature,
        },
        body: payload,
      })
    ).status,
    200,
    "Publishing webhook must revalidate pages",
  );
}
const body = (text) => [
  {
    _type: "block",
    _key: "p",
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: "s", marks: [], text }],
  },
];
try {
  await client.create({
    _id: formId,
    _type: "form",
    title: "Application verification",
    purpose: "job",
    notification_email: "",
    form_fields: {
      _type: "code",
      language: "json",
      code: JSON.stringify([
        { name: "name", label: "Name", type: "text", required: true },
        {
          name: "resume",
          label: "Resume",
          type: "file",
          required: true,
          accept: "resume",
        },
      ]),
    },
  });
  await client.create({
    _id: jobId,
    _type: "mg2a_job",
    title: "Verification position " + uid,
    slug: { _type: "slug", current: "qa-" + uid },
    status: "open",
    page_builder: [
      { _type: "mg2a_pageHero", _key: "hero" },
      {
        _type: "mg2a_jobApplication",
        _key: "application",
        title: "Apply",
        form: { _type: "reference", _ref: formId },
      },
    ],
  });
  await client.create({
    _id: teamId,
    _type: "mg2a_team",
    title: "Verification team " + uid,
    slug: { _type: "slug", current: "qa-" + uid },
    body: body("Biography verification"),
    page_builder: [
      { _type: "mg2a_memberProfile", _key: "profile", title: "Background" },
    ],
  });
  await refresh("mg2a_job");
  await refresh("mg2a_team");
  const careers = await fetch(origin + "/careers").then((r) => r.text());
  assert(
    careers.includes("/careers/qa-" + uid),
    "Publishing a job must add its overview link",
  );
  assert(
    !careers.includes('name="resume"'),
    "Overview must not show an application form",
  );
  const about = await fetch(origin + "/about").then((r) => r.text());
  assert(
    about.includes("/about/qa-" + uid),
    "Publishing a Team member must add their overview link",
  );
  for (const path of ["/careers/qa-", "/about/qa-"])
    assert.equal((await fetch(origin + path + uid)).status, 200);
  const payload = {
    formId,
    requestId: uid,
    contextId: jobId,
    values: { name: "Non-personal verification fixture" },
    pagePath: "/careers/qa-" + uid,
  };
  const multipart = new FormData();
  multipart.set("payload", JSON.stringify(payload));
  multipart.append(
    "attachment:resume",
    new Blob(["%PDF-1.4 synthetic resume\n"], { type: "application/pdf" }),
    "verification.pdf",
  );
  const response = await fetch(origin + "/api/submit-form", {
    method: "POST",
    body: multipart,
  });
  assert.equal(response.status, 200, await response.text());
  const saved = await client.getDocument(submissionId);
  assert.equal(saved.notification_status, "disabled");
  assert.equal(saved.fields[0].value, "Verification position " + uid);
  assert.equal(saved.attachments[0].mime, "application/pdf");
  assert.equal(
    await anonymous.fetch("count(*[_id==$id || _id match $prefix])", {
      id: submissionId,
      prefix: submissionId + "-*",
    }),
    0,
  );
  await client.patch(jobId).set({ status: "closed" }).commit();
  await refresh("mg2a_job");
  const closedDetail = await fetch(origin + "/careers/qa-" + uid).then((r) =>
    r.text(),
  );
  assert(!closedDetail.includes('name="resume"'));
  assert(
    !(await fetch(origin + "/careers").then((r) => r.text())).includes(
      "/careers/qa-" + uid,
    ),
  );
  const closed = await fetch(origin + "/api/submit-form", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, requestId: randomUUID() }),
  });
  assert.equal(
    closed.status,
    409,
    "Closed positions must refuse new applications",
  );
  console.log(
    "Passed: dynamic Team/jobs, detail routes, job-only forms, verified position capture, private resume storage and closed-position rejection. No email sent.",
  );
} catch (error) {
  console.error(
    "Company verification failed:",
    error instanceof assert.AssertionError
      ? error.message
      : error.statusCode || error.code || "request error",
  );
  process.exitCode = 1;
} finally {
  try {
    const chunks = await client.fetch("*[_id match $prefix]._id", {
      prefix: submissionId + "-*",
    });
    // Only ephemeral synthetic fixtures created by this check are removed.
    for (const id of [submissionId, ...chunks, jobId, teamId, formId])
      await client.delete(id);
    await refresh("mg2a_job");
    await refresh("mg2a_team");
  } catch {
    console.error("Verification fixture cleanup failed.");
    process.exitCode = 1;
  }
}
