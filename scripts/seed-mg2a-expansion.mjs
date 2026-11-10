import fs from "node:fs";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
nextEnv.loadEnvConfig(process.cwd());
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-02-19",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  perspective: "raw",
});
const docs = await client.fetch(
  '*[_type in ["page","mg2a_industry","mg2a_project","form"]]',
);
fs.writeFileSync(
  `/private/tmp/mg2a-expansion-backup-${Date.now()}.json`,
  JSON.stringify(docs, null, 2),
);
const assets = JSON.parse(fs.readFileSync("lib/mg2a/assets.json"));
const imagePath =
  "/Users/parasbokhari/Downloads/mg2a-dev-handoff/pages/assets/bradley-commons-plan-original.jpg";
if (!assets["bradley-commons-plan-original.jpg"]) {
  const asset = await client.assets.upload(
    "image",
    fs.createReadStream(imagePath),
    { filename: "bradley-commons-plan-original.jpg" },
  );
  assets["bradley-commons-plan-original.jpg"] = {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
  fs.writeFileSync(
    "lib/mg2a/assets.json",
    JSON.stringify(assets, null, 2) + "\n",
  );
}
function resolve(value) {
  if (Array.isArray(value)) return value.map(resolve);
  if (value && typeof value === "object") {
    if (value._localAsset) return assets[value._localAsset];
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, resolve(v)]),
    );
  }
  return value;
}
const pages = resolve(
    JSON.parse(fs.readFileSync("lib/mg2a/expansionPages.json")),
  ),
  projectBlocks = resolve(
    JSON.parse(fs.readFileSync("lib/mg2a/projectDetailBlocks.json")),
  );
const industrySource = [
  ...new Map(
    [...JSON.parse(fs.readFileSync("lib/mg2a/documents.json")), ...docs].map(
      (doc) => [doc._id, doc],
    ),
  ).values(),
];
const industries = industrySource.filter(
  (doc) => doc._type === "mg2a_industry" && !doc._id.startsWith("drafts."),
);
const replacements = new Map();
for (const [index, industry] of industries.entries()) {
  const slug = industry.href.replace(/^\//, "");
  const id = "mg2a-industry-" + slug.split("/").at(-1);
  replacements.set(industry._id, id);
  if (!pages.some((page) => page._id === id))
    pages.push({
      _id: id,
      _type: "page",
      title: industry.label,
      slug: { _type: "slug", current: slug },
      page_kind: "industry",
      listing_title: industry.label,
      listing_order: index,
      default_theme: "light",
      page_layout: "flexible",
      seo_no_index: false,
      meta_title: industry.label + " | MG2A",
      page_builder: [
        {
          _type: "mg2a_pageHero",
          _key: "hero",
          title: industry.label,
          breadcrumb: industry.label,
          description:
            "Civil engineering and surveying services for your next project.",
        },
        {
          _type: "mg2a_scopeForm",
          _key: "inquiry",
          eyebrow: "Contact",
          title: "Tell us about your project",
          description: "An engineer will follow up with next steps.",
          form: { _type: "reference", _ref: "mg2a-project-inquiry" },
        },
      ],
    });
}
const recipient =
  docs.find((doc) => doc._id === "mg2a-project-inquiry")?.notification_email ||
  "";
await client.createIfNotExists({
  _id: "mg2a-survey-request",
  _type: "form",
  title: "Survey request",
  notification_email: recipient,
  form_fields: {
    _type: "code",
    language: "json",
    code: JSON.stringify(
      JSON.parse(fs.readFileSync("lib/forms/surveyFields.json")),
      null,
      2,
    ),
  },
  button_title: "Submit survey request",
  thankyou_message:
    "Thank you. A surveyor will follow up to confirm scope, timing and fee.",
  error_message:
    "We could not save your request. Please try again or call an office.",
});
for (const page of pages) {
  const collision = docs.find(
    (doc) =>
      doc._type === "page" &&
      doc.slug?.current === page.slug.current &&
      ![page._id, "drafts." + page._id].includes(doc._id),
  );
  if (collision) throw new Error("Existing page uses " + page.slug.current);
  if (page.page_kind === "industry") {
    page.label = page.listing_title || page.title;
    page.href = "/" + page.slug.current;
  }
  await client.createIfNotExists(page);
  if (page.page_kind === "industry") {
    const current = await client.getDocument(page._id);
    await client
      .patch(page._id)
      .ifRevisionId(current._rev)
      .setIfMissing({
        label: current.listing_title || current.title,
        href: "/" + current.slug.current,
      })
      .commit();
  }
}

function replace(value) {
  if (Array.isArray(value)) return value.map(replace);
  if (value && typeof value === "object") {
    if (value._ref && replacements.has(value._ref))
      return { ...value, _ref: replacements.get(value._ref) };
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, replace(v)]),
    );
  }
  return value;
}
for (const page of docs.filter((doc) => doc._type === "page")) {
  const next = replace(page.page_builder);
  if (JSON.stringify(next) !== JSON.stringify(page.page_builder))
    await client
      .patch(page._id)
      .ifRevisionId(page._rev)
      .set({ page_builder: next })
      .commit();
}
// The homepage already features this work; give it its own project record.
const programs = pages
  .find((page) => page.slug.current === "industries/municipalities")
  .page_builder.find((block) => block._type === "mg2a_industryPrograms");
