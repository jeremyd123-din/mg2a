const s = (name, title, extra = {}) => ({
  name,
  title,
  type: "string",
  ...extra,
});
const t = (name, title) => ({ name, title, type: "text", rows: 3 });
const heading = [s("eyebrow", "Eyebrow"), s("title", "Heading")];
const body = {
  name: "body",
  title: "Text",
  type: "array",
  of: [{ type: "block" }],
};
const link = (name, title) => ({
  name,
  title,
  type: "object",
  fields: [s("label", "Text"), s("href", "Link")],
});
const list = (name, title, fields) => ({
  name,
  title,
  type: "array",
  of: [
    {
      type: "object",
      name: name + "Item",
      fields,
      preview: { select: { title: "title", subtitle: "description" } },
    },
  ],
});
const image = {
  name: "image",
  title: "Image",
  type: "image",
  options: { hotspot: true },
};
export const aboutModuleNames = [
  "mg2a_companyHero",
  "mg2a_companyStory",
  "mg2a_companyFeatures",
  "mg2a_teamGrid",
  "mg2a_clientList",
  "mg2a_offices",
  "mg2a_ctaBanner",
  "mg2a_memberProfile",
];
export const careersModuleNames = [
  "mg2a_companyHero",
  "mg2a_companyFeatures",
  "mg2a_benefits",
  "mg2a_jobList",
  "mg2a_graduateCta",
  "mg2a_jobApplication",
  "mg2a_companyStory",
];
export const companyBlocks = [
  {
    name: "mg2a_companyHero",
    title: "Company hero",
    fields: [
      ...heading,
      t("description", "Introduction"),
      s("breadcrumb", "Breadcrumb label"),
      image,
      s("variant", "Layout", {
        options: {
          list: [
            { title: "About — photograph", value: "about" },
            { title: "Careers — contours", value: "careers" },
          ],
        },
      }),
      link("buttonOne", "Button one"),
      link("buttonTwo", "Button two"),
      s("asideTitle", "Sidebar heading"),
      {
        name: "asideItems",
        title: "Sidebar items",
        type: "array",
        of: [{ type: "string" }],
      },
      t("asideNote", "Sidebar note"),
    ],
  },
  {
    name: "mg2a_companyStory",
    title: "Story and numbers",
    fields: [
      ...heading,
      body,
      list("items", "Numbers", [s("value", "Value"), s("title", "Label")]),
    ],
  },
  {
    name: "mg2a_companyFeatures",
    title: "Feature cards",
    fields: [
      ...heading,
      s("variant", "Layout", {
        options: {
          list: [
            { title: "Numbered columns", value: "columns" },
            { title: "Boxed cards", value: "cards" },
          ],
        },
      }),
      list("items", "Cards", [
        s("title", "Heading"),
        t("description", "Description"),
      ]),
    ],
  },
  {
    name: "mg2a_teamGrid",
    title: "Team listing",
    description: "Automatically lists published team members in display order.",
    fields: [
      ...heading,
      link("link", "Link"),
      t("emptyMessage", "Message when no team members are published"),
    ],
  },
  {
    name: "mg2a_clientList",
    title: "Selected clients",
    fields: [
      ...heading,
      {
        name: "items",
        title: "Clients",
        type: "array",
        of: [{ type: "string" }],
      },
    ],
  },
  {
    name: "mg2a_offices",
    title: "Office cards",
    description:
      "Office addresses and telephone numbers come from Site Settings → Offices.",
    fields: heading,
  },
  {
    name: "mg2a_benefits",
    title: "Benefits list",
    fields: [
      ...heading,
      t("description", "Introduction"),
      {
        name: "items",
        title: "Benefits",
        type: "array",
        of: [{ type: "string" }],
      },
    ],
  },
  {
    name: "mg2a_jobList",
    title: "Job listing",
    description:
      "Automatically lists published open positions in display order.",
    fields: [
      ...heading,
      t("emptyMessage", "Message when no positions are open"),
    ],
  },
  {
    name: "mg2a_graduateCta",
    title: "Graduate call to action",
    fields: [
      ...heading,
      t("description", "Description"),
      link("link", "Button"),
    ],
  },
  {
    name: "mg2a_memberProfile",
    title: "Team member profile",
    description:
      "Displays the name, portrait, role, biography and contact details from this Team member.",
    fields: [s("title", "Biography heading")],
  },
  {
    name: "mg2a_jobApplication",
    title: "Job application form",
    fields: [
      ...heading,
      t("description", "Introduction"),
      {
        name: "form",
        title: "Form",
        type: "reference",
        to: [{ type: "form" }],
        validation: (Rule) => Rule.required(),
      },
    ],
  },
].map((block) => ({ ...block, type: "object" }));
export const memberInitialBlocks = [
  { _type: "mg2a_memberProfile", _key: "profile", title: "Background" },
  {
    _type: "mg2a_ctaBanner",
    _key: "contact",
    eyebrow: "Work with MG2A",
    title: "Let’s build something strong.",
    description: "Tell us about your next project.",
    buttonOne: { label: "Start a project", href: "/contact" },
  },
];
export const jobInitialBlocks = [
  { _type: "mg2a_pageHero", _key: "hero", breadcrumb: "Careers" },
  {
    _type: "mg2a_companyStory",
    _key: "details",
    eyebrow: "The role",
    title: "About this position",
  },
  {
    _type: "mg2a_jobApplication",
    _key: "application",
    eyebrow: "Apply",
    title: "Send us your application",
    description: "Tell us about yourself and attach your resume.",
    form: { _type: "reference", _ref: "mg2a-job-application" },
  },
];
export function profileFields(kind) {
  return [
    {
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) =>
        Rule.required().custom(
          (v) =>
            !v?.current ||
            /^[a-z0-9-]+$/.test(v.current) ||
            "Use lowercase letters, numbers and hyphens.",
        ),
    },
    t("summary", "Introduction"),
    body,
    s("meta_title", "SEO title"),
    t("meta_description", "SEO description"),
    {
      name: "seo_no_index",
      title: "Do not index this page",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "page_builder",
      title: "Page Builder",
      type: "array",
      of: (kind === "team"
        ? [
            "mg2a_memberProfile",
            "mg2a_companyStory",
            "mg2a_ctaBanner",
            "mg2a_imageGallery",
          ]
        : [
            "mg2a_pageHero",
            "mg2a_companyStory",
            "mg2a_companyFeatures",
            "mg2a_benefits",
            "mg2a_jobApplication",
            "mg2a_faq",
          ]
      ).map((type) => ({ type })),
      options: {
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
  ];
}
export const teamDocument = {
  name: "mg2a_team",
  title: "Team member",
  type: "document",
  initialValue: {
    order: 0,
    seo_no_index: false,
    page_builder: memberInitialBlocks,
  },
  fields: [
    s("title", "Name", { validation: (Rule) => Rule.required() }),
    s("role", "Position / title"),
    image,
    s("alt", "Portrait description"),
    s("email", "Email address", { validation: (Rule) => Rule.email() }),
    s("phone", "Telephone"),
    { name: "order", title: "Display order", type: "number", initialValue: 0 },
    ...profileFields("team"),
  ],
  preview: { select: { title: "title", subtitle: "role", media: "image" } },
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
};
