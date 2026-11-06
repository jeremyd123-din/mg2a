import MG2ASection from "../ui/MG2ASection";
import { safeHref } from "../ui/helpers";
export default function MG2ACareers({ data }) {
  return (
    <MG2ASection
      data={data}
      paddingTarget=".mg-two-columns"
      id="careers"
      className="mg-careers [&_.mg-job_.mono]:text-[11px] [&_.mg-job-heading.mono]:text-[11px] [&_h2]:m-[16px_0_0] [&_h2]:text-[clamp(32px,_3.6vw,_50px)] [&_h2]:leading-[1.05] [&_h2]:font-bold [&_h2]:tracking-[-0.02em] [background:var(--navy)] [color:#fff] [&_.mono]:text-[12px] [&_p]:m-[20px_0_0] [&_p]:max-w-[520px] [&_p]:text-[18px] [&_p]:leading-[1.6] [&_p]:[color:#d3dde8] [&_.mg-outline]:[color:#fff] [&_.mg-outline]:[border-color:rgba(255,_255,_255,_0.55)] [&_.mg-job-heading]:text-[11px]"
    >
      <div className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)] mg-two-columns flex flex-wrap gap-[56px] pt-[96px] pb-[96px] [&_>_div]:flex-[1_1_420px]">
        <div>
          <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] mg-dark-accent [color:var(--onDark)]">
            {data.eyebrow}
          </div>
          <h2>{data.title}</h2>
          <p>{data.description}</p>
          <div className="mg-buttons flex flex-wrap gap-[14px] mt-[32px]">
            <a
              className="btn inline-flex items-center gap-[10px] min-h-[48px] p-[0_22px] rounded-[4px] font-semibold text-[15px] [transition:transform_0.2s,_background-color_0.2s] [&:hover]:[transform:translateY(-1px)] motion-reduce:[transition:none] mg-white-button [background:white] [color:#1b4f72]"
              href={safeHref(data.primaryCta?.href)}
            >
              {data.primaryCta?.label}
            </a>
            <a
              className="btn inline-flex items-center gap-[10px] min-h-[48px] p-[0_22px] rounded-[4px] font-semibold text-[15px] [transition:transform_0.2s,_background-color_0.2s] [&:hover]:[transform:translateY(-1px)] motion-reduce:[transition:none] mg-outline [border:1.5px_solid_#f1efea80] [color:#f1efea]"
              href={safeHref(data.secondaryCta?.href)}
            >
              {data.secondaryCta?.label}
            </a>
          </div>
        </div>
        <div>
          <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] mg-job-heading [color:#afc1d6] pb-[14px] [border-bottom:1px_solid_#ffffff2e]">
            {data.jobsTitle}
          </div>
          {data.jobs?.length ? (
            data.jobs.map((job) => (
              <a
                className="mg-job flex items-center justify-between gap-[16px] py-[22px] [border-bottom:1px_solid_#ffffff2e] [&_strong]:text-[19px] [&_strong]:font-semibold [&_.mono]:mt-[6px] [&_.mono]:text-[11px] [&_.mono]:[color:#afc1d6]"
                key={job._key}
                href={safeHref(job.href)}
              >
                <div>
                  <strong>
                    <span
                      className={
                        job.title?.includes("[")
                          ? "ph [border-bottom:1.5px_dashed_currentColor] pb-[1px]"
                          : undefined
                      }
                    >
                      {job.title}
                    </span>
                  </strong>
                  <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase]">
                    {job.location}
                  </div>
                </div>
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M3 8H13M9 4L13 8L9 12" />
                </svg>
              </a>
            ))
          ) : (
            <p>{data.emptyMessage}</p>
          )}
        </div>
      </div>
    </MG2ASection>
  );
}
