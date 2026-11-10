import pages from "./expansionPages.json";
import project from "./projectDetailBlocks.json";
import { resolveDefaultAssets } from "./resolveDefaults";
export const expansionPages = resolveDefaultAssets(pages);
export const projectDetailBlocks = resolveDefaultAssets(project);
export const expansionExamples = [
  ...new Map(
    [...expansionPages.flatMap((p) => p.page_builder), ...projectDetailBlocks]
      .filter((b) => !["mg2a_faq", "mg2a_ctaBanner"].includes(b._type))
      .map((b) => [b._type, b]),
  ).values(),
];
export const projectInitialBlocks = [
  { _type: "mg2a_projectHero", _key: "hero" },
  { _type: "mg2a_projectStory", _key: "story", title: "The project" },
  {
    _type: "mg2a_projectGrid",
    _key: "related",
    title: "More projects",
    compact: true,
    excludeCurrent: true,
    limit: 3,
  },
];
