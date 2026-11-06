import MG2AArchive from "@/components/mg2a/journal/MG2AArchive";
import { organization, paginatedItemsPerPage } from "@/lib/constants";
import { getPaginationContext } from "@/lib/helpers";
import { getMetaData } from "@/lib/seo";
import { getPosts, getPostsCount } from "@/sanity/utils/queries";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

export async function generateStaticParams() {
  const count = await getPostsCount();
  const totalPages = Math.ceil(count / paginatedItemsPerPage);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    slug: String(i + 2),
  }));
}
import { generateBlogMetaData } from "@/lib/constants";

export default async function BlogArchivePaginated({ params }) {
  const { slug } = await params;
  if (isNaN(parseFloat(slug))) {
    return notFound();
  }
  if (slug === `1`) {
    redirect(`/blog`);
  }
  const start = slug * paginatedItemsPerPage - paginatedItemsPerPage;
  const end = slug * paginatedItemsPerPage;
  const data = await getPosts(start, end);
  if (!data || data.length === 0) {
    return notFound();
  }
  const { lastPaginatedPage } = await getPaginationContext(
    getPostsCount(),
    paginatedItemsPerPage,
    parseFloat(slug),
  );

  const heroData = {
    heading: `Developer’s Journal — Page ${slug}`,
    description: `Civil engineering, surveying and infrastructure insights from the MG2A team.`,
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
      prevPageDestination={
        parseFloat(slug) === 2 ? `/blog` : `/blog/page/${parseFloat(slug) - 1}`
      }
      nextPageDestination={
        lastPaginatedPage ? null : `/blog/page/${parseFloat(slug) + 1}`
      }
    />
  );
}

export const generateMetadata = async ({ params }) => {
  const { slug } = await params;
  if (isNaN(parseFloat(slug))) {
    return {};
  }
  const start = slug * paginatedItemsPerPage - paginatedItemsPerPage;
  const end = slug * paginatedItemsPerPage;
  const data = await getPosts(start, end);
  if (!data || data.length === 0) {
    return {};
  }
  const { lastPaginatedPage } = await getPaginationContext(
    getPostsCount(),
    paginatedItemsPerPage,
    parseFloat(slug),
  );
  const staticMetaData = generateBlogMetaData(
    `Latest Posts | Page ${slug} | ${organization}`,
  );
  return await getMetaData(
    staticMetaData,
    `blog/page/${slug}`,
    `${slug == "2" ? `blog` : `blog/page/${parseFloat(slug) - 1}`}`,
    lastPaginatedPage ? null : `blog/page/${parseFloat(slug) + 1}`,
  );
};
