import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import {
  submissionsQuery,
  submissionQueryParams,
} from "../lib/forms/submissionQueries.js";
nextEnv.loadEnvConfig(process.cwd());
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-02-19",
  useCdn: false,
  perspective: "raw",
};
const client = createClient({ ...config, token: process.env.SANITY_TOKEN }),
  anonymous = createClient(config);
const uid = randomUUID(),
  id = "submissions." + uid,
  formId = "qa-upload-" + uid,
  origin = process.env.MG2A_TEST_ORIGIN || "http://localhost:3008";
try {
  await client.create({
    _id: formId,
    _type: "form",
    title: "Upload verification " + uid,
    notification_email: "",
    form_fields: {
      _type: "code",
      language: "json",
      code: JSON.stringify([
        { name: "name", label: "Name", type: "text", required: true },
        { name: "docs", label: "Documents", type: "file", multiple: true },
      ]),
    },
  });
  const request = new FormData();
  request.set(
    "payload",
    JSON.stringify({
      formId,
      requestId: uid,
      values: { name: "Verification " + uid },
      pagePath: "/order-a-survey",
    }),
  );
  const originals = [];
  let remaining = 4 * 1024 * 1024;
  for (let index = 0; index < 10; index++) {
    const size = index === 9 ? remaining : Math.floor((4 * 1024 * 1024) / 10);
    remaining -= size;
    const bytes = Buffer.alloc(size, 32);
    bytes.write("%PDF-1.4 verification " + index);
    originals.push(bytes);
    request.append(
      "attachment:docs",
      new Blob([bytes], { type: "application/pdf" }),
      `document-${index}.pdf`,
    );
  }
  const response = await fetch(origin + "/api/submit-form", {
    method: "POST",
    body: request,
  });
  assert.equal(response.status, 200, await response.text());
  const saved = await client.getDocument(id);
  assert.equal(saved.attachments.length, 10);
  assert.equal(saved.notification_status, "disabled");
  assert.equal(saved.submitter_name, "Verification " + uid);
  for (const [index, attachment] of saved.attachments.entries()) {
    const chunks = await client.fetch("*[_id in $ids]{_id,data}", {
      ids: attachment.chunks,
    });
    const restored = Buffer.concat(
      attachment.chunks.map((chunkId) =>
        Buffer.from(
          chunks.find((chunk) => chunk._id === chunkId).data,
          "base64",
        ),
      ),
    );
    assert(restored.equals(originals[index]));
  }
  const params = submissionQueryParams({ search: uid, formId, status: "new" });
  const dashboard = await client.fetch(submissionsQuery, params);
  assert.equal(dashboard.total, 1);
  assert.equal(dashboard.items[0]._id, id);
  const privateView = await anonymous.fetch(submissionsQuery, params);
  assert.equal(privateView.total, 0);
  assert.equal(privateView.items.length, 0);
  assert.equal(
    await anonymous.fetch("count(*[_id==$id || _id match $prefix])", {
      id,
      prefix: id + "-*",
    }),
    0,
  );
  const reviewed = await client.fetch(
    submissionsQuery,
    submissionQueryParams({ search: uid, formId, status: "reviewed" }),
  );
  assert.equal(reviewed.total, 0);
  console.log(
    "Passed: 10 files totaling 4 MB save, reassemble, preserve submitter names, and appear in authenticated search/filter results only. Email disabled.",
  );
} catch (error) {
  console.error(
    "Upload verification failed:",
    error instanceof assert.AssertionError
      ? error.message
      : error.statusCode || error.code || "request error",
  );
  process.exitCode = 1;
} finally {
  try {
    const chunks = await client.fetch("*[_id match $prefix]._id", {
      prefix: id + "-*",
    });
    for (const docId of [id, ...chunks, formId]) await client.delete(docId);
  } catch {
    console.error("Upload fixture cleanup failed.");
    process.exitCode = 1;
  }
}
