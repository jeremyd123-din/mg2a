const s = (name, title, extra = {}) => ({
    name,
    title,
    type: "string",
    ...extra,
  }),
  t = (name, title) => ({ name, title, type: "text", rows: 3 });
const link = (name, title) => ({
  name,
  title,
  type: "object",
  fields: [s("label", "Text"), s("href", "Link")],
});
const array = (name, title, fields, itemType = name + "Item") => ({
  name,
  title,
  type: "array",
  of: [
    {
      type: "object",
      name: itemType,
      fields,
      preview: {
        select: {
          title: fields.some((f) => f.name === "title") ? "title" : "label",
          subtitle: "description",
        },
      },
    },
  ],
});
const image = (name = "image", title = "Image") => ({
  name,
  title,
  type: "image",
  options: { hotspot: true },
});
const body = {
  name: "body",
  title: "Text",
  type: "array",
  of: [{ type: "block" }],
};
const heading = [s("eyebrow", "Eyebrow"), s("title", "Heading")];
export const projectModuleNames = [
  "mg2a_projectHero",
  "mg2a_projectFacts",
  "mg2a_projectStats",
  "mg2a_projectStory",
  "mg2a_imageGallery",
  "mg2a_projectGrid",
];
export const industryModuleNames = [
  "mg2a_pageHero",
  "mg2a_projectHero",
  "mg2a_communityStrip",
  "mg2a_industrySupport",
  "mg2a_industryPrograms",
  "mg2a_testimonialProject",
  "mg2a_industryListing",
  "mg2a_faq",
  "mg2a_ctaBanner",
];
export const expansionBlocks = [
  {
    name: "mg2a_pageHero",
    title: "Page hero",
    type: "object",
    fields: [
      s("title", "Heading"),
      t("description", "Introduction"),
      s("breadcrumb", "Breadcrumb label"),
    ],
  },
  {
    name: "mg2a_projectHero",
    title: "Photo hero",
    type: "object",
    fields: [
      ...heading,
      t("description", "Introduction"),
      image(),
      s("breadcrumb", "Breadcrumb label"),
      s("variant", "Layout", {
        options: {
          list: [
            { title: "Project", value: "project" },
            { title: "Industry", value: "industry" },
          ],
        },
      }),
      link("buttonOne", "Button one"),
      link("buttonTwo", "Button two"),
      t("trustStatement", "Trust statement"),
    ],
  },
  {
    name: "mg2a_projectFacts",
    title: "Project facts",
    type: "object",
    fields: [
      array(
        "items",
        "Facts",
        [s("label", "Label"), s("value", "Value")],
        "projectFact",
      ),
    ],
  },
  {
    name: "mg2a_projectStats",
    title: "Project numbers",
    type: "object",
    fields: [
      s("title", "Label"),
      array(
        "items",
        "Numbers",
        [s("value", "Value"), s("label", "Label")],
        "projectStat",
      ),
    ],
  },
  {
    name: "mg2a_projectStory",
    title: "Project story",
    type: "object",
    fields: [
      s("title", "Heading"),
      body,
      s("scopeTitle", "Scope heading"),
      {
        name: "scope",
        title: "Scope items",
        type: "array",
        of: [{ type: "string" }],
      },
      s("permitsTitle", "Permits heading"),
      t("permits", "Permits"),
      s("servicesTitle", "Services heading"),
      array(
        "services",
        "Services",
        [s("label", "Label"), s("href", "Link")],
        "storyLink",
      ),
      s("ctaTitle", "Call to action heading"),
      t("ctaText", "Call to action text"),
      link("ctaLink", "Call to action link"),
    ],
  },
  {
    name: "mg2a_imageGallery",
    title: "Image gallery",
    type: "object",
    fields: [
      s("title", "Label"),
      array(
        "items",
        "Images",
        [
          image(),
          s("alt", "Image description"),
          s("caption", "Caption"),
          s("position", "Image position"),
        ],
        "galleryImage",
      ),
    ],
  },
  {
    name: "mg2a_projectGrid",
    title: "Project grid",
    description: "Automatically lists published projects.",
    type: "object",
    fields: [
      s("title", "Heading"),
      { name: "compact", title: "Compact cards", type: "boolean" },
      { name: "muted", title: "Shaded background", type: "boolean" },
      {
        name: "excludeCurrent",
        title: "Exclude this project",
        type: "boolean",
      },
      {
        name: "limit",
        title: "Maximum projects",
        type: "number",
        validation: (Rule) => Rule.integer().min(1).max(100),
      },
    ],
  },
  {
    name: "mg2a_industryListing",
    title: "Industry listing",
    description: "Automatically lists published industry pages.",
    type: "object",
    fields: [
      s("title", "Heading"),
      { name: "compact", title: "Compact links", type: "boolean" },
      {
        name: "excludeCurrent",
        title: "Exclude this industry",
        type: "boolean",
      },
    ],
  },
  {
    name: "mg2a_communityStrip",
    title: "Communities",
    type: "object",
    fields: [s("title", "Label"), t("description", "Communities")],
  },
  {
    name: "mg2a_industrySupport",
    title: "Industry support cards",
    type: "object",
    fields: [
      ...heading,
      array(
        "items",
        "Cards",
        [
          s("icon", "Icon", {
            options: {
              list: [
                "department0",
                "department1",
                "department2",
                "department3",
              ],
            },
          }),
          s("title", "Heading"),
          t("description", "Description"),
        ],
        "supportCard",
      ),
    ],
  },
  {
    name: "mg2a_industryPrograms",
    title: "Industry programs",
    type: "object",
    fields: [
      ...heading,
      image(),
      s("alt", "Image description"),
      s("featureEyebrow", "Feature label"),
      s("featureTitle", "Feature heading"),
      t("featureText", "Feature description"),
      array(
        "facts",
        "Facts",
        [s("label", "Label"), s("value", "Value")],
        "programFact",
      ),
      array(
        "items",
        "Programs",
        [
          s("icon", "Icon", { options: { list: ["program0", "program1"] } }),
          s("eyebrow", "Eyebrow"),
          s("title", "Heading"),
          t("description", "Description"),
        ],
        "programCard",
      ),
    ],
  },
  {
    name: "mg2a_testimonialProject",
    title: "Testimonial and project",
    type: "object",
    fields: [
      t("quote", "Quote"),
      s("attribution", "Attribution"),
      {
        name: "project",
        title: "Project",
        type: "reference",
        to: [{ type: "mg2a_project" }],
      },
      s("eyebrow", "Project label"),
      t("description", "Project description"),
    ],
  },
  {
    name: "mg2a_surveyForm",
    title: "Survey request form",
    type: "object",
    fields: [
      {
        name: "form",
        title: "Form",
        type: "reference",
        to: [{ type: "form" }],
        validation: (Rule) => Rule.required(),
      },
      s("nextTitle", "Next steps heading"),
      {
        name: "nextSteps",
        title: "Next steps",
        type: "array",
        of: [{ type: "string" }],
      },
      s("helpTitle", "Helpful items heading"),
      {
        name: "helpItems",
        title: "Helpful items",
        type: "array",
        of: [{ type: "string" }],
      },
      s("clientAccessLabel", "Client Access text"),
      link("phone", "Phone link"),
    ],
  },
];
export function projectEditorFields() {
  return [
    {
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) =>
        Rule.required().custom(
          (value) =>
            !value?.current ||
            /^[a-z0-9-]+$/.test(value.current) ||
            "Use lowercase letters, numbers and hyphens.",
        ),
    },
    { name: "order", title: "Display order", type: "number", initialValue: 0 },
    s("cardImagePosition", "Card image focus", {
      options: {
        list: [
          { title: "Centered", value: "50% 50%" },
          { title: "Lower", value: "50% 70%" },
          { title: "Upper", value: "50% 30%" },
        ],
      },
    }),
    s("cardTone", "Card label color", {
      options: {
        list: [
          { title: "Orange", value: "accent" },
          { title: "Blue", value: "water" },
        ],
      },
    }),
    s("meta_title", "SEO title"),
    t("meta_description", "SEO description"),
    {
      name: "seo_no_index",
      title: "Do not index this project",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "page_builder",
      title: "Page Builder",
      type: "array",
      of: [
        ...projectModuleNames,
        "mg2a_faq",
        "mg2a_scopeForm",
        "mg2a_ctaBanner",
      ].map((type) => ({ type })),
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
