import Link from "next/link";
import { mediaUrl } from "../ui/helpers";
export default function MG2AArchive({
  heroData = {},
  bodyData = [],
  prevPageDestination,
  nextPageDestination,
}) {
  return (
    <section className="mx-auto max-w-[1280px] px-[clamp(16px,4vw,56px)] py-24">
      <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[.14em] text-[var(--accent)]">
        MG2A · Developer’s Journal
      </p>
      <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight">
        {heroData.heading || "Developer’s Journal"}
      </h1>
      {heroData.description && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
          {heroData.description}
        </p>
      )}
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bodyData.map((post) => (
          <article
            key={post._id}
            className="overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)]"
          >
            <Link href={`/blog/${post.slug.current}`} className="block h-full">
              {post.featured_image && (
                <img
                  className="h-60 w-full object-cover"
                  src={mediaUrl(post.featured_image)}
                  alt={post.featured_image.alt || ""}
                  loading="lazy"
                />
              )}
              <div className="p-7">
                {post.publish_date && (
                  <time
                    className="text-sm text-[var(--muted)]"
                    dateTime={post.publish_date}
                  >
                    {post.publish_date}
                  </time>
                )}
                <h2 className="mt-3 text-2xl font-semibold">
                  {post.heading || post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-4 leading-relaxed text-[var(--muted)]">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-6 inline-block font-semibold text-[var(--accent)]">
                  Read article →
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
      {!bodyData.length && (
        <p className="mt-8 text-[var(--muted)]">
          Articles from the MG2A team will appear here.
        </p>
      )}
      {(prevPageDestination || nextPageDestination) && (
        <nav
          aria-label="Journal pagination"
          className="mt-10 flex justify-between gap-6"
        >
          {prevPageDestination ? (
            <Link href={prevPageDestination}>← Previous page</Link>
          ) : (
            <span />
          )}
          {nextPageDestination && (
            <Link href={nextPageDestination}>Next page →</Link>
          )}
        </nav>
      )}
    </section>
  );
}
