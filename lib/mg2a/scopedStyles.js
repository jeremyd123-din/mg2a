import { compileString } from "sass";
import { stegaClean } from "next-sanity";
export function compileScopedCss(selector, value) {
  const code = stegaClean(value?.code || "").trim();
  if (!code || /@(?:import|use|forward|at-root)\b|<\/?style/i.test(code))
    return "";
  try {
    return compileString(`${selector}{${code}}`, {
      style: "compressed",
      logger: { warn() {}, debug() {} },
    }).css.replaceAll("<", "\\3c ");
  } catch {
    return "";
  }
}
export function pageIdentity(data) {
  return String(data?._id || data?.slug?.current || "page")
    .replace(/^drafts\./, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_");
}
export function pageStyles(data) {
  return compileScopedCss(
    `[data-mg2a-page="${pageIdentity(data)}"]`,
    data?.scoped_css,
  );
}
