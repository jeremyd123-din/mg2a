import { ServiceFrame, mono, articleHeading } from "../ui/ServiceUI";
import InquiryForm from "../ui/InquiryForm";
import { safeHref } from "../ui/helpers";
export default function MG2AScopeForm({ data }) {
  return (
    <ServiceFrame data={data} className="pt-[72px] pb-24">
      <div className="flex flex-wrap gap-12 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-[clamp(28px,4vw,48px)]">
        <div className="max-w-[420px] flex-[1_1_320px]">
          <div className={mono + " text-xs text-[var(--accent)]"}>
            {data.eyebrow}
          </div>
          <h2 className={articleHeading + " mt-3.5"}>{data.title}</h2>
          <p className="mt-3.5 text-base leading-[1.6] text-[var(--muted)]">
            {data.description}
          </p>
          {data.phone?.label && (
            <a
              href={safeHref(data.phone.href)}
              className="mt-6 inline-block text-xl font-bold"
            >
              {data.phone.label}
            </a>
          )}
        </div>
        <InquiryForm data={data} appearance="plain" />
      </div>
    </ServiceFrame>
  );
}
