import { mono, Arrow } from "./ServiceUI";
import { safeHref } from "./helpers";
export default function ServiceCard({ item, index }) {
  return (
    <a
      href={safeHref(item.href)}
      className={
        "flex min-h-[260px] flex-col gap-3.5 rounded-md p-7 transition-transform hover:-translate-y-[3px] motion-reduce:transition-none " +
        (item.featured
          ? "bg-[var(--flip)] text-white"
          : "border border-[var(--line)] bg-[var(--panel)]")
      }
    >
      <span
        className={
          mono +
          " text-[11px] " +
          (item.featured ? "text-white/80" : "text-[var(--water)]")
        }
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="text-[22px] leading-[1.2] font-bold">{item.title}</h3>
      <p
        className={
          "flex-1 text-[15px] leading-[1.6] " +
          (item.featured ? "text-white/85" : "text-[var(--muted)]")
        }
      >
        {item.description}
      </p>
      <span
        className={
          "flex items-center gap-2 text-[15px] font-semibold " +
          (item.featured ? "" : "text-[var(--accent)]")
        }
      >
        {item.label || "Learn more"}
        <Arrow />
      </span>
    </a>
  );
}
