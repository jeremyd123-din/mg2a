"use client";

import { useEffect, useRef, useState } from "react";
import { stegaClean } from "next-sanity";
import { mediaUrl, safeHref } from "../ui/helpers";
export default function MG2AHeader({ settings, overlay = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const panel = useRef(null);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 40);
    scroll();
    window.addEventListener("scroll", scroll, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector("a")?.focus();
    const keydown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === "Tab") {
        const nodes = [...panel.current.querySelectorAll("a[href],button")];
        const first = nodes[0],
          last = nodes.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const resize = () => {
      if (window.innerWidth > 980) setOpen(false);
    };
    window.addEventListener("keydown", keydown);
    window.addEventListener("resize", resize);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  const navigation = (
    <>
      {settings.primaryLinks?.map((link) => (
        <a
          key={link._key}
          href={safeHref(link.href)}
          className="navlink [opacity:0.86] [transition:opacity_0.2s] [&:hover]:[opacity:1]"
          onClick={() => setOpen(false)}
        >
          {link.label}
          {["/services", "/industries"].includes(stegaClean(link.href)) && (
            <svg
              aria-hidden="true"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2 3.5L5 6.5L8 3.5" />
            </svg>
          )}
        </a>
      ))}
    </>
  );
  return (
    <>
      <a
        className="mg-skip fixed [left:16px] [top:-100px] z-[100] p-[12px] [background:var(--panel)] [color:var(--ink)] [&:focus]:[top:8px]"
        href="#main-content"
      >
        Skip to content
      </a>
      <div
        className={
          "site-header [transition:background-color_0.3s_ease,_box-shadow_0.3s_ease] [&_.utility]:max-h-[64px] [&_.utility]:overflow-hidden [&_.utility]:[transition:max-height_0.3s_ease,_opacity_0.3s_ease] [&_.nav-row]:[transition:min-height_0.3s_ease] [&.is-scrolled]:[background:rgba(11,_24,_34,_0.95)] [&.is-scrolled]:[box-shadow:0_1px_0_rgba(255,_255,_255,_0.1),_0_8px_28px_rgba(0,_0,_0,_0.28)] [&.is-scrolled]:[-webkit-backdrop-filter:blur(8px)] [&.is-scrolled]:[backdrop-filter:blur(8px)] [&.is-scrolled_.utility]:max-h-[0] [&.is-scrolled_.utility]:[opacity:0] [&.is-scrolled_.utility]:[border-bottom-color:transparent]! [&.is-scrolled_.nav-row]:min-h-[68px]! motion-reduce:[transition:none] motion-reduce:[&_.utility]:[transition:none] motion-reduce:[&_.nav-row]:[transition:none] mg-header fixed [top:0] [left:0] [right:0] z-[40] [color:#f1efea] [--accent:var(--onDark)]" +
          (overlay ? " [background:transparent]" : " [background:#0b1822]") +
          (scrolled ? " is-scrolled" : "")
        }
      >
        <div className="utility [border-bottom:1px_solid_#ffffff1a] hide-sm [@media(max-width:980px)]:hidden!">
          <div className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)] mg-utility-row flex justify-between gap-[8px_24px] items-center min-h-[40px] text-[13px] pt-[8px] pb-[8px] [&_>_.mono]:text-[11px] [&_>_.mono]:[color:#b9c0c5] [&_>_div]:flex [&_>_div]:gap-[8px_24px] [&_>_div]:[color:#d6dadd] flex-wrap [&_>_div]:flex-wrap [&_>_div]:items-center">
            <span className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase]">
              {settings.license}
            </span>
            <div>
              {settings.offices?.filter(Boolean).map((o) => (
                <a
                  key={o._id}
                  href={safeHref("tel:" + o.telephone)}
                  className="navlink [opacity:0.86] [transition:opacity_0.2s] [&:hover]:[opacity:1]"
                >
                  {o.name} {o.phone}
                </a>
              ))}
              {settings.clientAccessLabel && (
                <a
                  href={safeHref(settings.clientAccessUrl)}
                  aria-disabled={!safeHref(settings.clientAccessUrl)}
                  className="navlink [opacity:0.86] [transition:opacity_0.2s] [&:hover]:[opacity:1]"
                >
                  {settings.clientAccessLabel}
                </a>
              )}
              <a
                className="navlink [opacity:0.86] [transition:opacity_0.2s] [&:hover]:[opacity:1] mg-dark-accent [color:var(--onDark)]"
                href={safeHref(settings.careersLink?.href)}
              >
                {settings.careersLink?.label}
              </a>
            </div>
          </div>
        </div>
        <header className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)] nav-row mg-nav-row flex items-center justify-between gap-[24px] min-h-[84px]">
          <a
            href="/"
            aria-label="MG2A home"
            className="mg-brand flex items-center gap-[14px] shrink-[0] [&_img]:block [&_img]:object-contain [&_span]:text-[10px] [&_span]:leading-[1.5] [&_span]:[color:#b9c0c5] [&_span]:[white-space:pre-line]"
          >
            <img
              src={mediaUrl(settings.logo) || "/mg2a/mg2a-logo-approved.svg"}
              alt=""
              width="115"
              height="48"
            />
            <span className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] hide-sm [@media(max-width:980px)]:hidden!">
              {settings.logoCaption ||
                settings.organization?.replace(/\s*&\s*/, "\n& ")}
            </span>
          </a>
          <nav
            className="nav-links [@media(max-width:980px)]:hidden! flex gap-[32px] text-[15px] font-medium [&_.navlink]:flex [&_.navlink]:items-center [&_.navlink]:gap-[6px]"
            aria-label="Primary"
          >
            {navigation}
          </nav>
          <div className="mg-header-actions flex items-center gap-[12px]">
            <a
              className="btn inline-flex items-center gap-[10px] min-h-[48px] p-[0_22px] rounded-[4px] font-semibold text-[15px] [transition:transform_0.2s,_background-color_0.2s] [&:hover]:[transform:translateY(-1px)] motion-reduce:[transition:none] mg-outline [border:1.5px_solid_#f1efea80] [color:#f1efea] hide-sm [@media(max-width:980px)]:hidden!"
              href={safeHref(settings.secondaryCta?.href)}
            >
              {settings.secondaryCta?.label}
            </a>
            <a
              className="btn inline-flex items-center gap-[10px] min-h-[48px] p-[0_22px] rounded-[4px] font-semibold text-[15px] [transition:transform_0.2s,_background-color_0.2s] [&:hover]:[transform:translateY(-1px)] motion-reduce:[transition:none] mg-primary [background:var(--btn)] [color:white]"
              href={safeHref(settings.primaryCta?.href)}
            >
              {settings.primaryCta?.label}
            </a>
            <button
              ref={toggle}
              className="menu-btn hidden [@media(max-width:980px)]:inline-flex! w-[48px] h-[48px] items-center justify-center [background:transparent] [border:1.5px_solid_#f1efea80] rounded-[4px] [color:#f1efea] text-[22px]"
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mg-mobile-nav"
              onClick={() => setOpen(true)}
            >
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M3 6H17M3 10H17M3 14H17" />
              </svg>
            </button>
          </div>
        </header>
      </div>
      {open && (
        <div
          ref={panel}
          id="mg-mobile-nav"
          className="mg-mobile-nav fixed inset-[0] [background:#0b1822] [color:#eef2f4] z-[60] p-[24px] overflow-auto flex flex-col gap-[24px] [&_>_button]:[align-self:flex-end] [&_>_button]:[background:none] [&_>_button]:[border:1px_solid_#ffffff66] [&_>_button]:rounded-[4px] [&_>_button]:[color:white] [&_>_button]:text-[32px] [&_>_button]:w-[48px] [&_nav]:flex [&_nav]:flex-col [&_nav]:gap-[24px] [&_nav]:text-[24px] [&_nav]:font-semibold"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              toggle.current?.focus();
            }}
            aria-label="Close menu"
            className="cursor-pointer disabled:cursor-wait disabled:opacity-70"
          >
            ×
          </button>
          <nav aria-label="Mobile primary">
            {navigation}
            <a
              href={safeHref(settings.secondaryCta?.href)}
              onClick={() => setOpen(false)}
            >
              {settings.secondaryCta?.label}
            </a>
            <a
              href={safeHref(settings.primaryCta?.href)}
              onClick={() => setOpen(false)}
            >
              {settings.primaryCta?.label}
            </a>
            {settings.clientAccessLabel && (
              <a
                href={safeHref(settings.clientAccessUrl)}
                aria-disabled={!safeHref(settings.clientAccessUrl)}
                className="navlink [opacity:0.86] [transition:opacity_0.2s] [&:hover]:[opacity:1]"
              >
                {settings.clientAccessLabel}
              </a>
            )}
          </nav>
          {settings.offices?.filter(Boolean).map((o) => (
            <a
              key={o._id}
              href={safeHref("tel:" + o.telephone)}
              className="navlink [opacity:0.86] [transition:opacity_0.2s] [&:hover]:[opacity:1]"
            >
              {o.name} {o.phone}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
