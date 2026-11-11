const assert = require("node:assert/strict");
const esbuild = require("esbuild");
const Module = require("node:module");
function load(entry, overrides = {}) {
  const result = esbuild.buildSync({
    entryPoints: [entry],
    bundle: true,
    platform: "node",
    format: "cjs",
    packages: "external",
    alias: { "@": process.cwd() },
    loader: { ".js": "jsx", ".scss": "empty" },
    write: false,
    jsx: "automatic",
  });
  const mod = new Module(process.cwd() + "/mg2a-check.cjs", module);
  mod.filename = process.cwd() + "/mg2a-check.cjs";
  mod.paths = module.paths;
  const originalRequire = mod.require.bind(mod);
  mod.require = (id) =>
    Object.hasOwn(overrides, id) ? overrides[id] : originalRequire(id);
  mod._compile(result.outputFiles[0].text, mod.filename);
  return mod.exports;
}
async function main() {
  const types = load("sanity/schemaTypes/index.js").default;
  const { createSchema } = require("sanity");
  const { codeInput } = require("@sanity/code-input");
  const schema = createSchema({
    name: "mg2a-check",
    types: [...types, ...codeInput().schema.types],
  });
  const errors = (schema._validation || []).flatMap((group) =>
    group.problems
      .filter((p) => p.severity === "error")
      .map((problem) => ({ path: group.path, problem })),
  );
  assert.deepEqual(errors, []);
  const homepage = require("../lib/mg2a/homepage.json");
  const registry = load("components/mg2a/blocks/index.js");
  for (const block of homepage) {
    assert(
      types.some((type) => type.name === block._type),
      "Schema missing: " + block._type,
    );
    assert.equal(
      typeof registry[block._type],
      "function",
      "Renderer missing: " + block._type,
    );
  }
  const { renderToStaticMarkup: renderCompany } = require("react-dom/server");
  const ReactCompany = require("react");
  const breadcrumbHtml = renderCompany(
    ReactCompany.createElement(registry.mg2a_pageHero, {
      data: {
        _type: "mg2a_pageHero",
        _key: "hero",
        title: "Manufacturing",
        breadcrumbParent: { label: "Industries", href: "/industries" },
      },
    }),
  );
  assert(breadcrumbHtml.includes('href="/industries"'));
  const cardsHtml = renderCompany(
    ReactCompany.createElement(registry.mg2a_industryListing, {
      data: {
        _type: "mg2a_industryListing",
        _key: "industries",
        title: "Industries",
        industries: [
          {
            _id: "industry",
            label: "Manufacturing",
            href: "/industries/manufacturing",
            listing_summary: "Facilities and infrastructure.",
          },
        ],
      },
    }),
  );
  assert(cardsHtml.includes("Facilities and infrastructure."));
  assert(
    cardsHtml.includes("View Industry"),
    "Industry cards must use the requested button text",
  );
  assert(
    cardsHtml.includes("min-h-[260px]"),
    "Industry cards must share the service card layout",
  );
  const Combo = load("components/mg2a/ui/FormCombobox.jsx").default;
  const comboMarkup = renderCompany(
    ReactCompany.createElement(Combo, {
      id: "survey-type",
      field: {
        name: "type",
        label: "Survey type",
        options: [
          { label: "Not sure yet", value: "unsure" },
          { label: "Boundary Survey", value: "boundary" },
        ],
      },
    }),
  );
  assert(comboMarkup.includes('role="combobox"'));
  assert(comboMarkup.includes('name="type" value="unsure"'));
  assert(!comboMarkup.includes("<select"));
  const multiMarkup = renderCompany(
    ReactCompany.createElement(Combo, {
      id: "multi",
      field: {
        name: "types",
        label: "Services",
        isMulti: true,
        options: [{ label: "Boundary", value: "boundary" }],
      },
    }),
  );
  assert(
    !multiMarkup.includes('name="types" value=""'),
    "Empty multiple selections must serialize as an empty array",
  );
  const { activeSectionId } = load("lib/mg2a/scrollSpy.js");
  assert.equal(
    activeSectionId(
      [
        { id: "overview", top: -500 },
        { id: "included", top: 50 },
        { id: "faq", top: 800 },
      ],
      108,
    ),
    "included",
  );
  assert.equal(
    activeSectionId(
      [
        { id: "overview", top: 10 },
        { id: "faq", top: 800 },
      ],
      108,
      true,
    ),
    "faq",
  );
  assert.equal(activeSectionId([], 108), null);
  const navData = {
    _type: "mg2a_serviceContent",
    _key: "auto-nav",
    title: "On this page",
    sections: [
      {
        _type: "mg2a_checklist",
        _key: "first",
        title: "First editable section",
        items: [],
      },
      {
        _type: "mg2a_deliverables",
        _key: "second",
        title: "Second editable section",
        items: [],
      },
    ],
  };
  const autoNav = renderCompany(
    ReactCompany.createElement(registry.mg2a_serviceContent, { data: navData }),
  );
  assert(autoNav.includes('href="#section-auto-nav_first"'));
  const changedNav = renderCompany(
    ReactCompany.createElement(registry.mg2a_serviceContent, {
      data: {
        ...navData,
        sections: [
          { ...navData.sections[1], title: "Renamed section" },
          navData.sections[0],
        ],
      },
    }),
  );
  assert(
    changedNav.indexOf(">Renamed section</a>") <
      changedNav.indexOf(">First editable section</a>"),
  );
  const { isSubmissionId, selectedSubmission, submissionShareUrl } = load(
    "lib/forms/submissionLinks.js",
  );
  const { route } = require("sanity/router");
  const submissionRouter = route.create("/", [route.create("/:submission")]);
  const sharedId = "submissions.12345678-1234-4234-8234-123456789abc";
  assert(isSubmissionId(sharedId));
  assert(!isSubmissionId("../../page"));
  assert.equal(
    selectedSubmission(
      submissionRouter.decode(
        submissionRouter.encode({ submission: sharedId }),
      ),
    ),
    sharedId,
  );
  assert.equal(selectedSubmission({}), null);
  assert.equal(
    submissionShareUrl(
      "https://mg2a.com/studio/form-submissions/" +
        sharedId +
        "?search=private#state",
    ),
    "https://mg2a.com/studio/form-submissions/" + sharedId,
  );
  const { primaryNavigation, serviceGroups, industryLinks, launchRoutes } =
    load("lib/mg2a/navigation.js");
  assert.deepEqual(
    primaryNavigation
      .filter((item) => item.groups?.length)
      .map((item) => item.href),
    ["/services", "/industries"],
  );
  assert.equal(serviceGroups.length, 7);
  assert.equal(serviceGroups.flatMap((group) => group.links).length, 12);
  assert.equal(industryLinks.length, 9);
  assert.equal(
    new Set(launchRoutes.map((item) => item.href)).size,
    launchRoutes.length,
  );
  assert(!JSON.stringify(serviceGroups).includes("as-built-survey"));
  const pageType = types.find((t) => t.name === "page");
  const members = pageType.fields.find((f) => f.name === "page_builder").of;
  assert.equal(members.length, 48);
  const fs = require("node:fs");
  for (const member of members) {
    const file = `public/mg2a/block-previews/${member.type}.jpg`;
    assert(fs.statSync(file).size > 1000, "Missing screenshot: " + file);
    assert.equal(fs.readFileSync(file).subarray(0, 2).toString("hex"), "ffd8");
  }
  assert(members.every((m) => m.type.startsWith("mg2a_")));
  const mg2aTypes = types.filter(
    (type) => type.name.startsWith("mg2a_") && type.type === "object",
  );
  for (const type of mg2aTypes) {
    assert(
      !type.fields.some((f) => f.name === "enabled"),
      "Unexpected section toggle",
    );
    assert(
      type.fields.some((f) => f.name === "scoped_css" && f.group === "style"),
    );
    assert(
      type.fields.some((f) => f.name === "spacing" && f.group === "style"),
    );
  }
  for (const removed of [
    "navigation",
    "global_team",
    "global_testimonials",
    "HeroVariant01",
    "mg2a_office",
    "mg2a_industry",
    "site_settings",
  ])
    assert(
      !types.some((type) => type.name === removed),
      "Retired schema still registered: " + removed,
    );
  const { pageStyles, pageIdentity } = load("lib/mg2a/scopedStyles.js");
  assert.equal(pageIdentity({ _id: "drafts.page-home" }), "page-home");
  assert(
    /data-mg2a-page=/.test(
      pageStyles({
        _id: "page-home",
        scoped_css: { code: "h2 { color: red; }" },
      }),
    ),
  );
  assert.equal(pageStyles({ _id: "other-page" }), "");
  const site = types.find((type) => type.name === "mg2a_settings");
  assert(
    site.fields.some(
      (field) => field.name === "offices" && field.of[0].type === "object",
    ),
  );
  assert(types.some((type) => type.name === "mg2a_job"));
  assert(
    !types
      .find((type) => type.name === "mg2a_careers")
      .fields.some((field) => field.name === "jobs"),
  );
  assert(
    !types
      .find((type) => type.name === "mg2a_contactForm")
      .fields.some((field) => field.name === "offices"),
  );
  assert(
    members.length === 48 &&
      pageType.fields
        .find((field) => field.name === "page_builder")
        .options.insertMenu.views.some((view) => view.name === "grid"),
  );
  const hero = types.find((t) => t.name === "mg2a_hero");
  assert(
    hero.fields.some((f) => f.name === "buttonOne" && f.title === "Button one"),
  );
  assert(
    hero.fields.some((f) => f.name === "buttonTwo" && f.title === "Button two"),
  );
  assert(hero.fields.some((f) => f.name === "trustStatement"));
  assert(
    !hero.fields.some((f) =>
      ["description2", "description3", "text", "text2"].includes(f.name),
    ),
  );
  const { blockStyles } = load("lib/mg2a/blockStyles.js");
  const firstCss = blockStyles({
    _key: "first",
    spacing: { paddingTop: 0, paddingBottom: 100, mobilePaddingTop: 24 },
    scoped_css: {
      code: "h2 { color: red; } @media(max-width:980px) { p { font-size: 16px; } }",
    },
  });
  assert(
    /\[data-mg2a-block=(?:"first"|first)\] h2\{color:red\}/.test(firstCss),
  );
  assert(firstCss.includes("padding-top:0px"));
  assert(/@media\s*\(max-width:\s*980px\)/.test(firstCss));
  assert.equal(blockStyles({ _key: "second" }), "");
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const servicePages = require("../lib/mg2a/servicePages.json");
  const collect = (blocks) =>
    blocks.flatMap((block) => [block, ...collect(block.sections || [])]);
  for (const page of servicePages) {
    assert.equal(page.seo_no_index, false);
    for (const section of collect(page.page_builder)) {
      assert.equal(
        typeof registry[section._type],
        "function",
        `Missing service renderer: ${section._type}`,
      );
      assert(types.some((type) => type.name === section._type));
    }
  }
  const serviceContent = servicePages[1].page_builder.find(
    (block) => block._type === "mg2a_serviceContent",
  );
  assert.equal(serviceContent.sections.length, 6);
  assert.equal(
    serviceContent.sections.find((block) => block._type === "mg2a_deliverables")
      .items.length,
    6,
  );
  const expansionData = [
    ...require("../lib/mg2a/expansionPages.json").flatMap(
      (page) => page.page_builder,
    ),
    ...require("../lib/mg2a/projectDetailBlocks.json"),
  ];
  for (const section of expansionData) {
    const type = types.find((type) => type.name === section._type);
    assert(type, "Missing expansion schema: " + section._type);
    for (const field of type.fields.filter((field) => field.type === "array"))
      for (const item of section[field.name] || []) {
        if (
          item &&
          typeof item === "object" &&
          item._type &&
          !["block", "reference"].includes(item._type)
        )
          assert(
            field.of.some(
              (member) => (member.name || member.type) === item._type,
            ),
            `Unknown ${section._type}.${field.name} array type ${item._type}`,
          );
      }
  }
  const projectType = types.find((type) => type.name === "mg2a_project");
  assert(projectType.fields.some((field) => field.name === "slug"));
  assert(projectType.fields.some((field) => field.name === "page_builder"));
  assert.equal(
    types
      .find((type) => type.name === "mg2a_industries")
      .fields.find((field) => field.name === "industries").of[0].to[0].type,
    "page",
  );
  const contentSchema = types.find(
    (type) => type.name === "mg2a_serviceContent",
  );
  const allowed = contentSchema.fields
    .find((field) => field.name === "sections")
    .of.map((member) => member.type);
  assert(
    serviceContent.sections.every((section) => allowed.includes(section._type)),
  );
  const preview = hero.preview.prepare({
    title: "Page heading",
    eyebrow: "Eyebrow",
  });
  assert.equal(preview.title, "Hero");
  assert.equal(preview.subtitle, "Page heading");
  assert(!hero.fields.some((field) => field.name === "editorLabel"));
  const { sectionAnchor, sectionAnchorFromPath } = load(
    "lib/mg2a/sectionAnchors.js",
  );
  assert.equal(
    sectionAnchor({ _key: "abc123", title: "Original" }),
    sectionAnchor({ _key: "abc123", title: "Renamed" }),
  );
  assert.equal(
    sectionAnchorFromPath([
      "page_builder",
      { _key: "parent" },
      "sections",
      { _key: "child" },
      "sectionLink",
    ]),
    "section-parent_child",
  );
  const groups = pageType.fields.find((field) => field.name === "page_builder")
    .options.insertMenu.groups;
  assert(groups.some((group) => group.name === "service-overview"));
  assert(groups.some((group) => group.name === "service-inner"));
  assert(hero.fields.find((field) => field.name === "sectionLink").readOnly);

  const reordered = {
    ...serviceContent,
    sections: [...serviceContent.sections].reverse(),
  };
  const articleHtml = renderToStaticMarkup(
    React.createElement(registry.mg2a_serviceContent, {
      data: reordered,
      editorContext: {
        docId: "test-page",
        docType: "page",
        path: 'page_builder[_key=="service-content"]',
      },
    }),
  );
  assert(
    articleHtml.indexOf('href="#section-service-content_faq"') <
      articleHtml.indexOf('href="#section-service-content_overview"'),
    "Contents must follow section order",
  );
  assert(
    articleHtml.includes('data-mg2a-block="service-content_overview"'),
    "Nested style selectors must include parent identity",
  );
  assert(
    articleHtml.includes("sections"),
    "Nested visual editing must retain its section path",
  );

  const InlineText = load("components/mg2a/ui/InlineText.jsx").default;
  const formatted = renderToStaticMarkup(
    React.createElement(InlineText, {
      value:
        "One <strong>town</strong> and <b>another</b><script>alert(1)</script><img src=x onerror=alert(2)>",
    }),
  );
  assert.equal(
    formatted,
    "One <strong>town</strong> and <strong>another</strong>",
  );
  const Header = load("components/mg2a/layout/MG2AHeader.jsx").default;
  const headerData = { organization: "MG2A", primaryLinks: [], offices: [] };
  assert(
    renderToStaticMarkup(
      React.createElement(Header, { settings: headerData, overlay: true }),
    ).includes("bg-transparent"),
  );
  assert(
    renderToStaticMarkup(
      React.createElement(Header, { settings: headerData, overlay: false }),
    ).includes("bg-[#0b1822]"),
  );
  const sourcePath =
    (process.env.MG2A_HANDOFF_DIR ||
      "/Users/parasbokhari/Downloads/mg2a-dev-handoff") + "/pages/index.html";

  if (fs.existsSync(sourcePath)) {
    const { parseDocument } = require("htmlparser2");
    const D = require("domutils");
    const doc = parseDocument(fs.readFileSync(sourcePath, "utf8"));
    const shapes = (node) =>
      D.findAll((n) => n.type === "tag", node.children || []).map((n) => ({
        tag: n.name,
        attrs: Object.fromEntries(
          Object.entries(n.attribs)
            .filter(([k]) => k !== "style")
            .sort(([a], [b]) => a.localeCompare(b)),
        ),
      }));
    const serviceSection = D.findAll(
      (n) => n.attribs?.id === "services",
      doc.children,
    )[0];
    const originals = D.findAll(
      (n) => n.name === "svg" && n.attribs.width === "44",
      serviceSection.children,
    );
    const ServiceIcon = load("components/mg2a/ui/ServiceIcon.jsx").default;
    for (const [index, name] of [
      "survey",
      "design",
      "water",
      "permitting",
      "construction",
      "documentation",
      "cost",
    ].entries()) {
      const rendered = parseDocument(
        renderToStaticMarkup(React.createElement(ServiceIcon, { name })),
      ).children[0];
      assert.deepEqual(
        shapes(rendered),
        shapes(originals[index]),
        "Artwork differs: " + name,
      );
    }
  }
  const responsesType = types.find((type) => type.name === "formSubmission");
  assert(
    responsesType.fields.find((field) => field.name === "fields").components
      .input,
  );
  assert.equal(
    responsesType.preview.prepare({
      form: "Survey request",
      responses: [{ name: "name", label: "Name", value: "Jane Example" }],
      date: "2026-11-10T12:00:00Z",
      status: "new",
    }).title,
    "Jane Example",
  );
  assert.equal(
    responsesType.preview.prepare({
      form: "Survey request",
      email: "jane@example.com",
    }).title,
    "jane@example.com",
  );
  const { submissionIdentity } = load("lib/forms/submissionIdentity.js");
  assert.equal(
    submissionIdentity([
      { name: "first_name", value: "Jane" },
      { name: "last_name", value: "Example" },
    ]).name,
    "Jane Example",
  );
  assert.deepEqual(submissionIdentity(null), { name: "", email: "" });
  const { ThemeProvider, studioTheme } = require("@sanity/ui");
  const Responses = load(
    "sanity/components/SubmissionResponsesInput.jsx",
  ).default;
  const tableHtml = renderCompany(
    ReactCompany.createElement(
      ThemeProvider,
      { theme: studioTheme },
      ReactCompany.createElement(Responses, {
        value: [
          { _key: "name", label: "Full name", value: "Jane Example" },
          {
            _key: "details",
            label: "Details",
            value: "Line one\n<script>safe text</script>",
          },
        ],
      }),
    ),
  );
  assert(tableHtml.includes('<table aria-label="Submitted responses"'));
  assert(tableHtml.includes("Jane Example"));
  assert(tableHtml.includes("&lt;script&gt;"));
  assert(!tableHtml.includes("<script>safe"));
  const { SubmissionsTable } = load("sanity/tools/FormSubmissions.jsx");
  const listTable = renderCompany(
    ReactCompany.createElement(
      ThemeProvider,
      { theme: studioTheme },
      ReactCompany.createElement(SubmissionsTable, {
        items: [
          {
            _id: "submissions.test",
            submitter_name: "Jane Example",
            form_title: "Survey request",
            status: "new",
          },
        ],
        onOpen: () => {},
      }),
    ),
  );
  assert(
    listTable.includes("Jane Example") && listTable.includes("Survey request"),
  );
  const { submissionQueryParams, submissionsQuery } = load(
    "lib/forms/submissionQueries.js",
  );
  assert(submissionsQuery.includes('_id in path("submissions.**")'));
  assert.deepEqual(
    submissionQueryParams({
      search: "  Jane*?  ",
      status: "invalid",
      page: -1,
    }),
    { pattern: "*Jane*", formId: "", status: "", start: 0, end: 25 },
  );
  const { FieldLabel, SubmitIcon } = load("components/mg2a/ui/InquiryForm.jsx");
  const requiredLabel = renderCompany(
    ReactCompany.createElement(FieldLabel, {
      field: { label: "Email", required: true },
    }),
  );
  assert(requiredLabel.includes("*"));
  assert(
    !renderCompany(
      ReactCompany.createElement(FieldLabel, { field: { label: "Phone" } }),
    ).includes("*"),
  );
  assert(
    renderCompany(
      ReactCompany.createElement(SubmitIcon, { sending: true }),
    ).includes("animate-spin"),
  );
  assert(
    !renderCompany(
      ReactCompany.createElement(SubmitIcon, { sending: false }),
    ).includes("animate-spin"),
  );
  const { parseFields, validateValues } = load("lib/forms/definition.js");
  const { prepareAttachments } = load("lib/forms/attachments.js");
  const fileDefinition = [{ name: "docs", type: "file", multiple: true }];
  const upload = new File(["%PDF-1.4 test document"], "test.pdf", {
    type: "application/pdf",
  });
  const prepared = await prepareAttachments(
    [{ field: "docs", file: upload }],
    fileDefinition,
    "submissions.test",
  );
  assert(prepared.documents.every((doc) => doc._id.startsWith("submissions.")));
  assert.equal(prepared.attachments[0].mime, "application/pdf");
  await assert.rejects(() =>
    prepareAttachments(
      [{ field: "docs", file: new File(["not a PDF"], "test.pdf") }],
      fileDefinition,
      "submissions.test",
    ),
  );
  await assert.rejects(() =>
    prepareAttachments(
      Array(11).fill({ field: "docs", file: upload }),
      fileDefinition,
      "submissions.test",
    ),
  );
  const { MAX_UPLOAD_BYTES, MAX_UPLOAD_FILES } = load(
    "lib/forms/uploadLimits.js",
  );
  assert.equal(MAX_UPLOAD_FILES, 10);
  const ten = await prepareAttachments(
    Array(10).fill({ field: "docs", file: upload }),
    fileDefinition,
    "submissions.ten",
  );
  assert.equal(ten.attachments.length, 10);
  const maxPdf = Buffer.alloc(MAX_UPLOAD_BYTES, 32);
  maxPdf.write("%PDF-1.4");
  const large = await prepareAttachments(
    [{ field: "docs", file: new File([maxPdf], "large.pdf") }],
    fileDefinition,
    "submissions.large",
  );
  await assert.rejects(() =>
    prepareAttachments(
      [
        {
          field: "docs",
          file: new File([maxPdf, Buffer.from("x")], "too-large.pdf"),
        },
      ],
      fileDefinition,
      "submissions.large",
    ),
  );
  const changed = await prepareAttachments(
    [{ field: "docs", file: new File(["%PDF-1.4 different"], "test.pdf") }],
    fileDefinition,
    "submissions.test",
  );
  assert.notEqual(
    changed.documents[0]._id,
    prepared.documents[0]._id,
    "Retrying with different bytes must never reuse an old chunk",
  );
  const { storeSubmission, submissionBatches, MAX_MUTATION_BYTES } = load(
    "lib/forms/storeSubmission.js",
  );
  const largeSubmission = {
    _id: "submissions.large",
    _type: "formSubmission",
    attachments: large.attachments,
  };
  const batches = submissionBatches(largeSubmission, large.documents);
  assert(batches.length > 1);
  assert.equal(batches.at(-1).at(-1), largeSubmission);
  assert(
    batches.every(
      (batch) =>
        Buffer.byteLength(
          JSON.stringify({
            mutations: batch.map((document) => ({
              createIfNotExists: document,
            })),
          }),
        ) < MAX_MUTATION_BYTES,
    ),
  );
  const storedChunks = new Map();
  let batchNumber = 0,
    breakBatch = 2;
  const storageClient = {
    transaction() {
      const queued = [];
      return {
        createIfNotExists(doc) {
          queued.push(doc);
          return this;
        },
        async commit() {
          batchNumber++;
          if (batchNumber === breakBatch)
            throw new Error("Storage unavailable");
          for (const doc of queued)
            if (!storedChunks.has(doc._id)) storedChunks.set(doc._id, doc);
        },
      };
    },
  };
  await assert.rejects(() =>
    storeSubmission(storageClient, largeSubmission, large.documents),
  );
  assert(
    !storedChunks.has(largeSubmission._id),
    "Failed attachment batches must not expose an incomplete submission",
  );
  breakBatch = -1;
  await storeSubmission(storageClient, largeSubmission, large.documents);
  assert(storedChunks.has(largeSubmission._id));
  assert.equal(
    Buffer.concat(
      large.attachments[0].chunks.map((id) =>
        Buffer.from(storedChunks.get(id).data, "base64"),
      ),
    ).compare(maxPdf),
    0,
  );
  const resumeFields = parseFields(
    JSON.stringify([
      {
        name: "resume",
        label: "Resume",
        type: "file",
        required: true,
        accept: "resume",
      },
    ]),
  );
  const resumeUpload = async (bytes, name) =>
    prepareAttachments(
      [{ field: "resume", file: new File([bytes], name) }],
      resumeFields,
      "submissions.resume",
    );
  assert.equal(
    (await resumeUpload(Buffer.from("%PDF-1.4 resume"), "resume.pdf"))
      .attachments[0].mime,
    "application/pdf",
  );
  const legacy = Buffer.concat([
    Buffer.from([208, 207, 17, 224, 161, 177, 26, 225]),
    Buffer.from("WordDocument", "utf16le"),
  ]);
  assert.equal(
    (await resumeUpload(legacy, "resume.doc")).attachments[0].mime,
    "application/msword",
  );
  const directory = (names) =>
    Buffer.concat([
      Buffer.from([80, 75, 3, 4]),
      ...names.map((name) => {
        const head = Buffer.alloc(46);
        head.writeUInt32LE(0x02014b50);
        head.writeUInt16LE(Buffer.byteLength(name), 28);
        return Buffer.concat([head, Buffer.from(name)]);
      }),
    ]);
  assert.equal(
    (
      await resumeUpload(
        directory(["[Content_Types].xml", "word/document.xml"]),
        "resume.docx",
      )
    ).attachments[0].mime,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  );
  await assert.rejects(() =>
    resumeUpload(directory(["xl/workbook.xml"]), "resume.docx"),
  );
  await assert.rejects(() =>
    resumeUpload(Buffer.from("not Word"), "resume.doc"),
  );
  await assert.rejects(() =>
    prepareAttachments(
      [{ field: "docs", file: new File([legacy], "resume.doc") }],
      fileDefinition,
      "submissions.resume",
    ),
  );
  await assert.rejects(() =>
    prepareAttachments([], resumeFields, "submissions.resume"),
  );
  const { inquiryForm } = load("lib/forms/defaults.js");
  const fields = parseFields(inquiryForm.form_fields);
  assert.throws(() => parseFields({ code: "[{name:'x'}]" }));
  assert.throws(() =>
    parseFields(
      JSON.stringify([{ name: "website", type: "text", label: "Unsafe" }]),
    ),
  );
  assert.throws(() =>
    validateValues(fields, {
      name: "A",
      email: "invalid",
      need: "A survey",
      details: "Text",
    }),
  );
  assert.throws(() =>
    validateValues(fields, {
      name: "A",
      email: "a@example.com",
      need: "Unknown",
      details: "Text",
    }),
  );
  assert(types.some((type) => type.name === "form"));
  assert(types.find((type) => type.name === "formSubmission").liveEdit);
  assert(!site.fields.some((field) => field.name === "inquiryEmail"));
  assert(
    types
      .find((type) => type.name === "mg2a_contactForm")
      .fields.some((field) => field.name === "form"),
  );
  assert.equal(pageType.initialValue.seo_no_index, false);
  // Stubbed services: no email or Sanity writes can occur in these checks.
  const docs = new Map();
  const messages = [];
  let deliveryError = null,
    failStorage = false,
    missingForm = false;
  const form = { ...inquiryForm, notification_email: "approved@example.com" };
  const handler = load("app/api/submit-form/route.js", {
    "next/server": {
      NextResponse: {
        json: (body, { status = 200 } = {}) =>
          new Response(JSON.stringify(body), { status }),
      },
    },
    "@sanity/client": {
      createClient: () => ({
        fetch: async (query, params) =>
          query.includes('_type=="form"')
            ? missingForm
              ? null
              : form
            : docs.get(params.id),
        createIfNotExists: async (doc) => {
          if (failStorage) throw new Error("storage");
          if (!docs.has(doc._id)) docs.set(doc._id, doc);
          return docs.get(doc._id);
        },
        patch: (id) => ({
          set: (patch) => ({
            commit: async () => Object.assign(docs.get(id), patch),
          }),
        }),
      }),
    },
    resend: {
      Resend: class {
        emails = {
          send: async (data, options) => {
            messages.push({ data, options });
            return { error: deliveryError };
          },
        };
      },
    },
  }).POST;
  process.env.SANITY_TOKEN = "test-stub-only";
  process.env.RESEND_API_KEY = "test-stub-only";
  const request = (body, origin = "http://localhost:3000") =>
    new Request("http://localhost:3000/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: origin },
      body: JSON.stringify(body),
    });
  const input = {
    formId: form._id,
    requestId: "12345678-1234-4234-8234-123456789abc",
    pagePath: "/contact?private=value",
    notification_email: "attacker@example.com",
    values: {
      name: "QA",
      email: "qa@example.com",
      phone: "",
      need: "A survey",
      details: "Test",
    },
  };
  assert.equal((await handler(request({}))).status, 400);
  assert.equal(
    (await handler(request(input, "https://invalid.example"))).status,
    403,
  );
  assert.equal(
    (await handler(request({ ...input, website: "spam" }))).status,
    200,
  );
  assert.equal(docs.size, 0);
  assert.equal(
    (
      await handler(
        request({
          ...input,
          values: { ...input.values, name: "x".repeat(151) },
        }),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await handler(
        request({
          ...input,
          values: {
            ...input.values,
            email: "qa@example.com\r\nBcc:a@example.com",
          },
        }),
      )
    ).status,
    400,
  );
  assert.equal((await handler(request(input))).status, 200);
  assert.deepEqual(messages[0].data.to, ["approved@example.com"]);
  assert.equal(messages[0].data.replyTo, "qa@example.com");
  assert.equal(
    docs.get(`submissions.${input.requestId}`).notification_status,
    "sent",
  );
  assert.equal(docs.get(`submissions.${input.requestId}`).page_url, "/contact");
  assert.equal(docs.get(`submissions.${input.requestId}`).submitter_name, "QA");
  assert.equal((await handler(request(input))).status, 200);
  assert.equal(
    messages.length,
    1,
    "Network retries must not send a second notification",
  );
  deliveryError = { name: "delivery_failure" };
  const failed = {
    ...input,
    requestId: "22345678-1234-4234-8234-123456789abc",
  };
  assert.equal((await handler(request(failed))).status, 200);
  assert.equal(
    docs.get(`submissions.${failed.requestId}`).notification_status,
    "failed",
  );
  assert(
    docs.get(`submissions.${failed.requestId}`).fields.length,
    "Email failure must retain responses",
  );
  form.notification_email = "";
  assert.equal(
    (
      await handler(
        request({
          ...input,
          requestId: "32345678-1234-4234-8234-123456789abc",
        }),
      )
    ).status,
    200,
  );
  assert.equal(messages.length, 2);
  failStorage = true;
  assert.equal(
    (
      await handler(
        request({
          ...input,
          requestId: "42345678-1234-4234-8234-123456789abc",
        }),
      )
    ).status,
    503,
  );
  assert.equal(
    messages.length,
    2,
    "Do not email a submission that failed to save",
  );
  failStorage = false;
  form.purpose = "job";
  const application = {
    ...input,
    requestId: "52345678-1234-4234-8234-123456789abc",
    contextId: "mg2a-test-job",
  };
  assert.equal(
    (await handler(request({ ...application, contextId: undefined }))).status,
    400,
  );
  assert.equal((await handler(request(application))).status, 409);
  docs.set("mg2a-test-job", {
    title: "Approved position",
    page_builder: [{ _type: "mg2a_jobApplication", form: { _ref: form._id } }],
  });
  assert.equal((await handler(request(application))).status, 200);
  assert.equal(
    docs.get(`submissions.${application.requestId}`).fields[0].value,
    "Approved position",
  );
  docs.delete("mg2a-test-job");
  form.purpose = "general";
  missingForm = true;
  assert.equal((await handler(request(input))).status, 404);
  assert(
    [...docs.keys()].every((id) => id.startsWith("submissions.")),
    "Submission IDs must stay on authenticated-only paths",
  );
  console.log(
    "Passed: Studio schema, MG2A blocks, form references, JSON validation, per-form recipients, private submission IDs, retry deduplication, saved responses after email failure, and storage failure handling. No real email or submissions sent.",
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
