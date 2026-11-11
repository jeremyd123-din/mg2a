import OnThisPageNav from "../ui/OnThisPageNav";
import { createDataAttribute } from "next-sanity";
import MG2ASection from "../ui/MG2ASection";
import PageBuilder from "@/components/wrappers/PageBuilder";
import { sectionId, serviceWrap } from "../ui/ServiceUI";
import { blockIdentity } from "@/lib/mg2a/blockStyles";
export default function MG2AServiceContent({ data, editorContext }) {
  const sections = data.sections || [];
  const links = sections
    .filter(
      (section) =>
        section.navigationLabel ||
        (section.title && section._type !== "mg2a_relatedServices"),
    )
    .map((section) => ({
      label: section.navigationLabel || section.title,
      href:
        "#" +
        sectionId({
          ...section,
          _instanceKey: blockIdentity(data) + "_" + section._key,
        }),
    }))
    .concat(data.additionalLinks || []);
  const arrayAttribute = editorContext
    ? createDataAttribute({
        baseUrl: "/studio",
        type: editorContext.docType,
        id: editorContext.docId,
        path: editorContext.path + ".sections",
      }).toString()
    : undefined;
  return (
    <MG2ASection data={data} className="pt-20 pb-10">
      <div className={serviceWrap + " flex flex-wrap gap-16"}>
        <aside className="flex-[0_0_220px] [@media(max-width:980px)]:hidden">
          <OnThisPageNav title={data.title} links={links} />
        </aside>
        <div
          className="min-w-0 max-w-[860px] flex-[999_1_600px]"
          data-sanity={arrayAttribute}
        >
          {sections.map((section, index) => (
            <PageBuilder
              key={section._key}
              data={{
                ...section,
                _article: true,
                spacing: {
                  ...section.spacing,
                  paddingTop:
                    section.spacing?.paddingTop ??
                    (index === 0 ? 0 : undefined),
                },
                _instanceKey: blockIdentity(data) + "_" + section._key,
              }}
              index={index}
              docId={editorContext?.docId}
              docType={editorContext?.docType}
              fieldPath={
                editorContext
                  ? `${editorContext.path}.sections[_key=="${section._key}"]`
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </MG2ASection>
  );
}
