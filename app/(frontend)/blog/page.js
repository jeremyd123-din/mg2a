import MG2AArchive from "@/components/mg2a/journal/MG2AArchive";
import { paginatedItemsPerPage } from "@/lib/constants";
import { getPaginationContext } from "@/lib/helpers";
import { getMetaData } from "@/lib/seo";
import { getPosts, getPostsCount } from "@/sanity/utils/queries";
import { notFound } from "next/navigation";
import { generateBlogMetaData } from "@/lib/constants";

export default async function BlogArchive() {
  const data = await getPosts(0, paginatedItemsPerPage);

  const heroData = {
    heading: `Developer’s Journal`,
    description: `Civil engineering, surveying and infrastructure insights from the MG2A team.`,
    background_theme: `secondary`,
    invert_text_color: true,
    heading_size: `d2`,
    enable_background_pattern: true,
    background_pattern_type: `grid`,
  };

  const { lastPaginatedPage } = await getPaginationContext(
    getPostsCount(),
    paginatedItemsPerPage,
    1,
  );
  return (
    <MG2AArchive
      heroData={heroData}
      bodyData={data}
      nextPageDestination={lastPaginatedPage ? null : `/blog/page/2`}
    />
  );
}

export const generateMetadata = async () => {
  const staticMetaData = generateBlogMetaData();
  const data = await getPosts(0, paginatedItemsPerPage);
  if (!data || !data.length) return {};
  const { lastPaginatedPage } = await getPaginationContext(
    getPostsCount(),
    paginatedItemsPerPage,
    1,
  );

  return await getMetaData(
    staticMetaData,
    `blog`,
    null,
    lastPaginatedPage ? null : `blog/page/2`,
  );
};
