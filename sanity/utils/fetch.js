import clientConfig from "../config/clientConfig";
import { createClient } from "next-sanity";
import { draftMode } from "next/headers";

export { default as groq } from "groq";

export async function fetchSanity(query, params, nextOptions = {}) {
  let isDraftMode = false;
  try {
    const draft = await draftMode();
    isDraftMode = draft.isEnabled;
  } catch {
    // Outside request scope (e.g. generateStaticParams at build time)
  }
  const preview = isDraftMode;
  const fetchId = Math.random().toString(36).substring(7);

  const config = preview
    ? {
        stega: { enabled: true, studioUrl: "/studio" },
        perspective: "previewDrafts",
        useCdn: false,
        token: process.env.SANITY_TOKEN,
        cache: "no-store",
        next: { revalidate: 0, ...nextOptions },
      }
    : {
        perspective: "published",
        ...(process.env.NODE_ENV === "development"
          ? { cache: "no-store" }
          : {}),
        useCdn: false,
        next: {
          revalidate: process.env.NODE_ENV === "development" ? 0 : 15000,
          ...nextOptions,
        },
      };

  console.log(`🏷️  [${fetchId}] Cache config:`, {
    tags: config.next?.tags,
    revalidate: config.next?.revalidate,
    preview,
  });

  return createClient(clientConfig).fetch(query, params, config);
}
