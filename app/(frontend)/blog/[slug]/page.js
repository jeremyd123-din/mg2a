import { getMetaData } from "@/lib/seo";
import { getPostBySlug, getAllPostSlugs } from "@/sanity/utils/queries";
import { notFound } from "next/navigation";
import MG2AArticle from "@/components/mg2a/journal/MG2AArticle";
import JsonLd from "@/components/wrappers/JsonLd";
import { baseUrl, organization } from "@/lib/constants";
import { mediaUrl } from "@/components/mg2a/ui/helpers";
export async function generateStaticParams() {
  return (await getAllPostSlugs())
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug }));
}
export default async function Post({ params }) {
  const { slug } = await params;
  const data = await getPostBySlug(slug);
  if (!data) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.meta_title || data.title,
    description: data.meta_description || "",
    url: `${baseUrl}/blog/${data.slug.current}`,
    datePublished: data.publish_date || data._createdAt,
    dateModified: data._updatedAt,
    ...(data.featured_image ? { image: mediaUrl(data.featured_image) } : {}),
    author: { "@type": "Organization", name: organization },
    publisher: { "@type": "Organization", name: organization },
  };
  return (
    <>
      <JsonLd schema={schema} />
      <MG2AArticle data={data} />
    </>
  );
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getPostBySlug(slug);
  return data ? getMetaData(data, "blog") : {};
}
