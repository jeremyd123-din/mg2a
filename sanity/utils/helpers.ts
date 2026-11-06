import { defineArrayMember, type SlugIsUniqueValidator } from "sanity";
export const isUniqueAcrossAllDocuments: SlugIsUniqueValidator = async (
  slug,
  { document, getClient },
) => {
  const id = document?._id.replace(/^drafts\./, "");
  return getClient({ apiVersion: "2025-02-19" }).fetch(
    '!defined(*[_type in ["page", "post", "post_category"] && !(_id in [$id,$draft]) && slug.current==$slug][0]._id)',
    { id, draft: `drafts.${id}`, slug },
  );
};
export const createDocumentArray = (types: Array<{ name: string }>) =>
  types.map(({ name }) => defineArrayMember({ name, type: name }));
