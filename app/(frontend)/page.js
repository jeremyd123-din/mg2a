import { pageStyles } from "@/lib/mg2a/scopedStyles";
import PageBuilder from "@/components/wrappers/PageBuilder";
import HomepageMotion from "@/components/mg2a/ui/HomepageMotion";
import { getMetaData } from "@/lib/seo";
import { getMG2ASettings, getPageBySlug } from "@/sanity/utils/queries";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";

const homepagePath = "index";

export default async function Page() {
  const [{ isEnabled: isPreview }, data, settings] = await Promise.all([
    draftMode(),
    getPageBySlug(homepagePath),
    getMG2ASettings(),
  ]);
  if (!data) {
    return notFound();
  }
  return (
    <>
      {data?.scoped_css?.code && <style>{pageStyles(data)}</style>}
      {data?.page_builder?.map((elem, index) => (
        <PageBuilder
          key={elem._key}
          data={elem}
          index={index}
          docId={isPreview ? data._id : undefined}
          docType={isPreview ? data._type : undefined}
        />
      ))}
      {settings?.enableHomepageAnimations === true && <HomepageMotion />}
    </>
  );
}

export const generateMetadata = async () => {
  const data = await getPageBySlug(homepagePath);
  if (!data) return {};
  return await getMetaData(data);
};
