import { stegaClean } from "next-sanity";

const lowercaseTitleWords = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of",
  "on", "or", "so", "the", "to", "up", "via", "with", "yet",
]);
const titleWord = /[\p{L}\p{N}]+(?:[’'][\p{L}\p{N}]+)*/gu;

export function buttonLabel(label) {
  if (label == null) return label;
  const words = [...label.matchAll(titleWord)];
  const first = words[0]?.index;
  const last = words.at(-1)?.index;

  // Preserve acronyms, internal capitals, and Sanity's invisible edit markers.
  return label.replace(titleWord, (word, index) => {
    const lower = word.toLowerCase();
    if (
      index !== first &&
      index !== last &&
      lowercaseTitleWords.has(lower) &&
      (word.length === 1 || word !== word.toUpperCase())
    ) {
      return lower;
    }
    return /\p{Lu}/u.test(word.slice(1))
      ? word
      : word[0].toUpperCase() + word.slice(1);
  });
}

export function mediaUrl(value) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (value.asset?.url) return value.asset.url;
  const ref = value.asset?._ref;
  const project = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!ref || !project) return undefined;
  if (ref.startsWith("image-")) {
    const [, id, size, format] = ref.split("-");
    return `https://cdn.sanity.io/images/${project}/production/${id}-${size}.${format}`;
  }
  if (ref.startsWith("file-")) {
    const [, id, format] = ref.split("-");
    return `https://cdn.sanity.io/files/${project}/production/${id}.${format}`;
  }
}

export function safeHref(value) {
  const href = stegaClean(value || "").trim();
  return /^(\/(?!\/)|#|https?:\/\/|tel:|mailto:)/i.test(href)
    ? href
    : undefined;
}

export const projectCardPosition = (project, override) =>
  stegaClean(override || project?.cardImagePosition || "50% 50%");
