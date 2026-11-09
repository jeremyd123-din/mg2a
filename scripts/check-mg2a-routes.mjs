import assert from "node:assert/strict";

// Run against `npm run build && npm run start`, not the development server:
// static-to-dynamic fallback errors only occur in production mode.
const origin = process.env.MG2A_TEST_ORIGIN || "http://localhost:3002";
for (const [path, expectedStatus] of [
  ["/", 200],
  ["/services", 200],
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
