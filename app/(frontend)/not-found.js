import Link from "next/link";
export default function NotFound() {
  return (
    <section className="mx-auto max-w-[1280px] px-[clamp(16px,4vw,56px)] py-32">
      <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
        404
      </p>
      <h1 className="mt-4 text-5xl font-bold">Page not found.</h1>
      <p className="mt-6 text-lg text-[var(--muted)]">
        The page you’re looking for is unavailable.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded bg-[var(--btn)] px-6 py-3 font-semibold text-white"
      >
        Return to MG2A
      </Link>
    </section>
  );
}
