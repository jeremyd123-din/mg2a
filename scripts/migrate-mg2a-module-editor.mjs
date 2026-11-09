import fs from "node:fs";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
nextEnv.loadEnvConfig(process.cwd());
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-02-19",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  perspective: "raw",
});
const docs = await client.fetch('*[_type=="page"]{_id,_rev,page_builder}');
function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== "editorLabel")
        .map(([key, value]) => [key, clean(value)]),
    );
  return value;
}
const changed = docs
  .map((doc) => ({ ...doc, next: clean(doc.page_builder) }))
  .filter(
    (doc) => JSON.stringify(doc.page_builder) !== JSON.stringify(doc.next),
  );
if (changed.length)
  fs.writeFileSync(
    `/private/tmp/mg2a-module-label-backup-${Date.now()}.json`,
    JSON.stringify(changed, null, 2),
  );
for (const doc of changed)
  await client
    .patch(doc._id)
    .ifRevisionId(doc._rev)
    .set({ page_builder: doc.next })
    .commit();
console.log(
  `Removed module-label metadata from ${changed.length} page records. Content and existing anchor aliases preserved.`,
);
