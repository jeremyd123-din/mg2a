import { parseFields, recipients } from "@/lib/forms/definition";
import { inquiryForm } from "@/lib/forms/defaults";
export default {
  name: "form",
  title: "Form",
  type: "document",
  initialValue: {
    form_fields: inquiryForm.form_fields,
    button_title: "Send",
    thankyou_message: "Thank you. Your submission has been received.",
    error_message: "We could not save your submission. Please try again.",
    notification_email: "",
  },
  fields: [
    {
      name: "purpose",
      title: "Submission type",
      type: "string",
      initialValue: "general",
      options: {
        list: [
          { title: "General inquiry", value: "general" },
          { title: "Job application", value: "job" },
        ],
      },
      description:
        "Job applications must be linked to a published open position.",
    },
    {
      name: "title",
      title: "Form name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "notification_email",
      title: "Notification recipients",
      type: "string",
      description:
        "Email addresses that receive new submission notifications, separated by commas. Leave blank to save submissions without email notifications.",
      validation: (Rule) =>
        Rule.custom((value) => {
          try {
            recipients(value);
            return true;
          } catch (error) {
            return error.message;
          }
        }),
    },
    {
      name: "form_fields",
      title: "Fields (JSON)",
      type: "code",
      options: {
        language: "json",
        languageAlternatives: [{ title: "JSON", value: "json" }],
      },
      description:
        'Use an array of fields with name, type, label, required, and width (50 or 100). Select and radio fields also need options. Supported types: text, email, tel, url, number, date, textarea, select, radio, checkbox, hidden, file. Use group to organize fields into sections. Documents support PDF, JPG, PNG and TIFF. Set accept to "resume" for PDF or Word resumes. Up to 10 files and 4 MB total.',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          try {
            parseFields(value);
            return true;
          } catch (error) {
            return error.message;
          }
        }),
    },
    {
      name: "button_title",
      title: "Submit button",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    { name: "note", title: "Form note", type: "text", rows: 2 },
    {
      name: "thankyou_message",
      title: "Confirmation message",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    },
    { name: "error_message", title: "Error message", type: "text", rows: 2 },
  ],
  preview: { select: { title: "title", subtitle: "notification_email" } },
};
