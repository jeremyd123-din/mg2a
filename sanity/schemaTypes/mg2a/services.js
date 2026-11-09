export const serviceOverviewModuleNames = [
  "mg2a_serviceHero",
  "mg2a_projectStage",
  "mg2a_practiceOverview",
  "mg2a_serviceCards",
  "mg2a_processSteps",
  "mg2a_relatedProjects",
  "mg2a_faq",
  "mg2a_ctaBanner",
];
export const serviceInnerModuleNames = [
  "mg2a_serviceHero",
  "mg2a_serviceContent",
  "mg2a_practiceOverview",
  "mg2a_checklist",
  "mg2a_deliverables",
  "mg2a_processSteps",
  "mg2a_faq",
  "mg2a_relatedServices",
  "mg2a_scopeForm",
];
const string = (name, title, extra = {}) => ({
  name,
  title,
  type: "string",
  ...extra,
});
const text = (name, title) => ({ name, title, type: "text", rows: 3 });
const link = (name, title) => ({
  name,
  title,
  type: "object",
  options: { columns: 2 },
  fields: [
    string("label", "Text"),
    string("href", "Link", {
      description: "A site path, section anchor, phone link, or full URL.",
      validation: (Rule) =>
        Rule.custom(
          (value) =>
            !value ||
            /^(\/(?!\/)|#|https?:\/\/|tel:|mailto:)/i.test(value) ||
            "Enter a site path, anchor, phone or web link.",
        ),
    }),
  ],
});
const items = (name, title, member, fields) => ({
  name,
  title,
  type: "array",
  of: [
    {
      name: member,
      type: "object",
      fields,
      preview: {
        select: {
          title: fields.some((f) => f.name === "title")
            ? "title"
            : fields.some((f) => f.name === "question")
              ? "question"
              : "label",
          subtitle: "description",
        },
      },
    },
  ],
});
const body = {
  name: "body",
  title: "Text",
  type: "array",
  of: [
    {
      type: "block",
      styles: [{ title: "Paragraph", value: "normal" }],
      lists: [
        { title: "Bullets", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [string("href", "URL")],
          },
        ],
      },
    },
  ],
};
const heading = [string("eyebrow", "Eyebrow"), string("title", "Heading")];
const steps = items("steps", "Steps", "processStep", [
  string("title", "Heading"),
  text("description", "Description"),
]);
export const articleBlockNames = [
  "mg2a_practiceOverview",
  "mg2a_checklist",
  "mg2a_deliverables",
  "mg2a_processSteps",
  "mg2a_faq",
  "mg2a_relatedServices",
];
export const serviceBlocks = [
  {
    name: "mg2a_serviceContent",
    title: "Service content",
    description:
      "A sticky contents menu beside reorderable text, cards, process steps and FAQs.",
    type: "object",
    fields: [
      string("title", "Contents menu heading"),
      {
        name: "sections",
        title: "Content sections",
        type: "array",
        of: articleBlockNames.map((type) => ({ type })),
        options: {
          sortable: true,
          insertMenu: {
            filter: true,
            views: [
              {
                name: "grid",
                previewImageUrl: (type) => `/mg2a/block-previews/${type}.jpg`,
              },
              { name: "list" },
            ],
          },
        },
      },
      items("additionalLinks", "Additional contents links", "contentsLink", [
        string("label", "Label"),
        string("href", "Link"),
      ]),
    ],
  },
  {
    name: "mg2a_serviceHero",
    title: "Service hero",
    description:
      "Page heading, breadcrumbs, buttons and an image or key facts.",
    type: "object",
    fields: [
      ...heading,
      text("description", "Introduction"),
      string("variant", "Side panel", {
        options: {
          list: [
            { title: "Image", value: "image" },
            { title: "Key facts", value: "facts" },
          ],
        },
      }),
      items("breadcrumbs", "Breadcrumbs", "breadcrumb", [
        string("label", "Label"),
        string("href", "Link"),
      ]),
      link("buttonOne", "Button one"),
      link("buttonTwo", "Button two"),
      {
        name: "image",
        title: "Image",
        type: "image",
        options: { hotspot: true },
        hidden: ({ parent }) => parent?.variant !== "image",
      },
      string("alt", "Image description", {
        hidden: ({ parent }) => parent?.variant !== "image",
      }),
      string("caption", "Image caption", {
        hidden: ({ parent }) => parent?.variant !== "image",
      }),
      items("facts", "Key facts", "fact", [
        string("label", "Label"),
        string("value", "Value"),
      ]),
    ],
  },
  {
    name: "mg2a_projectStage",
    title: "Project stage",
    description: "Highlight where this service fits in a project.",
    type: "object",
    fields: [
      string("title", "Label"),
      items("stages", "Stages", "stage", [string("title", "Stage name")]),
      {
        name: "activeStage",
        title: "Highlighted stage number",
        type: "number",
        validation: (Rule) => Rule.integer().min(1),
      },
      string("activeLabel", "Highlighted stage label"),
    ],
  },
  {
    name: "mg2a_practiceOverview",
    title: "Overview text",
    description: "Editable text with an optional audience card.",
    type: "object",
    fields: [
      ...heading,
      body,
      string("audienceTitle", "Audience card heading"),
      {
        name: "audiences",
        title: "Audiences",
        type: "array",
        of: [{ type: "string" }],
      },
      link("audienceLink", "Audience card link"),
    ],
  },
  {
    name: "mg2a_serviceCards",
    title: "Service cards",
    description: "Service cards with optional highlighting and related links.",
    type: "object",
    fields: [
      string("title", "Heading"),
      items("items", "Services", "serviceCard", [
        string("title", "Heading"),
        text("description", "Description"),
        string("href", "Link"),
        string("label", "Link text"),
        {
          name: "featured",
          title: "Highlight card",
          type: "boolean",
          initialValue: false,
        },
      ]),
      string("pairedTitle", "Related links label"),
      items("pairedLinks", "Related links", "pairedLink", [
        string("label", "Label"),
        string("href", "Link"),
      ]),
    ],
  },
  {
    name: "mg2a_processSteps",
    title: "Process steps",
    description: "Numbered steps displayed as columns or a vertical list.",
    type: "object",
    fields: [
      ...heading,
      string("layout", "Layout", {
        options: {
          list: [
            { title: "Columns", value: "grid" },
            { title: "Vertical list", value: "list" },
          ],
        },
      }),
      steps,
    ],
  },
  {
    name: "mg2a_relatedProjects",
    title: "Related projects",
    description:
      "Select shared project records and add a page-specific description.",
    type: "object",
    fields: [
      string("title", "Heading"),
      link("allProjectsLink", "All projects link"),
      {
        name: "items",
        title: "Projects",
        type: "array",
        of: [
          {
            name: "relatedProject",
            type: "object",
            fields: [
              {
                name: "project",
                title: "Project",
                type: "reference",
                to: [{ type: "mg2a_project" }],
                validation: (Rule) => Rule.required(),
              },
              text("description", "Description for this page"),
              string("imagePosition", "Image position", {
                description: "CSS position such as 50% 50%.",
              }),
            ],
            preview: {
              select: {
                title: "project.title",
                subtitle: "description",
                media: "project.image",
              },
            },
          },
        ],
      },
    ],
  },
  {
    name: "mg2a_faq",
    title: "Frequently asked questions",
    description: "Questions and answers in a split or stacked layout.",
    type: "object",
    fields: [
      ...heading,
      text("description", "Introduction"),
      string("layout", "Layout", {
        options: {
          list: [
            { title: "Heading beside questions", value: "split" },
            { title: "Heading above questions", value: "stacked" },
          ],
        },
      }),
      items("items", "Questions", "faqItem", [
        string("question", "Question"),
        text("answer", "Answer"),
      ]),
    ],
  },
  {
    name: "mg2a_ctaBanner",
    title: "Call to action",
    description: "Full-width blue banner with a heading and two buttons.",
    type: "object",
    fields: [
      string("title", "Heading"),
      text("description", "Description"),
      link("buttonOne", "Button one"),
      link("buttonTwo", "Button two"),
    ],
  },
  {
    name: "mg2a_checklist",
    title: "Checklist",
    description: "A list of situations, requirements or benefits.",
    type: "object",
    fields: [
      string("title", "Heading"),
      {
        name: "items",
        title: "Items",
        type: "array",
        of: [{ type: "string" }],
      },
    ],
  },
  {
    name: "mg2a_deliverables",
    title: "Deliverables",
    description: "Numbered cards describing what the service includes.",
    type: "object",
    fields: [
      string("title", "Heading"),
      items("items", "Deliverables", "deliverable", [
        string("title", "Heading"),
        text("description", "Description"),
      ]),
    ],
  },
  {
    name: "mg2a_relatedServices",
    title: "Related services",
    description: "Compact links to related service pages.",
    type: "object",
    fields: [
      string("title", "Label"),
      items("items", "Services", "relatedService", [
        string("eyebrow", "Category"),
        string("title", "Heading"),
        string("href", "Link"),
      ]),
    ],
  },
  {
    name: "mg2a_scopeForm",
    title: "Service inquiry form",
    description: "A reusable form beside a heading and contact number.",
    type: "object",
    fields: [
      ...heading,
      text("description", "Introduction"),
      link("phone", "Phone link"),
      {
        name: "form",
        title: "Form",
        type: "reference",
        to: [{ type: "form" }],
        validation: (Rule) => Rule.required(),
      },
    ],
  },
];
