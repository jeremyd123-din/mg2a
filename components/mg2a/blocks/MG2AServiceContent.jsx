import { createDataAttribute } from "next-sanity";
import MG2ASection from "../ui/MG2ASection";
import PageBuilder from "@/components/wrappers/PageBuilder";
import { sectionId, serviceWrap, mono } from "../ui/ServiceUI";
import { blockIdentity } from "@/lib/mg2a/blockStyles";
import { safeHref } from "../ui/helpers";
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
          <nav
            aria-label={data.title || "On this page"}
            className="sticky top-[108px]"
          >
            <div className={mono + " mb-3 text-[10px] text-[var(--muted)]"}>
              {data.title}
            </div>
            {links.map((link, index) => (
              <a
                key={link.href + index}
                href={safeHref(link.href)}
                className={
                  "block border-l-2 px-[18px] py-[9px] text-sm leading-[1.4] hover:opacity-100 " +
                  (index === 0
                    ? "border-[var(--accent)] font-semibold"
                    : "border-[var(--line)] opacity-70")
                }
              >
                {link.label}
              </a>
            ))}
          </nav>
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
