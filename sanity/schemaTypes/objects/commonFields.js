export const scopedCss = {
  name: "scoped_css",
  title: "Scoped CSS",
  type: "code",
  group: "style",
  options: {
    language: "scss",
    languageAlternatives: [{ title: "CSS / SCSS", value: "scss" }],
  },
};
export const generateRichtextField = ({
  name = "content",
  title = "Content",
  group = "content",
  initialValue = [],
} = {}) => ({
  name,
  title,
  group,
  type: "array",
  initialValue,
  of: [
    {
      type: "block",
      marks: {
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              {
                name: "href",
                title: "URL",
                type: "url",
                validation: (Rule) =>
                  Rule.uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              },
              {
                name: "open_in_new_tab",
                title: "Open in new tab",
                type: "boolean",
              },
            ],
          },
        ],
      },
    },
    {
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", title: "Alternative text", type: "string" },
        { name: "caption", title: "Caption", type: "string" },
      ],
    },
    { type: "code", options: { language: "text" } },
  ],
});
