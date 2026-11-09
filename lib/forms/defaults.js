export const inquiryFields = [
  { name: "name", type: "text", label: "Name", required: true, maxLength: 150 },
  {
    name: "email",
    type: "email",
    label: "Email",
    required: true,
    maxLength: 254,
  },
  { name: "phone", type: "tel", label: "Phone", maxLength: 40 },
  {
    name: "need",
    type: "select",
    label: "I need help with",
    required: true,
    options: [
      "A survey",
      "Site or subdivision design",
      "Stormwater or floodplain",
      "Permitting",
      "Construction services",
      "Municipal engineering",
      "Not sure yet",
    ],
  },
  {
    name: "details",
    type: "textarea",
    label: "Project details",
    required: true,
    maxLength: 5000,
    width: 100,
  },
];
export const inquiryForm = {
  _id: "mg2a-project-inquiry",
  _type: "form",
  title: "Project inquiry",
  form_fields: {
    _type: "code",
    language: "json",
    code: JSON.stringify(inquiryFields, null, 2),
  },
  button_title: "Send inquiry",
  note: "Have site plans or a plat? You can attach them after we reply.",
  thankyou_message: "Thank you. Your inquiry has been sent to our team.",
  error_message:
    "We could not save your inquiry. Please try again or call an office.",
};
