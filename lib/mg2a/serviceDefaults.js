import pages from "./servicePages.json";
import { resolveDefaultAssets } from "./resolveDefaults";
export const servicePages = resolveDefaultAssets(pages);
const examples = servicePages.flatMap((page) =>
  page.page_builder.flatMap((block) => [block, ...(block.sections || [])]),
);
export const serviceExamples = [
  ...new Map(examples.map((block) => [block._type, block])).values(),
];
// Prefer the full-width variants for the library previews and initial content.
for (const page of servicePages.slice().reverse())
  for (const block of page.page_builder) {
    const index = serviceExamples.findIndex(
      (example) => example._type === block._type,
    );
    if (index !== -1) serviceExamples[index] = block;
  }
export function servicePageTemplate(index) {
  const { _id, ...page } = servicePages[index];
  return {
    ...page,
    title: index ? "New service" : "New service overview",
    slug: undefined,
    meta_title: undefined,
    meta_description: undefined,
  };
}
