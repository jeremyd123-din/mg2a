import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
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
  const summaries = JSON.parse(
    fs.readFileSync("lib/mg2a/industrySummaries.json"),
  );
  const docs = await client.fetch('*[_type=="page" && page_kind=="industry"]');
  fs.writeFileSync(
    `/private/tmp/mg2a-industry-summaries-backup-${Date.now()}.json`,
    JSON.stringify(docs, null, 2),
    { mode: 0o600 },
  );
  let updated = 0;
  for (const doc of docs) {
    const summary = summaries[doc.slug?.current];
    if (!summary || doc.listing_summary?.trim()) continue;
    await client
      .patch(doc._id)
      .ifRevisionId(doc._rev)
      .set({ listing_summary: summary })
      .commit();
    updated++;
  }
  console.log("Added missing editable industry descriptions:", updated);
  const origin =
    process.env.MG2A_REVALIDATE_ORIGIN || process.env.NEXT_PUBLIC_BASE_URL;
  const secret =
    process.env.SANITY_REVALIDATE_SECRET || process.env.NEXT_PUBLIC_SANITY_HOOK;
  if (origin && secret) {
    const payload = JSON.stringify({ _type: "page" });
    const signature = await encodeSignatureHeader(payload, Date.now(), secret);
    const response = await fetch(new URL("/api/revalidate", origin), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [SIGNATURE_HEADER_NAME]: signature,
      },
      body: payload,
    });
    if (!response.ok) throw new Error("Page cache refresh failed");
    console.log("Refreshed industry page caches.");
  }
} catch (error) {
  console.error(
    "Industry summary setup failed:",
    error.statusCode || error.code || "request error",
  );
  process.exitCode = 1;
}
