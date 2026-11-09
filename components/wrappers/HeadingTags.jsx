"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
export default function HeadingTags() {
  const pathname = usePathname();
  const enabled = useSearchParams().get("show_heading_tags") === "true";
  useEffect(() => {
    if (!enabled) return;
    const labelHeadings = () => {
      for (const heading of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
        if (heading.querySelector(":scope > [data-mg2a-heading-tag]")) continue;
        const label = document.createElement("span");
        label.className = "heading-tag";
        label.dataset.mg2aHeadingTag = "true";
        label.setAttribute("aria-hidden", "true");
        label.style.color = "red";
        label.style.webkitTextFillColor = "red";
        label.textContent = `[${heading.tagName}] `;
        heading.prepend(label);
      }
    };
    labelHeadings();
    const observer = new MutationObserver(labelHeadings);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      document
        .querySelectorAll("[data-mg2a-heading-tag]")
        .forEach((label) => label.remove());
    };
  }, [enabled, pathname]);
  return null;
}
