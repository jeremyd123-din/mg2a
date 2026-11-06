import referencePlaceholders from "@/lib/mg2a/referencePlaceholders.json";
import LibraryPreview from "@/components/mg2a/ui/LibraryPreview";
import PageBuilder from "@/components/wrappers/PageBuilder";
import homepage from "@/lib/mg2a/homepage.json";
import documents from "@/lib/mg2a/documents.json";
import { careers, contact, offices } from "@/lib/mg2a/defaults";
import { resolveDefaultAssets } from "@/lib/mg2a/resolveDefaults";
function resolve(value) {
  if (Array.isArray(value)) return value.map(resolve);
  if (value && typeof value === "object") {
    if (value._ref)
      return resolve(
        [...documents, ...offices].find((d) => d._id === value._ref),
      );
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, resolve(v)]),
    );
  }
  return value;
}
export default function BlocksPage() {
  const examples = homepage.map((block) =>
    block._type === "mg2a_whyMG2A"
      ? {
          ...block,
          metrics: referencePlaceholders.metrics,
          testimonial: referencePlaceholders.testimonial,
        }
      : block,
  );
  const sections = resolveDefaultAssets(
    resolve([
      ...examples,
      { ...careers, jobs: referencePlaceholders.jobs },
      contact,
    ]),
  );
  return (
    <main>
      <header className="wrap mx-auto max-w-[1280px] px-[clamp(16px,4vw,56px)] py-10">
        <h1 className="text-[32px] font-bold">MG2A Section Library</h1>
        <p>
          Each section is available in the Sanity page builder. Add, edit and
          drag sections into order.
        </p>
        <a href="/studio">Open Sanity Studio →</a>
      </header>
      <LibraryPreview>
        {sections.map((section) => (
          <div key={section._key}>
            <div className="wrap mx-auto max-w-[1280px] px-[clamp(16px,4vw,56px)] py-6 border-t border-[var(--line)]">
              <code>{section._type}</code>
            </div>
            <PageBuilder data={section} />
          </div>
        ))}
      </LibraryPreview>
    </main>
  );
}
