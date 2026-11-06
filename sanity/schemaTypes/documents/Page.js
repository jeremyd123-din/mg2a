import { Groups } from "@/sanity/utils/constants";
import { isUniqueAcrossAllDocuments } from "@/sanity/utils/helpers";
import { defineField, defineArrayMember } from "sanity";
import { createDocumentArray } from "@/sanity/utils/helpers";
import pageBuilderBlocks from "../blocks";
import { scopedCss } from "@/sanity/schemaTypes/objects/commonFields";

const Page = {
  name: "page",
  title: "Pages",
  type: "document",
  groups: Groups,
  initialValue: { page_layout: "flexible" },
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.warning("Page title is required"),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug || !slug.current) {
            return true; // Let the required() rule handle empty values
          }

          const slugPattern = /^[a-z0-9_\/-]+$/;

          if (!slugPattern.test(slug.current)) {
            return "Slug can only contain lowercase letters, numbers, underscores, hyphens, and forward slashes.";
          }

          return true;
        }),
      options: {
        source: "title",
        isUnique: isUniqueAcrossAllDocuments,
      },
    },
    {
      name: "meta_title",
      title: "Meta Title",
      type: "string",
      group: "seo",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "meta_description",
      title: "Meta Description",
      type: "text",
      rows: 2,
      group: "seo",
      validation: (rule) => rule.warning("Meta description is required"),
    },
    {
      name: "seo_no_index",
      title: "Do not index this page",
      description:
        "If checked, this content won't be indexed by search engines.",
      type: "boolean",
      group: "seo",
      initialValue: () => false,
    },
    {
      name: "featured_image",
      title: "Featured Image",
      type: "image",
      group: "seo",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt",
          type: "string",
        },
      ],
    },
    {
      name: "page_layout",
      title: "Page Layout",
      type: "string",
      group: "content",
      initialValue: "flexible",
      options: {
        list: [{ title: "Flexible Page Builder", value: "flexible" }],
      },
      description:
        "Add, remove and reorder MG2A sections. Structured service, project and industry layouts will be added in the next phase.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "default_theme",
      title: "Page theme",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Dark", value: "dark" },
          { title: "Light", value: "light" },
        ],
      },
      description:
        "Defaults to dark for the homepage and light for other pages.",
    },
    defineField({
      ...scopedCss,
      title: "Page CSS",
      description:
        "Scoped to this page’s main content. Use section Style controls for individual padding changes.",
    }),
    defineField({
      name: "page_builder",
      title: "Page Builder",
      type: "array",
      group: "content",
      of: createDocumentArray(
        pageBuilderBlocks.filter((block) => block._menuCategory === "mg2a"),
      ),
      options: {
        insertMenu: {
          groups: [
            {
              name: "mg2a",
              title: "MG2A Sections",
              of: pageBuilderBlocks
                .filter((block) => block._menuCategory === "mg2a")
                .map((block) => block.name),
            },
          ],
          views: [
            {
              name: "grid",
              previewImageUrl: (type) => `/mg2a/block-previews/${type}.jpg`,
            },
            { name: "list" },
          ],
        },
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      featured_image: "featured_image",
    },
    prepare(selection) {
      const { title, slug, featured_image } = selection;
      return {
        title,
        subtitle: slug && (slug === "index" ? "/" : `/${slug}`),
        media: featured_image,
      };
    },
  },
};

export default Page;
