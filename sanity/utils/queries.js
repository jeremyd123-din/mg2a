import { groq } from "next-sanity";
import { fetchSanity } from "./fetch";
import { QUERY_omitDrafts } from "./constants";

export async function getPageBySlug(slug) {
  return fetchSanity(
    groq`*[_type == "page" && slug.current == $slug][0]{
    ...,
    page_builder[]{...,"categories":categories[]->{...},"projects":projects[]->{...},"industries":industries[]->{...},_type == "mg2a_contactForm" => {"offices":*[_id=="mg2a-settings"][0].offices}, _type == "mg2a_careers" => {"jobs":*[_type=="mg2a_job" && status=="open"]|order(order asc,_createdAt asc)}}

}`,
    { slug },
    {
      tags: [
        "page",
        "mg2a_project",
        "mg2a_serviceCategory",
        "mg2a_industry",
        "mg2a_settings",
        "mg2a_job",
      ],
    },
  );
}

export async function getPostBySlug(slug) {
  return fetchSanity(
    groq`*[_type == "post" && slug.current == $slug][0]{
      ...,
      content[]{
        ...,
        _type == "image" => {
          ...,
          asset->,
          hotspot,
          crop,
          alt
        }
      },
      featured_image {
        asset->,
        hotspot,
        crop,
        alt
      },
      "primary_category": categories[0]->
    }`,
    { slug },
    { tags: ["post"] },
  );
}

export async function getPosts(start, end) {
  return fetchSanity(
    groq`*[_type == "post" && ${QUERY_omitDrafts}] | order(publish_date desc)[${start}...${end}] {
      ...,
      featured_image {
        asset->,
        hotspot,
        crop,
        alt
      },
      "excerpt": array::join(string::split((pt::text(content)), "")[0..100], "") + "..."
    }`,
    { start, end },
    { tags: ["post"] },
  );
}

export async function getPostsByCategory(start, end, categorySlug) {
  return fetchSanity(
    groq`*[_type == "post" && ${QUERY_omitDrafts} && $categorySlug in categories[]->slug.current] | order(publish_date desc)[${start}...${end}] {
      ...,
      featured_image {
        asset->,
        hotspot,
        crop,
        alt
      },
      "excerpt": array::join(string::split((pt::text(content)), "")[0..100], "") + "..."
    }`,
    { start, end, categorySlug },
    { tags: ["post"] },
  );
}

export async function getCategoryBySlug(categorySlug) {
  return fetchSanity(
    groq`*[_type == "post_category" && ${QUERY_omitDrafts} && slug.current == $categorySlug][0] {
      title,
      meta_title,
      meta_description,
      featured_image {
        asset->,
        hotspot,
        crop,
        alt
      }
    }`,
    { categorySlug },
    { tags: ["post"] },
  );
}

export async function getPostsCount() {
  return fetchSanity(
    groq`count(*[_type == "post" && ${QUERY_omitDrafts}])`,
    {},
    { tags: ["post"] },
  );
}

export async function getPostsByCategoryCount(categorySlug) {
  return fetchSanity(
    groq`count(*[_type == "post" && ${QUERY_omitDrafts} && $categorySlug in categories[]->slug.current])`,
    { categorySlug },
    { tags: ["post"] },
  );
}

export async function getSiteSettings() {
  return fetchSanity(
    groq`*[_type == "mg2a_settings" && _id == "mg2a-settings"][0]{disable_indexing,og_image,gtm_id}`,
    {},
    { tags: ["mg2a_settings"] },
  );
}

export async function getAllPageSlugs() {
  return fetchSanity(
    groq`*[_type == "page" && ${QUERY_omitDrafts}]{ "slug": slug.current }`,
    {},
    { tags: ["page"] },
  );
}

export async function getAllPostSlugs() {
  return fetchSanity(
    groq`*[_type == "post" && ${QUERY_omitDrafts}]{ "slug": slug.current }`,
    {},
    { tags: ["post"] },
  );
}

export async function getAllCategorySlugs() {
  return fetchSanity(
    groq`*[_type == "post_category" && ${QUERY_omitDrafts}]{ "slug": slug.current }`,
    {},
    { tags: ["post"] },
  );
}

export async function getMG2ASettings() {
  return fetchSanity(
    groq`*[_type == "mg2a_settings" && _id in ["mg2a-settings", "drafts.mg2a-settings"]][0]{...}`,
    {},
    { tags: ["mg2a_settings"] },
  );
}
