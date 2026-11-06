import { pageIdentity, pageStyles } from "@/lib/mg2a/scopedStyles";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { mediaUrl, safeHref } from "../ui/helpers";
const components = {
  types: {
    image: ({ value }) => (
      <figure>
        <img
          className="w-full rounded-md"
          src={mediaUrl(value)}
          alt={value.alt || ""}
          loading="lazy"
        />
        {value.caption && <figcaption>{value.caption}</figcaption>}
      </figure>
    ),
    code: ({ value }) => (
      <pre>
        <code>{value.code}</code>
      </pre>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={safeHref(value.href)}
        target={value.open_in_new_tab ? "_blank" : undefined}
        rel={value.open_in_new_tab ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  },
};
export default function MG2AArticle({ data }) {
  return (
    <article
      data-mg2a-page={pageIdentity(data)}
      className="mx-auto max-w-[1000px] px-[clamp(16px,4vw,56px)] py-24"
    >
      {data.scoped_css?.code && <style>{pageStyles(data)}</style>}
      <Link href="/blog" className="text-sm font-semibold text-[var(--accent)]">
        ← Developer’s Journal
      </Link>
      <h1 className="mt-6 text-5xl font-bold tracking-tight">
        {data.heading || data.title}
      </h1>
      {data.publish_date && (
        <time
          className="mt-5 block text-[var(--muted)]"
          dateTime={data.publish_date}
        >
          {data.publish_date}
        </time>
      )}
      {data.featured_image && (
        <img
          className="my-10 max-h-[560px] w-full rounded-md object-cover"
          src={mediaUrl(data.featured_image)}
          alt={data.featured_image.alt || ""}
        />
      )}
      <div className="prose mt-10 max-w-none text-[var(--ink)] dark:prose-invert prose-headings:text-[var(--ink)] prose-a:text-[var(--accent)]">
        <PortableText value={data.content || []} components={components} />
      </div>
    </article>
  );
}
