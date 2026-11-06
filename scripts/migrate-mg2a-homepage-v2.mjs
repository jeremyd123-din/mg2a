import fs from "node:fs";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { stegaClean } from "@sanity/client/stega";
nextEnv.loadEnvConfig(process.cwd());
const apply = process.argv.includes("--apply");
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-02-19",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  perspective: "raw",
});
const escape = (value) =>
  stegaClean(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const pages = await client.fetch(
  '*[_type=="page" && count(page_builder[_type match "mg2a_*"])>0]',
);
for (const page of pages) {
  const set = {},
    unset = [];
  for (const block of page.page_builder || []) {
    if (!block._type?.startsWith("mg2a_")) continue;
    const path = `page_builder[_key==${JSON.stringify(block._key)}]`;
    if ("enabled" in block) unset.push(path + ".enabled");
    if (block._type !== "mg2a_hero") continue;
    if (!block.buttonOne)
      set[path + ".buttonOne"] = {
        label: stegaClean(block.label || ""),
        href: stegaClean(block.href || ""),
      };
    if (!block.buttonTwo)
      set[path + ".buttonTwo"] = {
        label: stegaClean(block.label2 || ""),
        href: stegaClean(block.href2 || ""),
      };
    if (block.trustStatement === undefined)
      set[path + ".trustStatement"] = [
        escape(block.description2),
        block.text ? `<strong>${escape(block.text)}</strong>` : "",
        escape(block.description3),
        block.text2 ? `<strong>${escape(block.text2)}</strong>` : "",
      ]
        .filter(Boolean)
        .join(" ");
    for (const old of [
      "label",
      "href",
      "label2",
      "href2",
      "description2",
      "description3",
      "text",
      "text2",
    ])
      if (old in block) unset.push(path + "." + old);
  }
  if (Object.keys(set).length || unset.length) {
    console.log(
      `${apply ? "Migrating" : "Would migrate"} ${page._id}: ${Object.keys(set).length} new fields, ${unset.length} retired fields.`,
    );
    if (apply) {
      let patch = client.patch(page._id).ifRevisionId(page._rev);
      if (Object.keys(set).length) patch = patch.set(set);
      if (unset.length) patch = patch.unset(unset);
      await patch.commit();
    }
  }
}
if (apply) {
  const logo = await client.assets.upload(
    "image",
    fs.createReadStream("public/mg2a/mg2a-logo-approved.svg"),
    { filename: "mg2a-logo-approved.svg" },
  );
  const settings = await client.fetch('*[_type=="mg2a_settings"]');
  for (const doc of settings)
    await client
      .patch(doc._id)
      .ifRevisionId(doc._rev)
      .set({
        logo: { _type: "image", asset: { _type: "reference", _ref: logo._id } },
      })
      .setIfMissing({
        logoCaption: "M Gingerich Gereaux\n& Associates",
        footerLicense: "Licensed · Illinois · Indiana",
      })
      .commit();
  console.log("Exact handoff logo applied to existing shared settings.");
}
console.log(
  apply
    ? "Migration complete. Existing drafts remain drafts. No website deployment performed."
    : "Dry run complete. Use --apply to migrate.",
);
