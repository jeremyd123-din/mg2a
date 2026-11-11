"use client";
import { useEffect, useState } from "react";
import { safeHref } from "./helpers";
import { activeSectionId } from "@/lib/mg2a/scrollSpy";
export default function OnThisPageNav({ title, links }) {
  const [active, setActive] = useState(links[0]?.href?.slice(1) || null);
  useEffect(() => {
    let frame = 0;
    const targets = links
      .map((link) => {
        const id = link.href?.startsWith("#") ? link.href.slice(1) : null;
        return { id, element: id ? document.getElementById(id) : null };
      })
      .filter((item) => item.element);
    function update() {
      frame = 0;
      const header = document.querySelector(".mg-header");
      const offset = (header?.getBoundingClientRect().bottom || 84) + 24;
      const positions = targets.map((item) => ({
        id: item.id,
        top: item.element.getBoundingClientRect().top,
      }));
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      setActive(activeSectionId(positions, offset, atBottom));
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    const observer = new ResizeObserver(schedule);
    targets.forEach((item) => observer.observe(item.element));
    schedule();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, [links]);
  return (
    <nav aria-label={title || "On this page"} className="sticky top-[108px]">
      <div className="mb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[.14em] text-[var(--muted)]">
        {title}
      </div>
      {links.map((link, index) => (
        <a
          key={link.href + index}
          href={safeHref(link.href)}
          aria-current={active === link.href.slice(1) ? "location" : undefined}
          className={
            "block border-l-2 px-[18px] py-[9px] text-[14px] leading-[1.4] hover:opacity-100 " +
            (active === link.href.slice(1)
              ? "border-[var(--accent)] font-semibold text-[var(--ink)]"
              : "border-[var(--line)] text-[var(--muted)]")
          }
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
