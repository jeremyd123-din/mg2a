import fs from "node:fs";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import {
  memberInitialBlocks,
  jobInitialBlocks,
} from "../sanity/schemaTypes/mg2a/company.js";
nextEnv.loadEnvConfig(process.cwd());
try {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: "production",
    apiVersion: "2025-02-19",
    useCdn: false,
    token: process.env.SANITY_TOKEN,
    perspective: "raw",
  });
  const docs = await client.fetch(
    '*[_type in ["page","mg2a_team","mg2a_job","form"]]',
  );
  const backup = `/private/tmp/mg2a-company-backup-${Date.now()}.json`;
  fs.writeFileSync(backup, JSON.stringify(docs, null, 2), { mode: 0o600 });
  const assets = JSON.parse(fs.readFileSync("lib/mg2a/assets.json"));
  function resolve(v) {
    if (Array.isArray(v)) return v.map(resolve);
    if (v && typeof v === "object") {
      if (v._localAsset) return assets[v._localAsset];
      return Object.fromEntries(
        Object.entries(v).map(([k, x]) => [k, resolve(x)]),
      );
    }
    return v;
  }
  const fields = [
    { name: "name", type: "text", label: "Full name", required: true },
    { name: "email", type: "email", label: "Email", required: true },
    { name: "phone", type: "tel", label: "Phone" },
    {
      name: "linkedin",
      type: "url",
      label: "LinkedIn (optional)",
      placeholder: "https://",
    },
    {
      name: "resume",
      type: "file",
      label: "Resume (PDF or Word)",
      accept: "resume",
      required: true,
      width: 100,
    },
    {
      name: "message",
      type: "textarea",
      label: "Anything else we should know?",
      width: 100,
    },
  ];
  await client.createIfNotExists({
    _id: "mg2a-job-application",
    _type: "form",
    title: "Job application",
    purpose: "job",
    notification_email: "parasbokhari@gmail.com",
    form_fields: {
      _type: "code",
      language: "json",
      code: JSON.stringify(fields, null, 2),
    },
    button_title: "Send application",
    note: "Your application is sent to MG2A for review.",
    thankyou_message:
      "Thank you for applying. We have received your application and will be in touch if your experience matches the role.",
    error_message: "We could not save your application. Please try again.",
  });
  for (const page of resolve(
    JSON.parse(fs.readFileSync("lib/mg2a/companyPages.json")),
  ))
    await client.createIfNotExists(page);
  const paragraph = (text) => [
    {
      _type: "block",
      _key: "bio",
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: "text", text, marks: [] }],
    },
  ];
  const names = [
    "Jacob Gingerich",
    "[Name], PE",
    "[Name], PLS",
    "[Name], PE",
    "[Name]",
    "[Name]",
    "[Name]",
    "[Name]",
  ];
  for (const [i, title] of names.entries()) {
    const slug = i === 0 ? "jacob-gingerich" : `team-member-${i + 1}`;
    await client.createIfNotExists({
      _id: "mg2a-team-" + slug,
      _type: "mg2a_team",
      title,
      role: "[Title]",
      slug: { _type: "slug", current: slug },
      order: i,
      seo_no_index: false,
      body: paragraph("[Biography]"),
      page_builder: memberInitialBlocks,
    });
  }
  for (const job of docs.filter((doc) => doc._type === "mg2a_job")) {
    const published = docs.find(
      (doc) => doc._id === job._id.replace(/^drafts\./, ""),
    );
    const slug =
      job.slug?.current ||
      published?.slug?.current ||
      (published?.title || job.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    await client
      .patch(job._id)
      .ifRevisionId(job._rev)
      .setIfMissing({
        slug: { _type: "slug", current: slug },
        seo_no_index: false,
        summary: "[Role summary]",
        body: paragraph("[Role summary, responsibilities, and requirements.]"),
        page_builder: jobInitialBlocks,
      })
      .set({ href: "/careers/" + slug })
      .commit();
  }
  console.log(
    "About, Careers, Team and job detail content ready. Backup:",
    backup,
  );
} catch (error) {
  console.error(
    "Company content setup failed:",
    error.statusCode || error.code || "request error",
  );
  process.exitCode = 1;
}
