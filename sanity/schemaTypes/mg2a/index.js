import { scopedCss } from "../objects/commonFields";
import generated from "./generated.json";
import { resolveDefaultAssets } from "@/lib/mg2a/resolveDefaults";
import { careers, contact } from "@/lib/mg2a/defaults";
import homepage from "@/lib/mg2a/homepage.json";

const string = (name, title, extra = {}) => ({
  name,
  title,
  type: "string",
  ...extra,
});
const text = (name, title) => ({ name, title, type: "text", rows: 3 });
const linkFields = [
  string("label", "Label"),
  string("href", "Destination", {
    description:
      "A site path such as /services, an anchor, or a full https:// URL.",
    validation: (Rule) =>
      Rule.custom(
        (value) =>
          !value ||
          /^(\/(?!\/)|#|https?:\/\/|tel:|mailto:)/i.test(value) ||
          "Use a site path, anchor, HTTPS link, phone, or email link.",
      ),
  }),
];
const link = (name, title) => ({
  name,
  title,
  type: "object",
  fields: linkFields,
});
const links = (name, title) => ({
  name,
  title,
  type: "array",
  of: [
    {
      type: "object",
      name: "mg2a_link",
      fields: linkFields,
      preview: { select: { title: "label", subtitle: "href" } },
    },
  ],
});
const offices = {
  name: "offices",
  title: "Offices",
  type: "array",
  of: [{ type: "reference", to: [{ type: "mg2a_office" }] }],
};
const required = (Rule) => Rule.required();
const contactFields = [
  string("eyebrow", "Eyebrow"),
  string("title", "Heading"),
  text("description", "Introduction"),
  offices,
  ...["name", "email", "phone", "need", "details"].map((n) =>
    string(n + "Label", n[0].toUpperCase() + n.slice(1) + " field label", {
      validation: required,
    }),
  ),
  {
    name: "options",
    title: "“I need help with” options",
    type: "array",
    of: [{ type: "string" }],
    validation: (Rule) => Rule.min(1),
  },
  text("note", "Form note"),
  string("submitLabel", "Submit button", { validation: required }),
  text("successMessage", "Success message"),
  text("errorMessage", "Error message"),
];
const additional = [
  {
    name: "mg2a_careers",
    title: "MG2A - Careers",
    type: "object",
    fields: [
      string("eyebrow", "Eyebrow"),
      string("title", "Heading"),
      text("description", "Description"),
      link("primaryCta", "Primary button"),
      link("secondaryCta", "Secondary button"),
      string("jobsTitle", "Jobs heading"),
      {
        name: "jobs",
        title: "Confirmed open positions",
        description: "Only add positions approved by MG2A.",
        type: "array",
        of: [
          {
            type: "object",
            name: "job",
            fields: [
              string("title", "Title"),
              string("location", "Location / employment type"),
              string("href", "Destination"),
            ],
          },
        ],
      },
      text("emptyMessage", "Message when no positions are listed"),
    ],
  },
  {
    name: "mg2a_contactForm",
    title: "MG2A - Contact Form",
    type: "object",
    fields: contactFields,
  },
  {
    name: "mg2a_metrics",
    title: "MG2A - Metrics",
    type: "object",
    fields: [
      string("title", "Heading"),
      {
        name: "items",
        title: "Verified metrics",
        description:
          "Leave empty until actual figures have been confirmed. Bracketed placeholders cannot be published.",
        type: "array",
        of: [
          {
            type: "object",
            name: "metric",
            fields: [
              string("value", "Value", { validation: required }),
              string("label", "Label", { validation: required }),
            ],
          },
        ],
      },
    ],
  },
];
function enhance(fields) {
  return fields.map((field) => {
    const result = { ...field };
    if (field.type === "string" || field.type === "text") {
      result.validation = (Rule) =>
        Rule.custom(
          (value) =>
            !value ||
            !/\[[^\]]+\]/.test(value) ||
            "Replace bracketed placeholder text before publishing.",
        );
    }
    if (field.name.startsWith("href"))
      result.validation = linkFields[1].validation;
    if (field.fields) result.fields = enhance(field.fields);
    if (field.of)
      result.of = field.of.map((member) =>
        member.fields ? { ...member, fields: enhance(member.fields) } : member,
      );
    return result;
  });
}
const initials = [...homepage, careers, contact];
export const mg2aBlocks = [...generated.blocks, ...additional].map((block) => ({
  ...block,
  _menuCategory: "mg2a",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "style", title: "Style" },
  ],
  initialValue: {
    ...resolveDefaultAssets(initials.find((b) => b._type === block.name)),
    _key: undefined,
    block_category: "mg2a",
  },
  fields: [
    {
      name: "block_category",
      type: "string",
      hidden: true,
      initialValue: "mg2a",
    },
    ...enhance(block.fields).map((field) => ({ ...field, group: "content" })),
    {
      name: "spacing",
      title: "Vertical padding",
      type: "object",
      group: "style",
      description:
        "Pixels. Leave blank to use the approved design. Mobile overrides apply at 980px and below.",
      fields: [
        ...[
          ["paddingTop", "Top"],
          ["paddingBottom", "Bottom"],
          ["mobilePaddingTop", "Mobile top"],
          ["mobilePaddingBottom", "Mobile bottom"],
        ].map(([name, title]) => ({
          name,
          title,
          type: "number",
          validation: (Rule) => Rule.min(0).max(600),
        })),
      ],
    },
    {
      ...scopedCss,
      description:
        "Applies only to this section instance. Use declarations directly or nested selectors, e.g. padding-top: 80px; h2 { max-width: 700px; }.",
    },
  ],
  preview: {
    select: { title: "title", eyebrow: "eyebrow" },
    prepare: ({ title, eyebrow }) => ({
      title: title || block.title,
      subtitle: eyebrow || block.title,
    }),
  },
}));
export const mg2aDocuments = [
  ...generated.documents.map((doc) => ({
    ...doc,
    fields: enhance(doc.fields).concat(
      doc.name === "mg2a_serviceCategory"
        ? [
            string("icon", "Icon", {
              options: {
                list: [
                  "survey",
                  "design",
                  "water",
                  "permitting",
                  "construction",
                  "documentation",
                  "cost",
                ],
              },
            }),
          ]
        : [],
    ),
  })),
  {
    name: "mg2a_office",
    title: "MG2A - Office",
    type: "document",
    fields: [
      string("name", "Office name", { validation: required }),
      string("street", "Street address"),
      string("city", "City, state and ZIP"),
      string("phone", "Display phone"),
      string("telephone", "Phone link number", {
        description: "Include country code, for example +18159394921.",
      }),
    ],
    preview: { select: { title: "name", subtitle: "phone" } },
  },
  {
    name: "mg2a_settings",
    title: "MG2A - Global Header & Footer",
    type: "document",
    groups: [
      { name: "header", title: "Header", default: true },
      { name: "footer", title: "Footer" },
      { name: "brand", title: "Brand & themes" },
      { name: "forms", title: "Inquiries" },
    ],
    fields: [
      string("title", "Title", { hidden: true }),
      string("organization", "Company name", { group: "brand" }),
      { ...text("logoCaption", "Logo caption"), rows: 2, group: "brand" },
      string("footerLicense", "Footer license statement", { group: "footer" }),
      { name: "logo", title: "White logo", type: "image", group: "brand" },
      string("license", "License statement", { group: "header" }),
      { ...links("primaryLinks", "Main navigation"), group: "header" },
      { ...link("primaryCta", "Primary button"), group: "header" },
      { ...link("secondaryCta", "Secondary button"), group: "header" },
      { ...link("careersLink", "Careers utility link"), group: "header" },
      string("clientAccessLabel", "Client Access label", { group: "header" }),
      {
        name: "clientAccessUrl",
        title: "G2X Client Access URL",
        type: "url",
        group: "header",
        description:
          "Pending client confirmation. Leave blank to hide the link.",
        validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
      },
      { ...offices, group: "header" },
      { ...text("description", "Company description"), group: "footer" },
      { ...links("serviceLinks", "Services links"), group: "footer" },
      { ...links("companyLinks", "Company links"), group: "footer" },
      ...["Services", "Company", "Offices"].map((n) =>
        string("footer" + n + "Title", n + " column title", {
          group: "footer",
        }),
      ),
      string("orange", "Orange accent", {
        group: "brand",
        initialValue: "orange",
        options: { list: ["orange", "earth"] },
      }),
      string("flip", "Flip card blue", {
        group: "brand",
        initialValue: "new",
        options: { list: ["new", "current"] },
      }),
      string("inquiryEmail", "Inquiry recipient", {
        group: "forms",
        description:
          "Temporary development recipient: parasbokhari@gmail.com. Replace with the client’s approved address before launch.",
        validation: (Rule) => Rule.required().email(),
      }),
    ],
    preview: { select: { title: "title" } },
  },
];
