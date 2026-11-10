import { inquiryForm } from "../lib/forms/defaults.js";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import nextEnv from "@next/env";
import { pathToFileURL } from "node:url";
nextEnv.loadEnvConfig(process.cwd());
const { settings, careers, contact } = await import(
  pathToFileURL(path.resolve("lib/mg2a/defaults.js"))
);
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-02-19",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});
if (!process.env.SANITY_TOKEN) throw new Error("SANITY_TOKEN is required.");
const source =
  process.env.MG2A_HANDOFF_DIR ||
  "/Users/parasbokhari/Downloads/mg2a-dev-handoff";
const home = JSON.parse(fs.readFileSync("lib/mg2a/homepage.json", "utf8"));
const documents = JSON.parse(
  fs.readFileSync("lib/mg2a/documents.json", "utf8"),
);
const existing = await client.fetch(
  '*[_type=="page" && slug.current=="index"]{_id}',
);
if (
  existing.some(
    (d) => !["mg2a-homepage", "drafts.mg2a-homepage"].includes(d._id),
  )
)
  throw new Error(
    "Another homepage exists. Resolve the canonical page before seeding.",
  );
const manifest = fs.existsSync("lib/mg2a/assets.json")
  ? JSON.parse(fs.readFileSync("lib/mg2a/assets.json", "utf8"))
  : {};
async function asset(filename) {
  if (manifest[filename]) return manifest[filename];
  const type = filename.endsWith(".mp4") ? "file" : "image";
  const uploaded = await client.assets.upload(
    type,
    fs.createReadStream(path.join(source, "pages/assets", filename)),
    { filename },
  );
  manifest[filename] = {
    _type: type,
    asset: { _type: "reference", _ref: uploaded._id },
  };
  fs.writeFileSync(
    "lib/mg2a/assets.json",
    JSON.stringify(manifest, null, 2) + "\n",
  );
  console.log("Uploaded", filename);
  return manifest[filename];
}
async function resolve(value) {
  if (Array.isArray(value)) return Promise.all(value.map(resolve));
  if (value && typeof value === "object") {
    if (value._localAsset) return asset(value._localAsset);
    return Object.fromEntries(
      await Promise.all(
        Object.entries(value).map(async ([k, v]) => [k, await resolve(v)]),
      ),
    );
  }
  return value;
}
const icons = [
  "survey",
  "design",
  "water",
  "permitting",
  "construction",
  "documentation",
  "cost",
];
let categoryIndex = 0;
for (const document of documents) {
  if (document._type === "mg2a_serviceCategory")
    document.icon = icons[categoryIndex++];
}
await client.createIfNotExists(inquiryForm);
const homepage = {
  _id: "mg2a-homepage",
  _type: "page",
  title: "Home",
  slug: { _type: "slug", current: "index" },
  page_layout: "flexible",
  default_theme: "dark",
  meta_title: "MG2A | Civil Engineering & Surveying in Illinois & Indiana",
  meta_description:
    "Civil engineering, land surveying, water resources and municipal engineering for communities and developments across Illinois and Indiana.",
  seo_no_index: false,
  page_builder: [...home, careers, contact],
};
const samples = JSON.parse(
  fs.readFileSync("lib/mg2a/referencePlaceholders.json", "utf8"),
);
const jobs = samples.jobs.map((job, index) => ({
  _id: "mg2a-job-" + job._key,
  _type: "mg2a_job",
  title: job.title,
  location: job.location,
  href: job.href,
  status: "open",
  order: index,
}));
const seed = await resolve([...documents, ...jobs, settings, homepage]);
const transaction = client.transaction();
for (const document of seed) transaction.createIfNotExists(document);

await transaction.commit();
console.log(
  `Seed complete: ${seed.length} MG2A records (create-if-missing; existing edits preserved).`,
);
console.log(
  "Homepage: mg2a-homepage. No website deployment performed. Indexing remains disabled during development.",
);

// Complete dynamic project pages and migrate industry links into Pages.
await import("./seed-mg2a-expansion.mjs");

await import("./seed-mg2a-company.mjs");
await import("./seed-mg2a-industry-summaries.mjs");
