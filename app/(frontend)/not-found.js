import Link from "next/link";
export default function NotFound() {
  return (
    <section className="min-h-[calc(100svh-125px)] bg-[#0b1822] pb-[120px] pt-[clamp(96px,14vw,176px)] text-[#eef2f4]">
      <div className="mx-auto max-w-[1280px] px-[clamp(16px,4vw,56px)]">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--onDark)]">
          404
        </p>
        <h1 className="mt-4 text-[clamp(36px,5vw,60px)] leading-tight font-bold">
          Page not found.
        </h1>
        <p className="mt-6 text-lg text-[#a3b4c0]">
          The page you’re looking for is unavailable.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded bg-[var(--btn)] px-6 py-3 font-semibold text-white"
        >
          Return to MG2A
        </Link>
      </div>
    </section>
  );
}
