import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
nextEnv.loadEnvConfig(process.cwd());
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-02-19",
  useCdn: false,
  perspective: "raw",
};
const authenticated = createClient({
  ...config,
  token: process.env.SANITY_TOKEN,
});
const anonymous = createClient(config);
const id = `submissions.access-check-${randomUUID()}`;
try {
  await authenticated.create({
    _id: id,
    _type: "formSubmission",
    form_title: "Access check",
    submitted_at: new Date().toISOString(),
    fields: [],
    status: "new",
    notification_status: "disabled",
  });
  assert.equal(await authenticated.fetch("count(*[_id==$id])", { id }), 1);
  assert.equal(await anonymous.fetch("count(*[_id==$id])", { id }), 0);
  console.log(
    "Passed: stored submission is readable with authentication and hidden from anonymous queries. No personal data or email used.",
  );
} finally {
  await authenticated.delete(id);
}
