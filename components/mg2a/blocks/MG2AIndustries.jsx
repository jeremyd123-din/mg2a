import MG2ASection from "../ui/MG2ASection";
import { safeHref } from "../ui/helpers";
export default function MG2AIndustries({ data }) {
  return (
    <MG2ASection
      data={data}
      id="industries"
      className="py-[96px] [background:var(--bg2)] [border-top:1px_solid_var(--line)]"
    >
      <div className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)] flex flex-wrap gap-[48px]">
        <div className="flex-[1_1_320px] max-w-[420px]">
          <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[12px] [color:var(--accent)]">
            {data.eyebrow}
          </div>
          <h2 className="m-[16px_0_0] text-[clamp(30px,_3.2vw,_44px)] leading-[1.08] font-bold tracking-[-0.02em]">
            {data.title}
          </h2>
          <p className="m-[18px_0_0] text-[17px] leading-[1.6] [color:var(--muted)]">
            {data.description}
          </p>
        </div>
        <div className="mg-industries-grid gap-x-[32px] flex-[999_1_560px] min-w-[0] grid [grid-template-columns:repeat(auto-fill,_minmax(240px,_1fr))] [border-top:1px_solid_var(--line)]">
          {(data.industries || []).filter(Boolean).map((item, itemIndex) => (
            <a
              key={item._key || item._id || itemIndex}
              href={safeHref(item.href)}
              className="flex justify-start items-center gap-[10px] min-h-[72px] p-[0_8px_0_0] [border-bottom:1px_solid_var(--line)] text-[18px] font-semibold"
            >
              {item.label}
              <span
                aria-hidden="true"
                className="shrink-0 [color:var(--accent)]"
              >
                {"→"}
              </span>
            </a>
          ))}
        </div>
      </div>
    </MG2ASection>
  );
}
