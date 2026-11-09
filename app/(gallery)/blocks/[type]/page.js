import { notFound } from "next/navigation";
import { serviceExamples } from "@/lib/mg2a/serviceDefaults";
import { blockExamples } from "@/lib/mg2a/blockExamples";
import PageBuilder from "@/components/wrappers/PageBuilder";
import LibraryPreview from "@/components/mg2a/ui/LibraryPreview";
export function generateStaticParams() {
  return blockExamples.map((example) => ({ type: example._type }));
}
export default async function BlockPreview({ params }) {
  const { type } = await params;
  const example = blockExamples.find((block) => block._type === type);
  if (!example) notFound();
  return (
    <main
      data-preview-theme={
        serviceExamples.some((block) => block._type === type)
          ? "light"
          : undefined
      }
      className={
        (type === "mg2a_quickPaths" ? "pt-[112px] " : "") +
        "min-h-screen bg-[var(--bg)] text-[var(--ink)]"
      }
    >
      <LibraryPreview>
        <PageBuilder data={example} />
      </LibraryPreview>
    </main>
  );
}
