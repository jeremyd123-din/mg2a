import { compileString } from "sass";
import { stegaClean } from "next-sanity";

export function blockIdentity(data) {
  return String(data._key || data._id || data._type).replace(
    /[^a-zA-Z0-9_-]/g,
    "_",
  );
}
export function blockStyles(data, paddingTarget = "") {
  const selector = `[data-mg2a-block="${blockIdentity(data)}"]`;
  const target = selector + (paddingTarget ? ` ${paddingTarget}` : "");
  const spacing = data.spacing || {};
  const declarations = (top, bottom) =>
    [
      Number.isFinite(top) && top >= 0 ? `padding-top:${top}px` : "",
      Number.isFinite(bottom) && bottom >= 0
        ? `padding-bottom:${bottom}px`
        : "",
    ]
      .filter(Boolean)
      .join(";");
  const desktop = declarations(spacing.paddingTop, spacing.paddingBottom);
  const mobile = declarations(
    spacing.mobilePaddingTop,
    spacing.mobilePaddingBottom,
  );
  let css = `${desktop ? `${target}{${desktop}}` : ""}${mobile ? `@media(max-width:980px){${target}{${mobile}}}` : ""}`;
  const custom = stegaClean(data.scoped_css?.code || "").trim();
  if (custom && !/@(?:import|use|forward|at-root)\b|<\/?style/i.test(custom)) {
    try {
      css += compileString(`${selector}{${custom}}`, {
        style: "compressed",
        logger: { warn() {}, debug() {} },
      }).css;
    } catch {
      /* Keep the page usable while an editor corrects incomplete CSS. */
    }
  }
  return css.replaceAll("<", "\\3c ");
}
