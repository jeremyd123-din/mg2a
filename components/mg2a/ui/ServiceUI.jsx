import { PortableText } from "@portabletext/react";
import { stegaClean } from "next-sanity";
import MG2ASection from "./MG2ASection";
import { sectionAnchor } from "@/lib/mg2a/sectionAnchors";
import { safeHref } from "./helpers";
export const serviceWrap =
  "mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,56px)]";
export const mono =
  "font-[family-name:var(--font-mono)] uppercase tracking-[.14em]";
export const serviceHeading =
  "text-[clamp(28px,3vw,38px)] leading-[1.1] font-bold tracking-[-.02em]";
export const articleHeading =
  "text-[clamp(28px,3vw,36px)] leading-[1.1] font-bold tracking-[-.02em]";
export const headingFor = (data) =>
  data._article ? articleHeading : serviceHeading;
export const sectionId = sectionAnchor;
export function Arrow() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M3 8H13M9 4L13 8L9 12" />
    </svg>
  );
}
export function ServiceButton({
  link,
  secondary = false,
  banner = false,
  showArrow = true,
}) {
  if (!link?.label || !safeHref(link.href)) return null;
  return (
    <a
      href={safeHref(link.href)}
      className={
        "inline-flex min-h-12 items-center gap-2.5 rounded px-[22px] text-[15px] font-semibold transition-transform hover:-translate-y-px motion-reduce:transition-none " +
        (secondary
          ? "border-[1.5px] border-white/55 text-white"
          : banner
            ? "bg-white text-[#1b4f72]"
            : "bg-[var(--btn)] text-white")
      }
    >
      {link.label}
      {showArrow && !secondary && !banner && <Arrow />}
    </a>
  );
}
export function ServiceFrame({
  data,
  children,
  className = "",
  articleClass = "pt-16",
  wrap = true,
}) {
  return (
    <MG2ASection
      data={data}
      id={sectionId(data)}
      className={data._article ? articleClass : className}
    >
      <div className={wrap && !data._article ? serviceWrap : undefined}>
        {children}
      </div>
    </MG2ASection>
  );
}
export function RichText({ value }) {
  return (
    <PortableText
      value={value || []}
      components={{
        block: { normal: ({ children }) => <p>{children}</p> },
        marks: {
          link: ({ value, children }) => (
            <a
              className="underline underline-offset-4 text-[var(--accent)]"
              href={safeHref(value?.href)}
            >
              {children}
            </a>
          ),
        },
        list: {
          bullet: ({ children }) => (
            <ul className="list-disc pl-6 mb-[18px]">{children}</ul>
          ),
          number: ({ children }) => (
            <ol className="list-decimal pl-6 mb-[18px]">{children}</ol>
          ),
        },
      }}
    />
  );
}
