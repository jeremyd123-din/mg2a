import homepage from "./homepage.json";
import documents from "./documents.json";
import placeholders from "./referencePlaceholders.json";
import { careers, contact, offices } from "./defaults";
import { resolveDefaultAssets } from "./resolveDefaults";
function resolve(value) {
  if (Array.isArray(value)) return value.map(resolve);
  if (value && typeof value === "object") {
    if (value._ref)
      return resolve(documents.find((doc) => doc._id === value._ref));
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolve(item)]),
    );
  }
  return value;
}
export const blockExamples = resolveDefaultAssets(
  resolve([
    ...homepage.map((block) =>
      block._type === "mg2a_whyMG2A"
        ? {
            ...block,
            metrics: placeholders.metrics,
            testimonial: placeholders.testimonial,
          }
        : block,
    ),
    { ...careers, jobs: placeholders.jobs },
    { ...contact, offices },
    {
      _key: "metrics",
      _type: "mg2a_metrics",
      block_category: "mg2a",
      title: "MG2A by the numbers",
      items: placeholders.metrics,
    },
  ]),
);
