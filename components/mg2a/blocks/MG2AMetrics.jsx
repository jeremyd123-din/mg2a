import MG2ASection from "../ui/MG2ASection";
export default function MG2AMetrics({ data }) {
  const items = (data.items || []).filter((item) => item.value && item.label);
  if (!items.length) return null;
  return (
    <MG2ASection
      data={data}
      className="mg-section py-[104px] [&_h2]:m-[16px_0_0] [&_h2]:text-[clamp(32px,_3.6vw,_48px)] [&_h2]:leading-[1.06] [&_h2]:font-bold [&_h2]:tracking-[-0.02em] [&_p]:m-[18px_0_0] [&_p]:text-[17px] [&_p]:leading-[1.6] [&_p]:[color:var(--muted)] [&_.mono]:text-[12px]"
    >
      <div className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)]">
        {data.title && <h2>{data.title}</h2>}
        <dl className="mg-metrics grid [grid-template-columns:repeat(auto-fit,_minmax(180px,_1fr))] gap-[32px] mt-[32px] [&_>_div]:[border-top:1px_solid_var(--line)] [&_>_div]:pt-[16px] [&_dd]:text-[44px] [&_dd]:font-bold [&_dd]:m-[0] [&_dt]:text-[14px] [&_dt]:[color:var(--muted)] [&_dt]:mt-[6px]">
          {items.map((item) => (
            <div key={item._key}>
              <dd>{item.value}</dd>
              <dt>{item.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </MG2ASection>
  );
}
