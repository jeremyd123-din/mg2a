export default {
  name: "site_settings",
  title: "SEO & Analytics",
  type: "document",
  fields: [
    {
      name: "disable_indexing",
      title: "Disable search indexing",
      description:
        "Keep enabled during development. Disable when the website is ready to launch.",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "og_image",
      title: "Default social sharing image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "gtm_id",
      title: "Google Tag Manager ID",
      description: "Leave blank to disable analytics.",
      type: "string",
    },
  ],
  preview: { prepare: () => ({ title: "SEO & Analytics" }) },
};
