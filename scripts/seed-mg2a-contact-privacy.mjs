import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { serviceGroups } from "../lib/mg2a/navigation.js";

nextEnv.loadEnvConfig(process.cwd());
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-02-19",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  perspective: "raw",
});
const block = (type, key, fields) => ({
  _type: type,
  _key: key,
  block_category: "mg2a",
  ...fields,
});
function page(slug, title, description, sections) {
  return {
    _id: "mg2a-" + slug,
    _type: "page",
    title,
    slug: { _type: "slug", current: slug },
    default_theme: "light",
    page_layout: "flexible",
    seo_no_index: false,
    meta_title: title + " | MG2A",
    meta_description: description,
    page_builder: [
      block("mg2a_pageHero", "hero", { title, breadcrumb: title, description }),
      ...sections,
    ],
  };
}
function paragraph(key, text, style = "normal") {
  return {
    _type: "block",
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: "text", text, marks: [] }],
  };
}
const body = [
  paragraph("information", "Information you share", "h3"),
  paragraph(
    "inquiries",
    "When you contact M Gingerich Gereaux & Associates (MG2A), we receive the information you enter, such as your name, contact details, and project description. Survey requests may include a property address, parcel number, or documents you upload. Job applications may include a résumé and information about your experience.",
  ),
  paragraph("use", "How we use submissions", "h3"),
  paragraph(
    "review",
    "We use this information to respond to questions, scope engineering and survey work, and review applications for the position you select. Form responses and attachments are stored in our content management system. A submission may also generate an email notification for the team handling the request.",
  ),
  paragraph("providers", "Website services", "h3"),
  paragraph(
    "processors",
    "We use service providers to host the website, store submissions, and deliver email. Loading the site also requests fonts from Google. When you follow a directions link, Google Maps handles that visit under its own privacy policy.",
  ),
  paragraph("questions", "Privacy questions", "h3"),
  {
    _type: "block",
    _key: "contact",
    style: "normal",
    markDefs: [{ _type: "link", _key: "contact-link", href: "/contact" }],
    children: [
      {
        _type: "span",
        _key: "intro",
        marks: [],
        text: "If you have a question about information you submitted or would like to request a correction or deletion, ",
      },
      {
        _type: "span",
        _key: "link",
        marks: ["contact-link"],
        text: "contact MG2A",
      },
      {
        _type: "span",
        _key: "end",
        marks: [],
        text: ". Tell us which form you used and approximately when you sent it so we can locate your submission.",
      },
    ],
  },
];
const pages = [
  page(
    "contact",
    "Contact",
    "Talk with our engineers and surveyors about your site, project, or next steps.",
    [
      block("mg2a_scopeForm", "inquiry", {
        eyebrow: "Project inquiries",
        title: "Tell us about your project",
        description:
          "Share the location, what you need, and any deadlines. Our team will follow up with you.",
        form: { _type: "reference", _ref: "mg2a-project-inquiry" },
      }),
      block("mg2a_offices", "offices", {
        eyebrow: "Visit or call",
        title: "Our offices",
      }),
      block("mg2a_ctaBanner", "survey", {
        title: "Need a land survey?",
        description: "Send the property details directly to our survey team.",
        buttonOne: { label: "Order a survey", href: "/order-a-survey" },
      }),
    ],
  ),
  page(
    "privacy-policy",
    "Privacy Policy",
    "How MG2A handles information shared through this website.",
    [
      block("mg2a_companyStory", "privacy", {
        title: "Your information",
        body,
      }),
    ],
  ),
];
const planned = new Set(
  serviceGroups.flatMap((g) => [g.href, ...g.links.map((l) => l.href)]),
);
const listings = "/services#services-list";
const water = "/services/water-resources";
const openings = "/careers#section-positions";
function edits(doc, built) {
  const changes = {};
  function visit(obj, path = "") {
    if (Array.isArray(obj)) {
      obj.forEach((item, i) =>
        visit(
          item,
          path +
            (item?._key
              ? "[_key==" + JSON.stringify(item._key) + "]"
              : "[" + i + "]"),
        ),
      );
      return;
    }
    if (!obj || typeof obj !== "object") return;
    const set = (field, value) => {
      changes[path ? path + "." + field : field] = value;
    };
    for (const [key, value] of Object.entries(obj)) {
      if (!/^href\d*$/.test(key) || typeof value !== "string") {
        if (!key.startsWith("_")) visit(value, path ? path + "." + key : key);
        continue;
      }
      let target = value;
      if (value === "/#contact") target = "/contact";
      if (doc.slug?.current === "index" && value === "#projects")
        target = "/projects";
      if (doc.slug?.current === "index" && value === "#services")
        target = obj.eyebrow === "Development" ? listings : "/services";
      if (
        obj._type === "mg2a_featuredProjects" &&
        key === "href2" &&
        value === "/industries/municipalities"
      )
        target = "/projects/local-road-improvements";
      if (
        obj.label === "Industries we serve" &&
        value === "/industries/municipalities"
      )
        target = "/industries";
      if (value === "/careers#positions" || value === "/careers#apply")
        target = openings;
      if (
        value === "/careers#apply" &&
        obj.label === "Apply with your resume"
      ) {
        set("label", "Explore careers");
        target = "/careers";
      }
      if (value === water + "/stormwater-management-plans#overview")
        target =
          water +
          "/stormwater-management-plans#section-service-content_overview";
      if (planned.has(value) && !built.has(value)) {
        const survey = value.startsWith("/services/survey");
        if (survey) target = "/order-a-survey";
        else if (obj._type === "serviceCard") target = "/contact";
        else
          target = value.startsWith(water + "/")
            ? water + "#services-list"
            : listings;
        if (obj._type === "serviceCard")
          set("label", survey ? "Order a survey" : "Discuss this service");
        if (obj._type === "mg2a_serviceCategory")
          set("text", survey ? "Order a survey" : "Explore services");
      }
      if (target !== value) set(key, target);
    }
  }
  visit(doc);
  return changes;
}
async function main() {
  const docs = await client.fetch(
    '*[_type in ["page","mg2a_settings","mg2a_serviceCategory","mg2a_project","mg2a_job","mg2a_team"] && !(_id in path("versions.**"))]',
  );
  const published = docs.filter((doc) => !doc._id.startsWith("drafts."));
  const built = new Set(
    published
      .filter((d) => d._type === "page")
      .map((d) => "/" + d.slug?.current),
  );
  let tx = client.transaction();
  for (const page of pages) {
    if (
      !docs.some(
        (d) => d._type === "page" && d.slug?.current === page.slug.current,
      )
    )
      tx = tx.createIfNotExists(page);
  }
  let updated = 0;
  for (const doc of docs) {
    const changes = edits(doc, built);
    let patch = client.patch(doc._id).ifRevisionId(doc._rev);
    const addPrivacy =
      doc._type === "mg2a_settings" &&
      !(doc.companyLinks || []).some((l) => l.href === "/privacy-policy");
    if (!Object.keys(changes).length && !addPrivacy) continue;
    if (Object.keys(changes).length) patch = patch.set(changes);
    if (addPrivacy)
      patch = patch.setIfMissing({ companyLinks: [] }).append("companyLinks", [
        {
          _key: "privacy-policy",
          _type: "mg2a_link",
          label: "Privacy Policy",
          href: "/privacy-policy",
        },
      ]);
    tx = tx.patch(patch);
    updated++;
  }
  await tx.commit();
  console.log(
    "Contact and Privacy Policy seed complete. Updated link-bearing documents:",
    updated,
  );
}
try {
  await main();
} catch (e) {
  console.error(
    "CMS update failed:",
    e.statusCode || e.code || "request error",
  );
  process.exitCode = 1;
}
