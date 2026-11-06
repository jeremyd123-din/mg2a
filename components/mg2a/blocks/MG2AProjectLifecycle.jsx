import MG2ASection from "../ui/MG2ASection";
import { mediaUrl, safeHref } from "../ui/helpers";
export default function MG2AProjectLifecycle({ data }) {
  return (
    <MG2ASection
      data={data}
      aria-label="Project lifecycle"
      className="py-[88px] [background:var(--bg2)] [border-top:1px_solid_var(--line)] [border-bottom:1px_solid_var(--line)]"
    >
      <div className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)]">
        <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[12px] [color:var(--accent)]">
          {data.eyebrow}
        </div>
        <h2 className="m-[16px_0_48px] max-w-[720px] text-[clamp(28px,_3vw,_40px)] leading-[1.1] font-bold tracking-[-0.02em]">
          {data.title}
        </h2>
        <ol className="mg-lifecycle-stages [&_>_li:not(:first-child)]:[border-top-color:var(--line)] [&_>_li:not(:first-child)_>_.mono]:[color:var(--muted)] m-[0] p-[0] list-none grid [grid-template-columns:repeat(auto-fit,_minmax(200px,_1fr))] gap-[0]">
          {(data.stages || []).filter(Boolean).map((item, itemIndex) => (
            <li
              key={item._key || item._id || itemIndex}
              className="p-[24px_24px_8px_0] [border-top:2px_solid_var(--accent)]"
            >
              <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[11px] [color:var(--accent)]">
                {item.eyebrow}
              </div>
              <div className="mt-[10px] text-[19px] font-bold">{item.text}</div>
              <div className="mt-[10px] text-[14px] leading-[1.6] [color:var(--muted)]">
                {item.text2}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </MG2ASection>
  );
}
