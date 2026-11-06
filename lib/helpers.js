export async function getPaginationContext(query, perPage, activePage) {
  const totalNumberOfPosts = await query;
  const totalNumberOfPaginatedPages = Math.ceil(totalNumberOfPosts / perPage);
  return {
    totalNumberOfPosts,
    totalNumberOfPaginatedPages,
    lastPaginatedPage: activePage >= totalNumberOfPaginatedPages,
  };
}
