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
const sample = JSON.parse(
  fs.readFileSync("lib/mg2a/referencePlaceholders.json", "utf8"),
);
const draft = await client.getDocument("drafts.mg2a-homepage");
if (!draft)
  throw new Error("No existing homepage draft. No content has been changed.");
const set = {};
for (const block of draft.page_builder || []) {
  const path = `page_builder[_key==${JSON.stringify(block._key)}]`;
  if (block._type === "mg2a_whyMG2A") {
    if (!block.metrics?.length) set[path + ".metrics"] = sample.metrics;
    if (!block.testimonial?.quote)
      set[path + ".testimonial"] = sample.testimonial;
  }
  if (block._type === "mg2a_careers" && !block.jobs?.length)
    set[path + ".jobs"] = sample.jobs;
}
if (Object.keys(set).length)
  await client.patch(draft._id).ifRevisionId(draft._rev).set(set).commit();
console.log(
  `Restored ${Object.keys(set).length} placeholder groups to the existing draft only. Published homepage unchanged.`,
);
