import fs from "node:fs";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
nextEnv.loadEnvConfig(process.cwd());
try {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: "production",
    apiVersion: "2025-02-19",
    useCdn: false,
    perspective: "raw",
    token: process.env.SANITY_TOKEN,
  });
  const docs = await client.fetch(
    '*[(_type=="page" && slug.current=="about") || (_type=="mg2a_project" && slug.current=="courtyards-cobblestone")]',
  );
  fs.writeFileSync(
    `/private/tmp/mg2a-template-corrections-backup-${Date.now()}.json`,
    JSON.stringify(docs, null, 2),
    { mode: 0o600 },
  );
  let updated = 0;
  for (const doc of docs) {
    if (doc._type === "mg2a_project") {
      if (!doc.cardImagePosition || !doc.cardTone) {
        await client
          .patch(doc._id)
          .ifRevisionId(doc._rev)
          .setIfMissing({ cardImagePosition: "50% 70%", cardTone: "water" })
          .commit();
        updated++;
      }
    } else {
      const banner = doc.page_builder?.find(
        (block) => block._type === "mg2a_ctaBanner",
      );
      if (banner && !banner.eyebrow) {
        await client
          .patch(doc._id)
          .ifRevisionId(doc._rev)
          .set({ [`page_builder[_key=="${banner._key}"].eyebrow`]: "Careers" })
          .commit();
        updated++;
      }
    }
  }
  console.log("Applied missing handoff presentation defaults:", updated);
} catch (error) {
  console.error(
    "Template default setup failed:",
    error.statusCode || error.code || "request error",
  );
  process.exitCode = 1;
}
