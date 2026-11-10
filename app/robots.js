import { getSiteSettings } from "@/sanity/utils/queries";
export default async function robots() {
  const settings = await getSiteSettings();
  const isPreview = process.env.VERCEL_ENV === "preview";
  if (isPreview || settings?.disable_indexing)
    return { rules: { userAgent: "*", disallow: "/" } };
  const url = (
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api"] },
    sitemap: `${url}/sitemap.xml`,
  };
}
