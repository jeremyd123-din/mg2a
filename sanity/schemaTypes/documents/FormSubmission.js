import SubmissionResponsesInput from "@/sanity/components/SubmissionResponsesInput";
import { submissionIdentity } from "@/lib/forms/submissionIdentity";
import SubmissionAttachmentsInput from "@/sanity/components/SubmissionAttachmentsInput";
export default {
  name: "formSubmission",
  title: "Form submission",
  type: "document",
  liveEdit: true,
  fields: [
    {
      name: "fields",
      title: "Responses",
      type: "array",
      components: { input: SubmissionResponsesInput },
      readOnly: true,
      of: [
        {
          type: "object",
          name: "submittedField",
          fields: [
            { name: "name", title: "Field name", type: "string" },
            { name: "label", title: "Label", type: "string" },
            { name: "value", title: "Response", type: "text" },
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    },
    { name: "submitter_name", type: "string", hidden: true, readOnly: true },
    { name: "submitter_email", type: "string", hidden: true, readOnly: true },
    {
      name: "attachments",
      title: "Documents",
      type: "array",
      readOnly: true,
      components: { input: SubmissionAttachmentsInput },
      of: [
        {
          name: "submissionAttachment",
          type: "object",
          fields: [
            { name: "name", type: "string" },
            { name: "mime", type: "string" },
            { name: "bytes", type: "number" },
            { name: "field", type: "string" },
            { name: "chunks", type: "array", of: [{ type: "string" }] },
          ],
        },
      ],
    },
    { name: "form_title", title: "Form", type: "string", readOnly: true },
    {
      name: "form_id",
      title: "Form ID",
      type: "string",
      hidden: true,
      readOnly: true,
    },
    {
      name: "submitted_at",
      title: "Received",
      type: "datetime",
      readOnly: true,
    },
    { name: "page_url", title: "Page", type: "string", readOnly: true },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["new", "reviewed", "archived"] },
    },
    {
      name: "notification_email",
      title: "Notification recipients",
      type: "string",
      readOnly: true,
    },
    {
      name: "notification_status",
      title: "Email notification",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Sent", value: "sent" },
          { title: "Failed", value: "failed" },
          { title: "Not requested", value: "disabled" },
        ],
      },
    },
  ],
  preview: {
    select: {
      form: "form_title",
      name: "submitter_name",
      email: "submitter_email",
      responses: "fields",
      date: "submitted_at",
      status: "status",
    },
    prepare: ({ form, name, email, responses, date, status }) => {
      const identity = submissionIdentity(responses);
      return {
        title:
          name ||
          identity.name ||
          email ||
          identity.email ||
          form ||
          "Submission",
        subtitle: [form, date ? new Date(date).toLocaleString() : null, status]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "newest",
      by: [{ field: "submitted_at", direction: "desc" }],
    },
  ],
};