if (
  !docs.some(
    (doc) =>
      doc._type === "mg2a_project" &&
      (doc.slug?.current === "local-road-improvements" ||
        doc.href === "/projects/local-road-improvements"),
  )
) {
  await client.createIfNotExists({
    _id: "mg2a-project-local-road-improvements",
    _type: "mg2a_project",
    title: "Local Road Improvements & Street Maintenance",
    slug: { _type: "slug", current: "local-road-improvements" },
    href: "/projects/local-road-improvements",
    image: programs.image,
    alt: programs.alt,
    eyebrow: "Municipal Engineering",
    description: programs.featureText,
    order: 3,
    seo_no_index: false,
    page_builder: [
      { _type: "mg2a_projectHero", _key: "hero" },
      {
        _type: "mg2a_projectFacts",
        _key: "facts",
        items: programs.facts.map((fact) => ({
          ...fact,
          _type: "projectFact",
        })),
      },
      {
        _type: "mg2a_projectStory",
        _key: "story",
        title: "The project",
        body: [
          {
            _type: "block",
            _key: "text",
            style: "normal",
            markDefs: [],
            children: [
              {
                _type: "span",
                _key: "text",
                text: programs.featureText,
                marks: [],
              },
            ],
          },
        ],
      },
      {
        _type: "mg2a_projectGrid",
        _key: "related",
        title: "More projects",
        compact: true,
        excludeCurrent: true,
        limit: 3,
      },
    ],
  });
}
const projects = docs.filter((doc) => doc._type === "mg2a_project");
for (const [index, project] of projects.entries()) {
  const slug =
    project.slug?.current ||
    project.href?.split("/").at(-1) ||
    project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-$/, "");
  const isBradley = slug === "bradley-commons";
  const blocks = isBradley
    ? projectBlocks
    : [
        { _type: "mg2a_projectHero", _key: "hero" },
        {
          _type: "mg2a_projectStory",
          _key: "story",
          title: "The project",
          body: [
            {
              _type: "block",
              _key: "intro",
              style: "normal",
              markDefs: [],
              children: [
                {
                  _type: "span",
                  _key: "text",
                  text: project.description || "",
                  marks: [],
                },
              ],
            },
          ],
        },
        {
          _type: "mg2a_projectGrid",
          _key: "related",
          title: "More projects",
          compact: true,
          excludeCurrent: true,
          limit: 3,
        },
      ];
  await client
    .patch(project._id)
    .ifRevisionId(project._rev)
    .setIfMissing({
      slug: { _type: "slug", current: slug },
      order: index,
      seo_no_index: false,
      meta_title: project.title + " | MG2A",
      page_builder: blocks,
    })
    .commit();
}
console.log(
  `Created missing overview/survey/industry pages, upgraded ${projects.length} project records, and relinked industry references. Original industry documents retained as legacy data; no records deleted.`,
);
