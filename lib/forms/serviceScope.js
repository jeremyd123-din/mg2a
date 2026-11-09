import { inquiryFields } from "./defaults.js";
export const serviceScopeForm = {
  _id: "mg2a-service-scope",
  _type: "form",
  title: "Service inquiry",
  form_fields: {
    _type: "code",
    language: "json",
    code: JSON.stringify(
      [
        ...inquiryFields.slice(0, 3),
        {
          name: "site",
          type: "text",
          label: "Site address or PIN",
          width: 100,
          maxLength: 500,
        },
        inquiryFields.find((field) => field.name === "details"),
      ],
      null,
      2,
    ),
  },
  button_title: "Send request",
  thankyou_message: "Thank you. An engineer will follow up with next steps.",
  error_message:
    "We could not save your request. Please try again or call an office.",
};
