"use client";
import { useEffect, useRef, useState } from "react";
import { stegaClean } from "next-sanity";
import { mediaUrl, safeHref } from "../ui/helpers";
const hasSubmenu = (item) =>
  ["/services", "/industries"].includes(stegaClean(item.href)) &&
  item.groups?.length > 0;
const menuId = (item) =>
  "mg-menu-" + String(item._key || item.href).replace(/[^a-zA-Z0-9_-]/g, "-");
function Chevron() {
  return (
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
  );
}
function currentRoute(pathname, href) {
  const path = stegaClean(href)?.replace(/\/$/, "");
  if (!path?.startsWith("/") || path.includes("#") || path.includes("?"))
    return undefined;
  if (pathname.replace(/\/$/, "") === path) return "page";
  return pathname.startsWith(path + "/") ? "location" : undefined;
}
function MenuLinks({ item, mobile = false, onNavigate, pathname }) {
  const industries = stegaClean(item.href) === "/industries";
  return (
    <>
      <div
        className={
          "flex flex-wrap items-center justify-between gap-4 border-b border-white/10 " +
          (mobile ? "pb-5" : "pb-6")
        }
      >
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[.14em] text-[var(--onDark)]">
            {industries ? "Who we work with" : "Our expertise"}
          </p>
          <h2
            className={
              "mt-2 font-semibold tracking-tight " +
              (mobile ? "text-xl" : "text-2xl")
            }
          >
            {item.label}
          </h2>
        </div>
        <a
          aria-current={currentRoute(pathname, item.href)}
          href={safeHref(item.href)}
          onClick={onNavigate}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--onDark)]"
        >
          {industries ? "All industries" : "All services"}{" "}
          <span aria-hidden="true">→</span>
        </a>
      </div>
      {industries ? (
        <div
          className={
            "mt-6 grid gap-x-8 " + (mobile ? "grid-cols-1" : "grid-cols-3")
          }
        >
          {item.groups
            .flatMap((group) => group.links || [])
            .map((link) => (
              <a
                key={link._key + link.href}
                aria-current={currentRoute(pathname, link.href)}
                href={safeHref(link.href)}
                onClick={onNavigate}
                className="flex min-h-14 items-center gap-3 border-b border-white/10 py-3 text-[15px] font-medium hover:text-[var(--onDark)]"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-[var(--onDark)]"
                >
                  →
                </span>
              </a>
            ))}
        </div>
      ) : (
        <div
          className={
            "mt-6 grid gap-x-9 gap-y-7 " +
            (mobile ? "grid-cols-1" : "grid-cols-4")
          }
        >
          {item.groups.map((group) => (
            <div key={group._key}>
              <a
                aria-current={currentRoute(pathname, group.href)}
                href={safeHref(group.href)}
                onClick={onNavigate}
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--onDark)] hover:text-white"
              >
                {group.label}
                <span aria-hidden="true">→</span>
              </a>
              {!!group.links?.length && (
                <ul className="mt-3 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link._key}>
                      <a
                        aria-current={currentRoute(pathname, link.href)}
                        href={safeHref(link.href)}
                        onClick={onNavigate}
                        className="block text-sm leading-relaxed text-[#bac8d1] hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
export default function MG2AHeader({
  settings,
  overlay = false,
  pathname = "/",
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const toggle = useRef(null),
    mobilePanel = useRef(null),
    desktopPanel = useRef(null),
    triggers = useRef({}),
    focusMenu = useRef(false);
  const items = settings.primaryLinks || [];
  const active = items.find(
    (item) => item._key === activeKey && hasSubmenu(item),
  );
  function closeMenu(restore = false) {
    setActiveKey(null);
    if (restore && activeKey) triggers.current[activeKey]?.focus();
  }
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 40);
    const resize = () => {
      if (window.innerWidth > 980) setOpen(false);
      else setActiveKey(null);
    };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
    };
  }, []);
  useEffect(() => {
    if (active && focusMenu.current) {
      desktopPanel.current?.querySelector("a[href]")?.focus();
      focusMenu.current = false;
    }
  }, [active]);
  useEffect(() => {
    if (!active) return;
    const key = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [activeKey]);
  useEffect(() => {
    if (!open) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobilePanel.current?.querySelector("button")?.focus();
    const key = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === "Tab") {
        const nodes = [
          ...mobilePanel.current.querySelectorAll("button,a[href],summary"),
        ].filter((node) => node.getClientRects().length);
        const first = nodes[0],
          last = nodes.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = before;
      window.removeEventListener("keydown", key);
    };
  }, [open]);
  const finish = () => {
    setOpen(false);
    setActiveKey(null);
  };
  return (
    <>
      <a
        className="fixed left-4 -top-24 z-[100] bg-[var(--panel)] p-3 text-[var(--ink)] focus:top-2"
        href="#main-content"
      >
        Skip to content
      </a>
      {active && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => closeMenu()}
          className="fixed inset-0 z-30 bg-black/30"
        />
      )}
      <div
        className={
          "mg-header fixed inset-x-0 top-0 z-40 text-[#f1efea] transition-[background-color,box-shadow] duration-300 motion-reduce:transition-none " +
          (!overlay
            ? "bg-[#0b1822]/97 shadow-[0_1px_0_rgba(255,255,255,.1),0_8px_24px_rgba(0,0,0,.2)]"
            : scrolled || active
              ? "bg-[#0b1822]/95 shadow-[0_1px_0_rgba(255,255,255,.1),0_8px_28px_rgba(0,0,0,.28)] backdrop-blur-[8px]"
              : "bg-transparent")
        }
      >
        <div
          className={
            "overflow-hidden border-b border-white/10 transition-[max-height,opacity] duration-300 motion-reduce:transition-none [@media(max-width:980px)]:hidden " +
            (scrolled ? "max-h-0 border-b-0 opacity-0" : "max-h-16")
          }
        >
          <div className="mx-auto flex min-h-10 max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-[clamp(16px,4vw,56px)] py-2 text-[13px]">
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[.14em] text-[#b9c0c5]">
              {settings.license}
            </span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#d6dadd]">
              {settings.offices?.filter(Boolean).map((office) => (
                <a
                  key={office._key || office._id}
                  href={safeHref("tel:" + office.telephone)}
                  className="opacity-85 hover:opacity-100"
                >
                  {office.name} {office.phone}
                </a>
              ))}
              {settings.clientAccessLabel && (
                <a
                  href={safeHref(settings.clientAccessUrl)}
                  aria-disabled={!safeHref(settings.clientAccessUrl)}
                  className="opacity-85"
                >
                  {settings.clientAccessLabel}
                </a>
              )}
              <a
                className="text-[var(--onDark)]"
                href={safeHref(settings.careersLink?.href)}
              >
                {settings.careersLink?.label}
              </a>
            </div>
          </div>
        </div>
        <header
          className={
            "mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-[clamp(16px,4vw,56px)] transition-[min-height] duration-300 motion-reduce:transition-none " +
            (scrolled ? "min-h-[68px]" : "min-h-[84px]")
          }
        >
          <a
            href="/"
            aria-label="MG2A home"
            className="flex shrink-0 items-center gap-3.5"
          >
            <img
              src={mediaUrl(settings.logo) || "/mg2a/mg2a-logo-approved.svg"}
              alt=""
              width="115"
              height="48"
              className="block h-12 w-[115px] object-contain"
            />
            <span className="hidden whitespace-pre-line font-[family-name:var(--font-mono)] text-[10px] uppercase leading-normal tracking-[.14em] text-[#b9c0c5] min-[1200px]:block">
              {settings.logoCaption ||
                settings.organization?.replace(/\s*&\s*/, "\n& ")}
            </span>
          </a>
          <nav
            aria-label="Primary"
            className="mg-primary-nav flex items-center gap-8 text-[15px] font-medium [@media(max-width:980px)]:hidden"
          >
            {items.map((item) =>
              hasSubmenu(item) ? (
                <button
                  ref={(node) => {
                    triggers.current[item._key] = node;
                  }}
                  key={item._key}
                  type="button"
                  aria-current={currentRoute(pathname, item.href)}
                  aria-expanded={activeKey === item._key}
                  aria-controls={menuId(item)}
                  className={
                    "inline-flex items-center gap-1.5 whitespace-nowrap py-7 opacity-[.86] transition-opacity hover:opacity-100 hover:text-[var(--onDark)] " +
                    (activeKey === item._key ? "text-[var(--onDark)]" : "")
                  }
                  onClick={() =>
                    setActiveKey(activeKey === item._key ? null : item._key)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      focusMenu.current = true;
                      setActiveKey(item._key);
                    } else if (
                      event.key === "Tab" &&
                      !event.shiftKey &&
                      activeKey === item._key
                    ) {
                      event.preventDefault();
                      desktopPanel.current?.querySelector("a[href]")?.focus();
                    }
                  }}
                >
                  {item.label}
                  <Chevron />
                </button>
              ) : (
                <a
                  key={item._key}
                  href={safeHref(item.href)}
                  aria-current={currentRoute(pathname, item.href)}
                  className="whitespace-nowrap opacity-[.86] transition-opacity hover:opacity-100 hover:text-[var(--onDark)]"
                  onClick={finish}
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <a
              className="hidden min-h-12 items-center rounded border-[1.5px] border-white/50 px-[22px] text-[15px] font-semibold min-[981px]:inline-flex"
              aria-current={currentRoute(pathname, settings.secondaryCta?.href)}
              href={safeHref(settings.secondaryCta?.href)}
            >
              {settings.secondaryCta?.label}
            </a>
            <a
              className="inline-flex min-h-12 items-center rounded bg-[var(--btn)] px-[22px] text-[15px] font-semibold text-white [@media(max-width:420px)]:px-3 [@media(max-width:420px)]:text-[13px]"
              href={safeHref(settings.primaryCta?.href)}
            >
              {settings.primaryCta?.label}
            </a>
            <button
              ref={toggle}
              type="button"
              className="hidden h-12 w-12 items-center justify-center rounded border-[1.5px] border-white/50 [@media(max-width:980px)]:inline-flex"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mg-mobile-nav"
              onClick={() => {
                setActiveKey(null);
                setOpen(true);
              }}
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
        {active && (
          <nav
            ref={desktopPanel}
            id={menuId(active)}
            aria-label={`${stegaClean(active.label)} submenu`}
            className="mg-submenu absolute inset-x-0 top-full max-h-[calc(100dvh-125px)] overflow-y-auto border-y border-white/10 bg-[#0f202c] shadow-2xl [@media(max-width:980px)]:hidden"
          >
            <div className="mx-auto max-w-[1280px] px-[clamp(16px,4vw,56px)] py-8">
              <MenuLinks
                pathname={pathname}
                item={active}
                onNavigate={finish}
              />
            </div>
          </nav>
        )}
      </div>
      {open && (
        <div
          ref={mobilePanel}
          id="mg-mobile-nav"
          className="fixed inset-0 z-60 overflow-y-auto bg-[#0b1822] p-6 text-[#eef2f4]"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="flex justify-end">
            <button
              className="h-12 w-12 rounded border border-white/40 text-3xl"
              type="button"
              aria-label="Close menu"
              onClick={() => {
                setOpen(false);
                toggle.current?.focus();
              }}
            >
              ×
            </button>
          </div>
          <nav aria-label="Mobile primary" className="mg-primary-nav mt-6">
            {items.map((item) =>
              hasSubmenu(item) ? (
                <details key={item._key} className="border-b border-white/10">
                  <summary
                    aria-current={currentRoute(pathname, item.href)}
                    className="flex min-h-16 cursor-pointer list-none items-center justify-between text-xl font-semibold [&::-webkit-details-marker]:hidden"
                  >
                    {item.label}
                    <Chevron />
                  </summary>
                  <div className="pb-7">
                    <MenuLinks
                      pathname={pathname}
                      item={item}
                      mobile
                      onNavigate={finish}
                    />
                  </div>
                </details>
              ) : (
                <a
                  key={item._key}
                  href={safeHref(item.href)}
                  aria-current={currentRoute(pathname, item.href)}
                  className="flex min-h-16 items-center border-b border-white/10 text-xl font-semibold"
                  onClick={finish}
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="rounded border border-white/50 px-5 py-3 font-semibold"
              aria-current={currentRoute(pathname, settings.secondaryCta?.href)}
              href={safeHref(settings.secondaryCta?.href)}
              onClick={finish}
            >
              {settings.secondaryCta?.label}
            </a>
            <a
              className="rounded bg-[var(--btn)] px-5 py-3 font-semibold text-white"
              href={safeHref(settings.primaryCta?.href)}
              onClick={finish}
            >
              {settings.primaryCta?.label}
            </a>
          </div>
          <div className="mt-8 space-y-4 text-sm text-[#bac8d1]">
            {settings.offices?.filter(Boolean).map((office) => (
              <a
                key={office._key || office._id}
                className="block"
                href={safeHref("tel:" + office.telephone)}
              >
                {office.name} {office.phone}
              </a>
            ))}
            {settings.clientAccessLabel && (
              <a
                className="block"
                href={safeHref(settings.clientAccessUrl)}
                aria-disabled={!safeHref(settings.clientAccessUrl)}
              >
                {settings.clientAccessLabel}
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
