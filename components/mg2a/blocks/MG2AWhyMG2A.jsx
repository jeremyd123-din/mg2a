import MG2ASection from "../ui/MG2ASection";
import { mediaUrl, safeHref } from "../ui/helpers";
export default function MG2AWhyMG2A({ data }) {
  return (
    <MG2ASection data={data} id="about" className="py-[104px]">
      <div className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)]">
        <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[12px] [color:var(--accent)]">
          {data.eyebrow}
        </div>
        <div className="flex flex-wrap gap-[48px] mt-[16px]">
          <div className="flex-[1_1_380px]">
            <h2 className="m-[0] text-[clamp(30px,_3.4vw,_46px)] leading-[1.08] font-bold tracking-[-0.02em]">
              {data.title}
            </h2>
            {!!data.metrics?.length && (
              <div className="mg-why-metrics grid [grid-template-columns:repeat(2,_minmax(0,_1fr))] gap-[32px_24px] mt-[48px] [&_>_div]:[border-top:1px_solid_var(--line)] [&_>_div]:pt-[16px]">
                {data.metrics.map((metric) => (
                  <div key={metric._key}>
                    <div className="mg-why-metric-value text-[44px] font-bold tracking-[-0.02em]">
                      <span
                        className={
                          metric.value?.includes("[")
                            ? "ph [border-bottom:1.5px_dashed_currentColor] pb-[1px]"
                            : undefined
                        }
                      >
                        {metric.value}
                      </span>
                    </div>
                    <div className="mg-why-metric-label mt-[6px] text-[14px] [color:var(--muted)]">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex-[1_1_420px] flex flex-col gap-[0]">
            {(data.reasons || []).filter(Boolean).map((item, itemIndex) => (
              <div
                key={item._key || item._id || itemIndex}
                className="flex gap-[20px] py-[24px] [border-bottom:1px_solid_var(--line)]"
              >
                <span className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[12px] [color:var(--accent)] pt-[4px]">
                  {item.eyebrow}
                </span>
                <div>
                  <div className="text-[19px] font-bold">{item.text}</div>
                  <p className="m-[8px_0_0] text-[15px] leading-[1.6] [color:var(--muted)]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
            {data.testimonial?.quote && (
              <figure className="mg-testimonial m-[32px_0_0] p-[28px] [background:var(--panel)] [border:1px_solid_var(--line)] rounded-[6px] [&_blockquote]:m-[0] [&_blockquote]:text-[19px] [&_blockquote]:leading-[1.5] [&_blockquote]:font-medium [&_figcaption]:mt-[16px] [&_figcaption]:text-[14px] [&_figcaption]:[color:var(--muted)]">
                <blockquote>
                  <span
                    className={
                      data.testimonial.quote.includes("[")
                        ? "ph [border-bottom:1.5px_dashed_currentColor] pb-[1px]"
                        : undefined
                    }
                  >
                    {data.testimonial.quote}
                  </span>
                </blockquote>
                <figcaption>
                  <span
                    className={
                      data.testimonial.name?.includes("[")
                        ? "ph [border-bottom:1.5px_dashed_currentColor] pb-[1px]"
                        : undefined
                    }
                  >
                    {data.testimonial.name}
                  </span>
                  ,{" "}
                  <span
                    className={
                      data.testimonial.role?.includes("[")
                        ? "ph [border-bottom:1.5px_dashed_currentColor] pb-[1px]"
                        : undefined
                    }
                  >
                    {data.testimonial.role}
                  </span>
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </MG2ASection>
  );
}
