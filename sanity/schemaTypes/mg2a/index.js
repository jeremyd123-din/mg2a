import { serviceBlocks } from "./services";
import { serviceExamples } from "@/lib/mg2a/serviceDefaults";
import { createElement } from "react";
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
const primaryLinks = links("primaryLinks", "Main navigation");
primaryLinks.of[0].fields = [
  ...linkFields,
  {
    name: "groups",
    title: "Subnavigation groups",
    type: "array",
    description:
      "Only Services and Industries have subnavigation. Other navigation entries remain direct links.",
    hidden: ({ parent }) =>
      !["/services", "/industries"].includes(parent?.href),
    of: [
      {
        type: "object",
        name: "navigationGroup",
        fields: [...linkFields, links("links", "Launch pages")],
        preview: { select: { title: "label" } },
      },
    ],
  },
];
const offices = {
  name: "offices",
  title: "Offices",
  type: "array",
  of: [
    {
      name: "office",
      type: "object",
      fields: [
        string("name", "Office name", {
          validation: (Rule) => Rule.required(),
        }),
        string("street", "Street address"),
        string("city", "City, state and ZIP"),
        string("phone", "Display phone"),
        string("telephone", "Phone link number", {
          description: "Include the country code, for example +18159394921.",
        }),
      ],
      preview: { select: { title: "name", subtitle: "phone" } },
    },
  ],
};
const required = (Rule) => Rule.required();
const contactFields = [
  string("eyebrow", "Eyebrow"),
  string("title", "Heading"),
  text("description", "Introduction"),
  {
    name: "form",
    title: "Form",
    type: "reference",
    to: [{ type: "form" }],
    validation: required,
    description:
      "Select the form to display. Manage its fields and notification recipients under Forms.",
  },
];
const additional = [
  {
    name: "mg2a_careers",
    title: "MG2A - Careers",
    description:
      "Automatically displays published Open Positions with status Open, in display order.",
    type: "object",
    fields: [
      string("eyebrow", "Eyebrow"),
      string("title", "Heading"),
      text("description", "Description"),
      link("primaryCta", "Primary button"),
      link("secondaryCta", "Secondary button"),
      string("jobsTitle", "Jobs heading"),
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
        title: "Metrics",
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
const initials = [...homepage, careers, contact, ...serviceExamples];
export const mg2aBlocks = [
  ...generated.blocks,
  ...additional,
  ...serviceBlocks,
].map((block) => ({
  ...block,
  title: block.title.replace(/^MG2A - /, ""),
  _menuCategory: "mg2a",
  _libraryGroup: serviceBlocks.some((service) => service.name === block.name)
    ? "services"
    : "homepage",
  options: { modal: { type: "dialog", width: 1 } },
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "style", title: "Style" },
  ],
  initialValue: {
    ...resolveDefaultAssets(initials.find((b) => b._type === block.name)),
    _key: undefined,
    anchor: undefined,
    navigationLabel: undefined,
    block_category: "mg2a",
  },
  fields: [
    {
      name: "block_category",
      type: "string",
      hidden: true,
      initialValue: "mg2a",
    },
    {
      name: "editorLabel",
      title: "Module label",
      type: "string",
      group: "content",
      description:
        "Optional name for this module in the page builder. It does not appear on the website.",
    },
    ...enhance(block.fields).map((field) => ({ ...field, group: "content" })),
    ...(serviceBlocks.some((service) => service.name === block.name)
      ? [
          {
            name: "anchor",
            title: "Section anchor",
            type: "string",
            group: "style",
            description:
              "Optional name for linking to this section, without #.",
            validation: (Rule) =>
              Rule.custom(
                (value) =>
                  !value ||
                  /^[a-z][a-z0-9-]*$/.test(value) ||
                  "Use lowercase letters, numbers and hyphens.",
              ),
          },
          {
            name: "navigationLabel",
            title: "Contents menu label",
            type: "string",
            group: "style",
            description:
              "Optional shorter label for the contents menu. Defaults to the section heading.",
          },
        ]
      : []),
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
    select: { editorLabel: "editorLabel", title: "title", eyebrow: "eyebrow" },
    prepare: ({ editorLabel, title, eyebrow }) => ({
      title: editorLabel || block.title.replace(/^MG2A - /, ""),
      subtitle:
        title ||
        eyebrow ||
        block.description ||
        "Edit module content and style",
      media: createElement("img", {
        src: `/mg2a/block-previews/${block.name}.jpg`,
        alt: block.title,
        style: { width: "100%", height: "100%", objectFit: "contain" },
      }),
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
    name: "mg2a_job",
    title: "Open Position",
    type: "document",
    initialValue: { status: "open", order: 0 },
    fields: [
      string("title", "Position title", {
        validation: required,
      }),
      string("location", "Location / employment type"),
      string("href", "Application or detail page link", {
        description: "Link to the position details or application page.",
        validation: linkFields[1].validation,
      }),
      string("status", "Status", {
        initialValue: "open",
        options: {
          list: [
            { title: "Open", value: "open" },
            { title: "Closed", value: "closed" },
          ],
        },
        validation: (Rule) => Rule.required(),
      }),
      {
        name: "order",
        title: "Display order",
        type: "number",
        initialValue: 0,
        validation: (Rule) => Rule.integer().min(0),
      },
    ],
    orderings: [
      {
        title: "Display order",
        name: "displayOrder",
        by: [{ field: "order", direction: "asc" }],
      },
    ],
    preview: { select: { title: "title", subtitle: "location" } },
  },
  {
    name: "mg2a_settings",
    title: "MG2A - Site Settings",
    type: "document",
    groups: [
      { name: "header", title: "Header", default: true },
      { name: "footer", title: "Footer" },
      { name: "brand", title: "Brand & themes" },
      { name: "offices", title: "Offices" },
      { name: "seo", title: "SEO & Analytics" },
    ],
    fields: [
      string("title", "Title", { hidden: true }),
      string("organization", "Company name", { group: "brand" }),
      { ...text("logoCaption", "Logo caption"), rows: 2, group: "brand" },
      string("footerLicense", "Footer license statement", { group: "footer" }),
      { name: "logo", title: "White logo", type: "image", group: "brand" },
      string("license", "License statement", { group: "header" }),
      { ...primaryLinks, group: "header" },
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
          "Enter the client portal URL. Leave blank to display the label without a link.",
        validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
      },
      { ...offices, group: "offices" },
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
      {
        name: "disable_indexing",
        title: "Disable search indexing",
        type: "boolean",
        group: "seo",
        initialValue: true,
      },
      {
        name: "og_image",
        title: "Default social sharing image",
        type: "image",
        group: "seo",
        options: { hotspot: true },
      },
      string("gtm_id", "Google Tag Manager ID", {
        group: "seo",
        description: "Leave blank to disable analytics.",
      }),
    ],
    preview: { select: { title: "title" } },
  },
];
