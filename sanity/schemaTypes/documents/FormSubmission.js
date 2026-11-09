export default {
  name: "formSubmission",
  title: "Form submission",
  type: "document",
  liveEdit: true,
  fields: [
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
    {
      name: "fields",
      title: "Responses",
      type: "array",
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
  ],
  preview: {
    select: { title: "form_title", date: "submitted_at", status: "status" },
    prepare: ({ title, date, status }) => ({
      title: title || "Submission",
      subtitle: [date ? new Date(date).toLocaleString() : null, status]
        .filter(Boolean)
        .join(" · "),
    }),
  },
  orderings: [
    {
      title: "Newest first",
      name: "newest",
      by: [{ field: "submitted_at", direction: "desc" }],
    },
  ],
};
