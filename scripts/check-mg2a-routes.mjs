import assert from "node:assert/strict";

// Run against `npm run build && npm run start`, not the development server:
// static-to-dynamic fallback errors only occur in production mode.
const origin = process.env.MG2A_TEST_ORIGIN || "http://localhost:3002";
for (const [path, expectedStatus] of [
  ["/", 200],
  ["/services", 200],
  ["/about", 200],
  ["/about/jacob-gingerich", 200],
  ["/careers", 200],
  ["/careers/project-engineer-pe", 200],
  ["/projects", 200],
  ["/projects/bradley-commons", 200],
  ["/order-a-survey", 200],
  ["/industries", 200],
  ["/industries/municipalities", 200],
  ["/industries/manufacturing", 200],
  ["/services/water-resources", 200],
  ["/services/water-resources/stormwater-management-plans", 200],
  ["/a", 404],
  ["/mg2a-route-check/missing-page", 404],
  ["/blog/mg2a-route-check-missing-post", 404],
  ["/blog/category/mg2a-route-check-missing-category", 404],
]) {
  const response = await fetch(new URL(path, origin), { redirect: "manual" });
  const html = await response.text();
  if (path === "/services/water-resources/stormwater-management-plans") {
    assert(html.includes("Drainage area mapping"));
    assert(html.includes("Site address or PIN"));
    assert(html.includes('href="#section-service-content_included"'));
  }
  if (
    [
      "/industries/manufacturing",
      "/industries/municipalities",
      "/projects/bradley-commons",
    ].includes(path)
  ) {
    const breadcrumb =
      html.match(
        /<nav[^>]*aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/,
      )?.[1] || "";
    const parent = path.startsWith("/industries/")
      ? "/industries"
      : "/projects";
    assert(
      breadcrumb.includes(`href="${parent}"`),
      `${path}: missing parent breadcrumb`,
    );
  }
  if (path === "/careers") {
    assert(!html.includes('name="resume"'));
    assert(html.includes('href="/careers/project-engineer-pe"'));
  }
  if (path === "/careers/project-engineer-pe") {
    assert(html.includes('name="resume"'));
    assert(html.includes(".pdf,.doc,.docx"));
  }
  if (path === "/about") assert(html.includes('href="/about/jacob-gingerich"'));
  assert.equal(
    response.status,
    expectedStatus,
    `${path}: unexpected HTTP status`,
  );
  assert(
    !html.includes("DYNAMIC_SERVER_USAGE"),
    `${path}: static-to-dynamic error`,
  );
  if (expectedStatus === 404)
    assert(html.includes("Page not found."), `${path}: missing MG2A 404 view`);
  console.log(`${response.status} ${path}`);
}
