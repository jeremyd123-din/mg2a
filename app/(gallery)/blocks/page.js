import Link from "next/link";
import LibraryPreview from "@/components/mg2a/ui/LibraryPreview";
import PageBuilder from "@/components/wrappers/PageBuilder";
import { blockExamples } from "@/lib/mg2a/blockExamples";
export default function BlocksPage() {
  return (
    <main>
      <header className="mx-auto max-w-[1280px] px-[clamp(16px,4vw,56px)] py-10">
        <h1 className="text-[32px] font-bold">MG2A Section Library</h1>
        <p>
          Each section is available in the Sanity page builder. Add, edit and
          drag sections into order.
        </p>
        <Link href="/studio">Open Sanity Studio →</Link>
      </header>
      {blockExamples.map((section) => (
        <div key={section._type}>
          <div className="mx-auto flex max-w-[1280px] items-center justify-between border-t border-[var(--line)] px-[clamp(16px,4vw,56px)] py-6">
            <code>{section._type}</code>
            <Link href={`/blocks/${section._type}`}>View section →</Link>
          </div>
          <LibraryPreview>
            <PageBuilder data={section} />
          </LibraryPreview>
        </div>
      ))}
    </main>
  );
}
