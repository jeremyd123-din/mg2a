import { prepareAttachments, MAX_UPLOAD_BYTES } from "@/lib/forms/attachments";
import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { Resend } from "resend";
import {
  parseFields,
  recipients,
  validateValues,
} from "@/lib/forms/definition";
const reply = (error, status = 400) => NextResponse.json({ error }, { status });
export async function POST(request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return reply("Invalid origin", 403);
  const multipart = request.headers
    .get("content-type")
    ?.includes("multipart/form-data");
  if (
    Number(request.headers.get("content-length")) >
    (multipart ? MAX_UPLOAD_BYTES + 100000 : 40000)
  )
    return reply("Request too large", 413);
  let input;
  const uploads = [];
  try {
    let raw;
    if (multipart) {
      const form = await request.formData();
      raw = form.get("payload");
      for (const [name, file] of form.entries())
        if (
          name.startsWith("attachment:") &&
          typeof file !== "string" &&
          file.size
        )
          uploads.push({ field: name.slice(11), file });
    } else raw = await request.text();
    if (raw.length > 40000) return reply("Request too large", 413);
    input = JSON.parse(raw);
  } catch {
    return reply("Invalid request");
  }
  if (!input || typeof input !== "object" || Array.isArray(input))
    return reply("Invalid request");
  if (input.website || input.values?._honeypot)
    return NextResponse.json({ success: true });
  if (
    !/^[a-zA-Z0-9_-]{1,128}$/.test(input.formId || "") ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      input.requestId || "",
    )
  )
    return reply("Invalid form request");
  if (!process.env.SANITY_TOKEN)
    return reply("Submissions are unavailable. Please call an office.", 503);
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: "production",
    apiVersion: "2025-02-19",
    useCdn: false,
    token: process.env.SANITY_TOKEN,
    perspective: "raw",
  });
  const id = `submissions.${input.requestId}`; // Authenticated-only document path, never a public root ID.
  try {
    const form = await client.fetch('*[_type=="form" && _id==$id][0]', {
      id: input.formId,
    });
    if (!form) return reply("This form is unavailable.", 404);
    let fields, recipientsList, definition;
    try {
      definition = parseFields(form.form_fields);
      recipientsList = recipients(form.notification_email);
    } catch {
      return reply("This form is not configured. Please call an office.", 503);
    }
    try {
      fields = validateValues(definition, input.values);
    } catch (error) {
      return reply(error.message);
    }
    const existing = await client.fetch("*[_id==$id][0]{form_id}", { id });
    if (existing)
      return existing.form_id === form._id
        ? NextResponse.json({ success: true })
        : reply("Invalid form request");
    const pagePath =
      typeof input.pagePath === "string" && /^\/(?!\/)/.test(input.pagePath)
        ? input.pagePath.slice(0, 1000).split("?")[0].split("#")[0]
        : "/";
    let files;
    try {
      files = await prepareAttachments(uploads, definition, id);
    } catch (error) {
      return reply(error.message);
    }
    const submission = {
      _id: id,
      _type: "formSubmission",
      form_id: form._id,
      form_title: form.title,
      submitted_at: new Date().toISOString(),
      page_url: pagePath,
      status: "new",
      notification_email: recipientsList.join(", "),
      notification_status: recipientsList.length ? "pending" : "disabled",
      fields,
      attachments: files.attachments,
    };
    if (files.documents.length) {
      let transaction = client.transaction().createIfNotExists(submission);
      for (const document of files.documents)
        transaction = transaction.createIfNotExists(document);
      await transaction.commit();
    } else await client.createIfNotExists(submission);
    if (recipientsList.length) {
      let notificationStatus = "failed";
      try {
        if (!process.env.RESEND_API_KEY)
          throw new Error("Email not configured");
        const emailField = definition.find((field) => field.type === "email");
        const replyTo = fields.find(
          (field) => field.name === emailField?.name,
        )?.value;
        const result = await new Resend(process.env.RESEND_API_KEY).emails.send(
          {
            from:
              process.env.MG2A_INQUIRY_FROM || "MG2A Forms <forms@janoova.com>",
            to: recipientsList,
            ...(replyTo ? { replyTo } : {}),
            subject: `New submission: ${String(form.title)
              .replace(/[\r\n]/g, " ")
              .slice(0, 150)}`,
            text:
              `Form: ${form.title}\nPage: ${pagePath}\n\n` +
              fields
                .map((field) => `${field.label}: ${field.value}`)
                .join("\n\n"),
          },
          { idempotencyKey: `mg2a-${input.requestId}` },
        );
        if (!result.error) notificationStatus = "sent";
      } catch {
        /* The submission is already safely stored; email delivery is tracked separately. */
      }
      try {
        await client
          .patch(id)
          .set({ notification_status: notificationStatus })
          .commit();
      } catch {
        console.error("Unable to update submission notification status");
      }
    }
    return NextResponse.json({ success: true });
  } catch {
    console.error("Unable to store form submission");
    return reply("We could not save your submission. Please try again.", 503);
  }
}
