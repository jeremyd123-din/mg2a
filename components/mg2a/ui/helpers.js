import { stegaClean } from "next-sanity";

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
