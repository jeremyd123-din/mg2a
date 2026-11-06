import fs from "node:fs";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
nextEnv.loadEnvConfig(process.cwd());
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-02-19",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  perspective: "raw",
});
const docs = await client.fetch(
  '*[_type in ["page","mg2a_settings","mg2a_office","site_settings","mg2a_job"]]',
);
const byId = new Map(docs.map((doc) => [doc._id, doc]));
const backup = `/private/tmp/mg2a-editor-model-${Date.now()}.json`;
fs.writeFileSync(backup, JSON.stringify(docs, null, 2));
const transaction = client.transaction();
let changed = 0;
let jobsCreated = 0;
const settings = docs.filter((d) => d._type === "mg2a_settings");
for (const doc of settings) {
  const draft = doc._id.startsWith("drafts.");
  const embedded = (doc.offices || []).map((office, index) => {
    if (!office._ref) return office;
    const record =
      (draft && byId.get("drafts." + office._ref)) || byId.get(office._ref);
    if (!record)
      throw new Error(
        "Office reference could not be resolved. No migration has been committed.",
      );
    const { _id, _rev, _createdAt, _updatedAt, _type, ...fields } = record;
    return {
      ...fields,
      _key: office._key || "office" + index,
      _type: "office",
    };
  });
  const legacy =
    (draft && byId.get("drafts.site_settings")) || byId.get("site_settings");
  const set = { offices: embedded, title: "MG2A Site Settings" };
  for (const field of ["disable_indexing", "og_image", "gtm_id"])
    if (doc[field] === undefined && legacy?.[field] !== undefined)
      set[field] = legacy[field];
  transaction.patch(doc._id, (p) => p.ifRevisionId(doc._rev).set(set));
  changed++;
}
const pages = docs.filter((d) => d._type === "page");
const ordered = pages.sort(
  (a, b) =>
    Number(a._id.startsWith("drafts.")) - Number(b._id.startsWith("drafts.")),
);
const migratedJobs = new Map();
for (const page of ordered) {
  const unset = [];
  for (const block of page.page_builder || []) {
    const path = `page_builder[_key==${JSON.stringify(block._key)}]`;
    if (block._type === "mg2a_contactForm" && block.offices)
      unset.push(path + ".offices");
    if (block._type !== "mg2a_careers" || !Array.isArray(block.jobs)) continue;
    for (const [index, job] of block.jobs.entries()) {
      const id =
        "mg2a-job-" + String(job._key || index).replace(/[^a-zA-Z0-9_-]/g, "-");
      const fields = {
        _type: "mg2a_job",
        title: job.title || "",
        location: job.location || "",
        href: job.href || "/careers#apply",
        status: "open",
        order: index,
      };
      const base = migratedJobs.get(id) || byId.get(id);
      if (page._id.startsWith("drafts.")) {
        const comparable =
          base &&
          Object.fromEntries(
            Object.keys(fields).map((key) => [key, base[key]]),
          );
        if (!base || JSON.stringify(comparable) !== JSON.stringify(fields)) {
          transaction.createIfNotExists({ _id: "drafts." + id, ...fields });
          jobsCreated++;
        }
      } else {
        transaction.createIfNotExists({ _id: id, ...fields });
        migratedJobs.set(id, fields);
        jobsCreated++;
      }
    }
    unset.push(path + ".jobs");
  }
  if (unset.length) {
    transaction.patch(page._id, (p) => p.ifRevisionId(page._rev).unset(unset));
    changed++;
  }
}
await transaction.commit();
console.log(
  `Migrated ${changed} settings/page records and ${jobsCreated} position records. No documents deleted.`,
);
console.log(`Recovery snapshot saved to ${backup}`);
