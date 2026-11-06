import OfficeDetails from "../ui/OfficeDetails";
import { mediaUrl, safeHref } from "../ui/helpers";
export default function MG2AFooter({ settings }) {
  return (
    <footer className="mg-footer [&_.mg-footer-bottom_.mono]:[color:#8e979d] [background:#0b1822] [color:#d6dadd] [--accent:var(--onDark)] [&_nav]:flex [&_nav]:flex-col [&_nav]:gap-[10px] [&_.mono]:text-[11px] [&_.mono]:[color:var(--onDark)] [&_nav_.mono]:mb-[6px] [&_address]:m-[0] [&_address]:text-[14px] [&_address_a]:font-[400]">
      <div className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)] mg-footer-grid grid [grid-template-columns:repeat(auto-fit,_minmax(180px,_1fr))] gap-[40px] pt-[72px] pb-[48px] text-[14px] [&_>_div:first-child_p]:mt-[18px] [&_>_div:first-child_p]:leading-[1.6] [&_>_div:first-child_p]:[color:#a9b0b5] [&_>_div:first-child_p]:max-w-[290px]">
        <div>
          <a href="/" aria-label="MG2A home">
            <img
              src={mediaUrl(settings.logo) || "/mg2a/mg2a-logo-approved.svg"}
              width="134"
              height="56"
              alt="MG2A"
            />
          </a>
          <p>{settings.description}</p>
        </div>
        <nav aria-label="Footer services">
          <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase]">
            {settings.footerServicesTitle}
          </div>
          {settings.serviceLinks?.map((link) => (
            <a key={link._key} href={safeHref(link.href)}>
              {link.label}
            </a>
          ))}
        </nav>
        <nav aria-label="Footer company">
          <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase]">
            {settings.footerCompanyTitle}
          </div>
          {settings.companyLinks?.map((link) => (
            <a key={link._key} href={safeHref(link.href)}>
              {link.label}
            </a>
          ))}
          {settings.clientAccessLabel && (
            <a
              href={safeHref(settings.clientAccessUrl)}
              aria-disabled={!safeHref(settings.clientAccessUrl)}
            >
              {settings.clientAccessLabel}
            </a>
          )}
        </nav>
        <div className="mg-footer-offices flex flex-col gap-[18px] [&_.mg-accent]:hidden leading-[1.6]">
          <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase]">
            {settings.footerOfficesTitle}
          </div>
          {settings.offices?.filter(Boolean).map((o) => (
            <OfficeDetails key={o._id} office={o} />
          ))}
        </div>
      </div>
      <div className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)] mg-footer-bottom flex flex-wrap justify-between gap-[12px] pt-[24px] pb-[32px] [border-top:1px_solid_#ffffff1a] text-[13px] [color:#8e979d] [&_.mono]:[color:#8e979d]">
        <span>
          © {new Date().getFullYear()} {settings.organization}
        </span>
        <span className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase]">
          {settings.footerLicense || "Licensed · Illinois · Indiana"}
        </span>
      </div>
    </footer>
  );
}
