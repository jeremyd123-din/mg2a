import fs from "node:fs";
import { createHash } from "node:crypto";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { inquiryForm, inquiryFields } from "../lib/forms/defaults.js";
nextEnv.loadEnvConfig(process.cwd());
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-02-19",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  perspective: "raw",
});
const docs = await client.fetch('*[_type in ["page","mg2a_settings"]]');
fs.writeFileSync(
  `/private/tmp/mg2a-forms-backup-${Date.now()}.json`,
  JSON.stringify(docs, null, 2),
);
const settings = docs.find((doc) => doc._id === "mg2a-settings");
const notification_email = settings?.inquiryEmail || "";
const formForBlock = (block) => ({
  form_fields: {
    _type: "code",
    language: "json",
    code: JSON.stringify(
      inquiryFields.map((field) => ({
        ...field,
        label: block[field.name + "Label"] || field.label,
        ...(field.name === "need" && block.options?.length
          ? { options: block.options }
          : {}),
      })),
      null,
      2,
    ),
  },
  button_title: block.submitLabel || inquiryForm.button_title,
  note: block.note ?? inquiryForm.note,
  thankyou_message: block.successMessage || inquiryForm.thankyou_message,
  error_message: block.errorMessage || inquiryForm.error_message,
});
const originalContact = docs
  .find((doc) => doc._id === "mg2a-homepage")
  ?.page_builder?.find((block) => block._type === "mg2a_contactForm");
const canonicalSpec =
  originalContact && !originalContact.form
    ? formForBlock(originalContact)
    : null;
await client.createIfNotExists({
  ...inquiryForm,
  ...canonicalSpec,
  notification_email,
});
let count = 0;
for (const doc of docs) {
  if (doc._type === "page") {
    let changed = false;
    const page_builder = doc.page_builder?.map((block) => {
      if (block._type !== "mg2a_contactForm") return block;
      const result = { ...block };
      if (!result.form) {
        const spec = formForBlock(block);
        const hash = createHash("sha256")
          .update(JSON.stringify(spec))
          .digest("hex")
          .slice(0, 16);
        const formId =
          JSON.stringify(spec) === JSON.stringify(canonicalSpec)
            ? inquiryForm._id
            : `mg2a-form-${hash}`;
        result.form = { _type: "reference", _ref: formId };
        result._migrationForm = {
          _id: formId,
          _type: "form",
          title: "Project inquiry",
          notification_email,
          ...spec,
        };
      }
      for (const name of [
        "nameLabel",
        "emailLabel",
        "phoneLabel",
        "needLabel",
        "detailsLabel",
        "options",
        "note",
        "submitLabel",
        "successMessage",
        "errorMessage",
      ])
        delete result[name];
      changed ||= JSON.stringify(result) !== JSON.stringify(block);
      return result;
    });
    if (changed) {
      for (const block of page_builder) {
        if (block._migrationForm) {
          await client.createIfNotExists(block._migrationForm);
          delete block._migrationForm;
        }
      }
      await client
        .patch(doc._id)
        .ifRevisionId(doc._rev)
        .set({ page_builder })
        .commit();
      count++;
    }
  } else if (Object.hasOwn(doc, "inquiryEmail")) {
    await client
      .patch(doc._id)
      .ifRevisionId(doc._rev)
      .unset(["inquiryEmail"])
      .commit();
    count++;
  }
}
console.log(
  `Migrated ${count} documents. Existing form content preserved; recipients moved to forms. No submissions or email generated.`,
);
