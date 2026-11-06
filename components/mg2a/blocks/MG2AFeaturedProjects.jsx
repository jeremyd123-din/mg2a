import MG2ASection from "../ui/MG2ASection";
import { mediaUrl, safeHref } from "../ui/helpers";
export default function MG2AFeaturedProjects({ data }) {
  return (
    <MG2ASection data={data} id="projects" className="py-[104px]">
      <div className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)]">
        <div className="flex flex-wrap justify-between items-end gap-[24px] mb-[48px]">
          <div className="max-w-[640px]">
            <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[12px] [color:var(--accent)]">
              {data.eyebrow}
            </div>
            <h2 className="m-[16px_0_0] text-[clamp(32px,_3.6vw,_48px)] leading-[1.06] font-bold tracking-[-0.02em]">
              {data.title}
            </h2>
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
        <a
          href={safeHref(data.href2)}
          className="proj [&_img]:[transition:transform_0.6s] [&_svg]:[transition:transform_0.6s] [&:hover_.projmedia]:[transform:scale(1.03)] [#projects_&:not(.feat):nth-child(2)_.projmedia]:object-[50%_50%] [#projects_&:not(.feat):nth-child(3)_.projmedia]:object-[50%_70%] [#projects_&:not(.feat):nth-child(2)_>_div:first-child]:[background:#1f2a24] [#projects_&:not(.feat):nth-child(3)_.mono:first-child]:[color:var(--water)] feat [@media(max-width:700px)]:pt-[210px] relative flex flex-col justify-end min-h-[500px] rounded-[6px] overflow-hidden [background:#0f202c] [color:#ffffff]"
        >
          <img
            className="projmedia [transition:transform_0.6s] motion-reduce:[transition:none] feat-img [@media(max-width:700px)]:h-[280px]! [@media(max-width:700px)]:[bottom:auto]! absolute inset-[0] w-[100%] h-[100%] object-cover object-[50%_60%]"
            src={mediaUrl(data.image)}
            alt={data.alt}
            loading="lazy"
          />
          <div
            className="feat-shade [@media(max-width:700px)]:h-[280px]! [@media(max-width:700px)]:[bottom:auto]! absolute inset-[0] [background:linear-gradient(_180deg,_rgba(15,_32,_44,_0)_12%,_rgba(15,_32,_44,_0.72)_46%,_rgba(15,_32,_44,_0.97)_100%_)]"
            aria-hidden="true"
          ></div>
          <div className="relative flex flex-wrap justify-between items-end gap-[28px_48px] p-[clamp(24px,_4vw,_44px)]">
            <div className="flex-[1_1_420px] max-w-[640px]">
              <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[11px] [color:var(--accentHi)]">
                {data.eyebrow2}
              </div>
              <h3 className="m-[14px_0_0] text-[clamp(28px,_3vw,_40px)] leading-[1.1] font-bold tracking-[-0.015em]">
                {data.title2}
              </h3>
              <p className="m-[14px_0_0] text-[17px] leading-[1.55] [color:#d7dee3]">
                {data.description}
              </p>
            </div>
            <div className="flex-[0_1_300px]">
              <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[10px] [color:#b9c6cf]">
                {data.eyebrow3}
              </div>
              <p className="m-[10px_0_0] text-[15px] leading-[1.7] [color:#ffffff]">
                {data.description2}
              </p>
            </div>
          </div>
        </a>
        <div className="grid [grid-template-columns:repeat(auto-fit,_minmax(300px,_1fr))] gap-[20px] mt-[20px]">
          {(data.projects || []).filter(Boolean).map((item, itemIndex) => (
            <a
              key={item._key || item._id || itemIndex}
              href={safeHref(item.href)}
              className="proj [&_img]:[transition:transform_0.6s] [&_svg]:[transition:transform_0.6s] [&:hover_.projmedia]:[transform:scale(1.03)] [#projects_&:not(.feat):nth-child(2)_.projmedia]:object-[50%_50%] [#projects_&:not(.feat):nth-child(3)_.projmedia]:object-[50%_70%] [#projects_&:not(.feat):nth-child(2)_>_div:first-child]:[background:#1f2a24] [#projects_&:not(.feat):nth-child(3)_.mono:first-child]:[color:var(--water)] flex flex-col [background:var(--panel)] [border:1px_solid_var(--line)] rounded-[6px] overflow-hidden"
            >
              <div className="relative h-[240px] overflow-hidden [background:#0e2c42]">
                <img
                  className="projmedia [transition:transform_0.6s] motion-reduce:[transition:none] w-[100%] h-[100%] object-cover block"
                  src={mediaUrl(item.image)}
                  alt={item.alt}
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col flex-[1] p-[26px]">
                <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[11px] [color:var(--accent)]">
                  {item.eyebrow}
                </div>
                <h3 className="m-[10px_0_0] text-[22px] leading-[1.2] font-bold">
                  {item.title}
                </h3>
                <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] mt-[8px] text-[11px] [color:var(--muted)]">
                  {item.eyebrow2}
                </div>
                <p className="m-[14px_0_0] text-[15px] leading-[1.6] [color:var(--muted)]">
                  {item.description}
                </p>
                <ul className="m-[18px_0_0] p-[16px_0_0] list-none [border-top:1px_solid_var(--line)] grid [grid-template-columns:repeat(2,_minmax(0,_1fr))] gap-[10px_16px] text-[14px]">
                  {(item.entries || [])
                    .filter(Boolean)
                    .map((item, itemIndex) => (
                      <li key={item._key || item._id || itemIndex}>
                        {item.text}
                      </li>
                    ))}
                </ul>
              </div>
            </a>
          ))}
        </div>
      </div>
    </MG2ASection>
  );
}
