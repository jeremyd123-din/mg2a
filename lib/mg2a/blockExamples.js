import { expansionExamples } from "./expansionDefaults";
import surveyFields from "@/lib/forms/surveyFields.json";
import { serviceExamples } from "./serviceDefaults";
import { serviceScopeForm } from "@/lib/forms/serviceScope";
import { inquiryForm } from "@/lib/forms/defaults";
import homepage from "./homepage.json";
import documents from "./documents.json";
import placeholders from "./referencePlaceholders.json";
import { careers, contact, offices } from "./defaults";
import { resolveDefaultAssets } from "./resolveDefaults";
function resolve(value) {
  if (Array.isArray(value)) return value.map(resolve);
  if (value && typeof value === "object") {
    if (value._ref === "mg2a-survey-request")
      return {
        _id: "mg2a-survey-request",
        title: "Survey request",
        form_fields: { code: JSON.stringify(surveyFields) },
        button_title: "Submit survey request",
      };
    if (value._ref)
      return resolve(
        value._ref === serviceScopeForm._id
          ? serviceScopeForm
          : value._ref === inquiryForm._id
            ? inquiryForm
            : documents.find((doc) => doc._id === value._ref),
      );
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolve(item)]),
    );
  }
  return value;
}
export const blockExamples = resolveDefaultAssets(
  resolve([
    ...expansionExamples.map((block) =>
      block._type === "mg2a_projectGrid"
        ? {
            ...block,
            projects: documents.filter((doc) => doc._type === "mg2a_project"),
          }
        : block._type === "mg2a_industryListing"
          ? {
              ...block,
              industries: documents.filter(
                (doc) => doc._type === "mg2a_industry",
              ),
            }
          : block._type === "mg2a_projectHero"
            ? {
                ...block,
                title: "Bradley Commons Commercial Center",
                image: { _localAsset: "bradley-commons-plan.jpg" },
              }
            : block,
    ),
    ...serviceExamples,
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
