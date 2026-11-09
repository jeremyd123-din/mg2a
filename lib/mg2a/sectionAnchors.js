import { blockIdentity } from "./blockIdentity";
export const sectionAnchor = (data) => "section-" + blockIdentity(data);
export function sectionAnchorFromPath(path) {
  const keys = path
    .filter((part) => part && typeof part === "object" && "_key" in part)
    .map((part) => part._key);
  return keys.length ? sectionAnchor({ _instanceKey: keys.join("_") }) : "";
}
