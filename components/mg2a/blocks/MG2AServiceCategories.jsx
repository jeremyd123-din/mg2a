import MG2ASection from "../ui/MG2ASection";
import { mediaUrl, safeHref } from "../ui/helpers";
import ServiceIcon from "../ui/ServiceIcon";
export default function MG2AServiceCategories({ data }) {
  return (
    <MG2ASection
      data={data}
      id="services"
      className="mg-services p-[96px_0_104px]"
    >
      <div className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)]">
        <div className="flex flex-wrap justify-between items-end gap-[24px] mb-[48px]">
          <div className="max-w-[640px]">
            <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[12px] [color:var(--accent)]">
              {data.eyebrow}
            </div>
            <h2 className="m-[16px_0_0] text-[clamp(32px,_3.6vw,_48px)] leading-[1.06] font-bold tracking-[-0.02em]">
              {data.title}
            </h2>
            <p className="m-[18px_0_0] text-[18px] leading-[1.6] [color:var(--muted)]">
              {data.description}
            </p>
          </div>
          <a
            href={safeHref(data.href)}
            className="flex items-center gap-[8px] font-semibold [color:var(--accent)]"
          >
            {data.label}
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M3 8H13M9 4L13 8L9 12"></path>
            </svg>
          </a>
        </div>
        <div className="mg-services-grid grid [grid-template-columns:repeat(auto-fill,_minmax(260px,_1fr))] gap-[16px]">
          {(data.categories || []).filter(Boolean).map((item, itemIndex) => (
            <div
              key={item._key || item._id || itemIndex}
              className="flip [perspective:1400px] [&:hover_.flip-inner]:[transform:rotateY(180deg)] [&:focus-within_.flip-inner]:[transform:rotateY(180deg)] motion-reduce:[&:hover_.flip-inner]:[transform:none] motion-reduce:[&:focus-within_.flip-inner]:[transform:none] motion-reduce:[&:focus-within_.face:first-child]:[visibility:hidden] motion-reduce:[&:focus-within_.back]:[transform:none] h-[320px]"
            >
              <a
                className="flip-inner relative block h-[100%] [transition:transform_0.7s_cubic-bezier(0.2,_0.7,_0.2,_1)] [transform-style:preserve-3d] motion-reduce:[transition:none]"
                href={safeHref(item.href)}
              >
                <div className="face absolute inset-[0] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] flex flex-col justify-between p-[28px] [background:var(--panel)] [border:1px_solid_var(--line)] rounded-[6px]">
                  <div className="flex justify-between items-start">
                    <ServiceIcon name={item.icon} />
                    <span className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[11px] [color:var(--muted)]">
                      {item.eyebrow}
                    </span>
                  </div>
                  <div>
                    <h3 className="m-[0] text-[24px] font-bold tracking-[-0.01em]">
                      {item.title}
                    </h3>
                    <p className="m-[10px_0_0] text-[15px] leading-[1.55] [color:var(--muted)]">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="face absolute inset-[0] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] back [transform:rotateY(180deg)] flex flex-col justify-between p-[28px] [background:var(--flip)] [color:#ffffff] rounded-[6px]">
                  <div>
                    <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[11px] [opacity:0.85]">
                      {item.eyebrow2}
                    </div>
                    <ul className="m-[16px_0_0] p-[0] list-none flex flex-col gap-[8px] text-[15px] font-medium">
                      {(item.entries || [])
                        .filter(Boolean)
                        .map((item, itemIndex) => (
                          <li key={item._key || item._id || itemIndex}>
                            {item.text}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <span className="flex items-center gap-[8px] font-semibold text-[15px]">
                    {item.text}
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path d="M3 8H13M9 4L13 8L9 12"></path>
                    </svg>
                  </span>
                </div>
              </a>
            </div>
          ))}
          <a
            href={safeHref(data.href2)}
            className="h-[320px] flex flex-col justify-between p-[28px] [background:var(--btn)] [color:#ffffff] rounded-[6px]"
          >
            <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[11px] [color:rgba(255,_255,_255,_0.88)]">
              {data.eyebrow2}
            </div>
            <div>
              <h3 className="m-[0] text-[24px] leading-[1.2] font-bold tracking-[-0.01em]">
                {data.title2}
              </h3>
              <span className="flex items-center gap-[8px] mt-[20px] font-semibold text-[15px]">
                {data.text}
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M3 8H13M9 4L13 8L9 12"></path>
                </svg>
              </span>
            </div>
          </a>
        </div>
      </div>
    </MG2ASection>
  );
}
