import fs from "node:fs";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { launchRoutes, systemRoutes } from "../lib/mg2a/navigation.js";
nextEnv.loadEnvConfig(process.cwd());
try {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: "production",
    apiVersion: "2025-02-19",
    useCdn: false,
    perspective: "published",
  });
  const docs = await client.fetch(
    '*[_type in ["page","mg2a_project"] && defined(slug.current)]{_type,slug}',
  );
  const built = new Set([
    "/",
    "/blog",
    "/404",
    ...docs.map(
      (d) =>
        "/" + (d._type === "mg2a_project" ? "projects/" : "") + d.slug.current,
    ),
  ]);
  const remaining = [
    ...launchRoutes,
    ...systemRoutes
      .filter((path) => path != "/404")
      .map((href) => ({ href, label: href.split("/").at(-1) })),
  ].filter((r) => !built.has(r.href));
  const services = remaining.filter((r) => r.href.startsWith("/services/")),
    projects = remaining.filter((r) => r.href.startsWith("/projects/")),
    core = remaining.filter(
      (r) => !services.includes(r) && !projects.includes(r),
    );
  const group = (title, items) =>
    `## ${title} (${items.length})\n\n` +
    items.map((r) => `- [ ] ${r.label} — \`${r.href}\``).join("\n") +
    "\n\n";
  fs.writeFileSync(
    "docs/mg2a-remaining-pages.md",
    `# MG2A remaining pages\n\nUpdated 2026-11-10. **${remaining.length} routes remain to build**: ${core.length} core/system pages, ${services.length} service pages and ${projects.length} project pages. Recommended-later sitemap destinations are excluded.\n\n` +
      group("Core and system pages", core) +
      group("Service pages using the existing modules", services) +
      group("Project pages using the existing template", projects) +
      `## Built templates and content still needed\n\nAbout and Careers overview pages are built. Team member pages use \`/about/{slug}\`; job pages use \`/careers/{slug}\`. Published records automatically populate their overview. Applications appear only on individual job pages.\n\nThe eight industry pages other than Municipalities currently have starter content and need tailored copy/modules. Team biographies, portraits, benefits, company history, job descriptions and bracketed values still need client content. These are content-completion tasks, separate from missing routes.\n\nProject filtering by service category and industry is still outstanding. Blog listing/article and 404 templates exist. Three thank-you routes above remain to be built and connected to the forms; those routes should be noindex.\n\nRun \`node scripts/report-mg2a-pages.mjs\` after creating pages to refresh this count from published CMS routes.\n`,
  );
  console.log(
    JSON.stringify({
      remaining: remaining.length,
      core: core.length,
      services: services.length,
      projects: projects.length,
    }),
  );
} catch (error) {
  console.error(
    "Page inventory failed:",
    error.statusCode || error.code || "request error",
  );
  process.exitCode = 1;
}
