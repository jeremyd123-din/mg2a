import { groq } from "next-sanity";
import { fetchSanity } from "./fetch";
import { QUERY_omitDrafts } from "./constants";

export async function getPageBySlug(slug) {
  return fetchSanity(
    groq`*[(_type == "page" && slug.current == $slug) || (_type=="mg2a_project" && "projects/"+slug.current==$slug) || (_type=="mg2a_team" && "about/"+slug.current==$slug) || (_type=="mg2a_job" && "careers/"+slug.current==$slug)][0]{
    ...,
    page_builder[]{...,
    "breadcrumbParent":select(^._type=="mg2a_project"=>{"label":"Projects","href":"/projects"},^.page_kind=="industry"=>{"label":"Industries","href":"/industries"},^._type=="mg2a_job"=>{"label":"Careers","href":"/careers"}),
    _type=="mg2a_pageHero" => {"title":coalesce(title,^.title),"description":coalesce(description,^.summary,^.location),"breadcrumb":select(^._type=="mg2a_job"=>^.title,breadcrumb)},
    _type=="mg2a_companyStory" => {"body":coalesce(body,^.body)},
    _type=="mg2a_memberProfile" => {"person":^{title,role,image,alt,summary,body,email,phone}},
    _type=="mg2a_offices" => {"offices":*[_id=="mg2a-settings"][0].offices},
    _type=="mg2a_teamGrid" => {"members":*[_type=="mg2a_team" && defined(slug.current)]|order(order asc,title asc){_id,title,role,image,alt,"href":"/about/"+slug.current}},
    _type=="mg2a_jobApplication" => {"closed":^.status=="closed","jobTitle":^.title,"contextId":^._id,"form":form->{_id,title,form_fields,button_title,note,thankyou_message,error_message}},
    _type=="mg2a_projectHero" => {"title":coalesce(title,^.title),"image":coalesce(image,^.image),"eyebrow":coalesce(eyebrow,^.eyebrow),"description":coalesce(description,^.description)},
    _type=="mg2a_testimonialProject" => {"project":project->{...,"href":coalesce("/projects/"+slug.current,href)}},_type == "mg2a_relatedProjects" => {items[]{...,"project":project->{...}}},_type == "mg2a_serviceContent" => {sections[]{...}},"categories":categories[]->{...},"projects":projects[]->{...},"industries":industries[]->{...,"label":coalesce(listing_title,title,label),"href":coalesce("/"+slug.current,href)},_type in ["mg2a_contactForm", "mg2a_scopeForm", "mg2a_surveyForm"] => {"clientAccessUrl":*[_id=="mg2a-settings"][0].clientAccessUrl,"offices":*[_id=="mg2a-settings"][0].offices,"form":form->{_id,title,form_fields,button_title,note,thankyou_message,error_message}}, _type in ["mg2a_careers","mg2a_jobList"] => {"jobs":*[_type=="mg2a_job" && status=="open" && defined(slug.current)]|order(order asc,_createdAt asc){...,"href":"/careers/"+slug.current}},_type=="mg2a_projectGrid" => {"projects":*[_type=="mg2a_project" && defined(slug.current) && (!coalesce(^.excludeCurrent,false) || "projects/"+slug.current!=$slug)]|order(order asc,title asc){...,"href":"/projects/"+slug.current}},
    _type=="mg2a_industryListing" => {"industries":*[_type=="page" && page_kind=="industry" && (!coalesce(^.excludeCurrent,false) || slug.current!=$slug)]|order(listing_order asc,title asc){_id,title,listing_summary,"label":coalesce(listing_title,title),"href":"/"+slug.current}}}

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
        "mg2a_team",
        "form",
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
    groq`*[_type in ["page","mg2a_project","mg2a_team","mg2a_job"] && ${QUERY_omitDrafts}]{ "slug":select(_type=="mg2a_project"=>"projects/"+slug.current,_type=="mg2a_team"=>"about/"+slug.current,_type=="mg2a_job"=>"careers/"+slug.current,slug.current) }`,
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
