import MG2AArchive from "@/components/mg2a/journal/MG2AArchive";
import { organization } from "@/lib/constants";
import { getMetaData } from "@/lib/seo";
import {
  getPostsByCategory,
  getCategoryBySlug,
  getAllCategorySlugs,
} from "@/sanity/utils/queries";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const categories = await getAllCategorySlugs();
  return categories.filter((c) => c.slug).map((c) => ({ slug: c.slug }));
}
import { generateBlogMetaData } from "@/lib/constants";

export default async function BlogCategoryArchive({ params }) {
  const { slug } = await params;
  const data = await getPostsByCategory(0, 1000, slug);
  const category = await getCategoryBySlug(slug);
  if (!data || !data.length || !category) {
    return notFound();
  }

  const heroData = {
    heading: `Posts tagged under ${category.title}`,
    description: null,
    background_theme: `secondary`,
    invert_text_color: true,
    heading_size: `d2`,
    enable_background_pattern: true,
    background_pattern_type: `grid`,
  };

  return (
    <MG2AArchive
      heroData={heroData}
      bodyData={data}
      nextPageDestination={null}
    />
  );
}

export const generateMetadata = async ({ params }) => {
  const { slug } = await params;
  const data = await getPostsByCategory(0, 1000, slug);
  const category = await getCategoryBySlug(slug);
  if (!data || !data.length || !category) return {};
  const staticMetaData = generateBlogMetaData(
    category.meta_title ||
      `Posts tagged in ${category.title} | ${organization}`,
    category.meta_description,
    category.featured_image || null,
  );

  return await getMetaData(staticMetaData, `blog/category/${slug}`, null, null);
};
