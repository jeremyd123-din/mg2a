import fs from "node:fs";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { serviceScopeForm } from "../lib/forms/serviceScope.js";
nextEnv.loadEnvConfig(process.cwd());
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-02-19",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  perspective: "raw",
});
const assets = JSON.parse(fs.readFileSync("lib/mg2a/assets.json", "utf8"));
function resolve(value) {
  if (Array.isArray(value)) return value.map(resolve);
  if (value && typeof value === "object") {
    if (value._localAsset) return assets[value._localAsset];
    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [key, resolve(value)]),
    );
  }
  return value;
}
const pages = resolve(
  JSON.parse(fs.readFileSync("lib/mg2a/servicePages.json", "utf8")),
);
const existing = await client.fetch(
  '*[_type=="page" && slug.current in $slugs]{_id,slug}',
  { slugs: pages.map((p) => p.slug.current) },
);
for (const page of pages) {
  if (
    existing.some(
      (doc) =>
        doc.slug.current === page.slug.current &&
        ![page._id, "drafts." + page._id].includes(doc._id),
    )
  )
    throw new Error("A different page already uses " + page.slug.current);
}
const original = await client.fetch(
  '*[_id=="mg2a-project-inquiry"][0]{notification_email}',
);
await client.createIfNotExists({
  ...serviceScopeForm,
  notification_email: original?.notification_email || "",
});
for (const page of pages) await client.createIfNotExists(page);
console.log(
  "Created missing service overview, detail and hub pages plus the reusable service inquiry form. Existing content and global settings preserved; new pages allow indexing under the site-wide setting.",
);
