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
  const { primaryNavigation, serviceGroups, industryLinks, launchRoutes } = load("lib/mg2a/navigation.js");
  assert.deepEqual(primaryNavigation.filter(item => item.groups?.length).map(item => item.href), ["/services", "/industries"]);
  assert.equal(serviceGroups.length, 7);
  assert.equal(serviceGroups.flatMap(group => group.links).length, 12);
  assert.equal(industryLinks.length, 9);
  assert.equal(new Set(launchRoutes.map(item => item.href)).size, launchRoutes.length);
  assert(!JSON.stringify(serviceGroups).includes("as-built-survey"));
  const pageType = types.find((t) => t.name === "page");
  const members = pageType.fields.find((f) => f.name === "page_builder").of;
  assert.equal(members.length, 11);
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
    "form",
    "formSubmission",
    "HeroVariant01",
    "mg2a_office",
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
    members.length === 11 &&
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
  // Stub delivery services: these checks cannot send email or write to Sanity.
  let messages = [];
  let deliveryError = null;
  const handler = load("app/api/mg2a/inquiry/route.js", {
    "next/server": {
      NextResponse: {
        json: (body, { status = 200 } = {}) =>
          new Response(JSON.stringify(body), {
            status,
            headers: { "Content-Type": "application/json" },
          }),
      },
    },
    "@sanity/client": {
      createClient: () => ({
        fetch: async () => ({ inquiryEmail: "approved@example.com" }),
      }),
    },
    resend: {
      Resend: class {
        emails = {
          send: async (data) => {
            messages.push(data);
            return { error: deliveryError };
          },
        };
      },
    },
  }).POST;
  process.env.RESEND_API_KEY = "test-stub-only";
  const request = (body, origin = "http://localhost:3000") =>
    new Request("http://localhost:3000/api/mg2a/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: origin },
      body: JSON.stringify(body),
    });
  const input = {
    name: "QA Example",
    email: "qa@example.com",
    phone: "",
    need: "A survey",
    details: "Validation fixture",
    notificationEmail: "attacker@example.com",
  };
  assert.equal((await handler(request({}))).status, 400);
  assert.equal(
    (await handler(request(input, "https://invalid.example"))).status,
    403,
  );
  assert.equal(
    (await handler(request({ ...input, name: "x".repeat(151) }))).status,
    400,
  );
  assert.equal(
    (
      await handler(
        request({ ...input, email: "qa@example.com\r\nBcc:test@example.com" }),
      )
    ).status,
    400,
  );
  assert.equal(
    (await handler(request({ ...input, website: "spam" }))).status,
    200,
  );
  assert.equal(messages.length, 0);
  assert.equal((await handler(request(input))).status, 200);
  assert.deepEqual(messages[0].to, ["approved@example.com"]);
  assert.equal(messages[0].replyTo, "qa@example.com");
  deliveryError = { name: "test_delivery_failure" };
  assert.equal((await handler(request(input))).status, 502);
  console.log(
    "Passed: full Studio schema, all MG2A section registrations, 11-section chooser, exact service SVGs, hero field model, independent spacing/scoped CSS, safe inline bold and form delivery checks. No email sent.",
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
