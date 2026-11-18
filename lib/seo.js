import { baseUrl, organization } from "./constants";
import urlFor from "@/lib/imageUrlBuilder";

export const ogImageDimensions = {
  width: 1200,
  height: 630,
};

export const getPageBySlugUrl = (slug, directory) =>
  directory
    ? `${baseUrl}/${directory}${slug ? `/${slug}` : ``}`
    : `${baseUrl}/${slug ?? ""}`;

export const getMetaData = async (data, directory, prev, next) => {
  const {
    _type,
    title,
    meta_title,
    slug,
    meta_description,
    featured_image,
    og_image,
    seo_no_index,
    publish_date,
    _updatedAt,
  } = data;

  const meta = {
    seoTitle: meta_title ?? `${title || ``} - ${organization}`,
    seoDescription: meta_description ?? "",
  };

  const canonicalUrl =
    slug?.current === "index"
      ? `${baseUrl}/`
      : getPageBySlugUrl(slug?.current, directory);

  const uploadedImage = [og_image, featured_image].find(
    (image) => image?.asset?._ref || image?.asset?._id,
  );
  const titleParts = meta.seoTitle.split(/\s+[|–—-]\s+/);
  if (
    titleParts.length > 1 &&
    titleParts.at(-1).toLowerCase() === organization.toLowerCase()
  )
    titleParts.pop();
  const generatedImage = new URL("/api/mg2a/social-image", canonicalUrl);
  generatedImage.searchParams.set(
    "title",
    titleParts.join(" · ").slice(0, 140),
  );
  const ogImageUrl = uploadedImage
    ? urlFor(uploadedImage).width(1200).height(630).fit("crop").url()
    : generatedImage.href;

  const isArticle = _type === "post";

  return {
    title: meta.seoTitle,
    description: meta.seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(prev || next
      ? {
          other: [
            ...(prev ? [{ rel: "prev", url: `${baseUrl}/${prev}` }] : []),
            ...(next ? [{ rel: "next", url: `${baseUrl}/${next}` }] : []),
          ],
        }
      : {}),
    creator: organization,
    ...(seo_no_index ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: isArticle ? "article" : "website",
      siteName: organization,
      locale: "en_US",
      description: meta.seoDescription,
      title: meta.seoTitle,
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          ...ogImageDimensions,
          alt: meta.seoTitle,
        },
      ],
      ...(isArticle && publish_date
        ? { publishedTime: publish_date, modifiedTime: _updatedAt }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.seoTitle,
      description: meta.seoDescription,
      images: [ogImageUrl],
    },
  };
};
