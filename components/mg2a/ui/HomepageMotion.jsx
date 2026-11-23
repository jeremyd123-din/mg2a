"use client";

import { useEffect } from "react";

export default function HomepageMotion() {
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const targets = [
      ...document.querySelectorAll(
        "#main-content :is([data-home-reveal], [data-home-reveal-group] > *)",
      ),
    ].filter((element) => element.getBoundingClientRect().top >= window.innerHeight);

    const observer = new IntersectionObserver(
      (entries) => {
        let visibleIndex = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const element = entry.target;
          element.style.setProperty(
            "--home-reveal-delay",
            `${140 + Math.min(visibleIndex, 3) * 40}ms`,
          );
          element.dataset.homeRevealState = "revealing";
          observer.unobserve(element);
          visibleIndex++;
        }
      },
      { rootMargin: "0px 0px -64px" },
    );

    for (const element of targets) {
      element.dataset.homeRevealState = "pending";
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      for (const element of targets) {
        delete element.dataset.homeRevealState;
        element.style.removeProperty("--home-reveal-delay");
      }
    };
  }, []);

  return null;
}
