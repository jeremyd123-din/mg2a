import { safeHref } from "./helpers";
export default function OfficeDetails({ office }) {
  return (
    <div>
      <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] mg-accent [color:var(--accent)]">
        {office.name}
      </div>
      <address className="mt-[10px] not-italic text-[15px] leading-[1.6] [&_a]:font-semibold">
        {office.street}
        <br />
        {office.city}
        <br />
        <a href={safeHref("tel:" + office.telephone)}>{office.phone}</a>
      </address>
    </div>
  );
}
