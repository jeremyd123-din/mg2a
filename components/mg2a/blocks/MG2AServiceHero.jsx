import { Fragment } from "react";
import { stegaClean } from "next-sanity";
import MG2ASection from "../ui/MG2ASection";
import { mediaUrl, safeHref } from "../ui/helpers";
import { mono, serviceWrap, ServiceButton } from "../ui/ServiceUI";
export default function MG2AServiceHero({ data }) {
  const visual = stegaClean(data.variant) === "image";
  return (
    <MG2ASection
      data={data}
      className="overflow-hidden bg-[#0b1822] text-[#f1efea] py-0"
      paddingTarget=".mg-service-hero-inner"
    >
      <div
        className={
          serviceWrap +
          " mg-service-hero-inner flex flex-wrap gap-12 pt-14 pb-[72px] " +
          (visual ? "items-center" : "items-end")
        }
      >
        <div
          className={
            visual ? "min-w-0 flex-[1_1_480px]" : "min-w-0 flex-[999_1_560px]"
          }
        >
          <nav
            aria-label="Breadcrumb"
            className={
              mono + " flex flex-wrap gap-2.5 text-[11px] text-[#9fb0bc]"
            }
          >
            {data.breadcrumbs?.map((crumb, index) => (
              <Fragment key={crumb._key}>
                {index > 0 && <span aria-hidden="true">/</span>}
                {crumb.href ? (
                  <a
                    href={safeHref(crumb.href)}
                    className="opacity-[.86] hover:opacity-100"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span aria-current="page" className="text-[#f1efea]">
                    {crumb.label}
                  </span>
                )}
              </Fragment>
            ))}
          </nav>
          <div
            className={
              mono +
              " mt-9 flex items-center gap-3.5 text-xs " +
              (visual ? "text-[var(--onDark)]" : "text-[#7fb3da]")
            }
          >
            {visual && (
              <span className="inline-block h-px w-9 bg-[var(--onDark)]" />
            )}
            {data.eyebrow}
          </div>
          <h1
            className={
              visual
                ? "mt-5 text-[clamp(40px,5vw,68px)] leading-[1.02] font-bold tracking-[-.025em]"
                : "mt-4 max-w-[820px] text-[clamp(36px,4.6vw,62px)] leading-[1.04] font-bold tracking-[-.025em]"
            }
          >
            {data.title}
          </h1>
          <p
            className={
              "mt-[22px] text-[clamp(17px,1.5vw,20px)] leading-[1.55] text-[#cdd2d6] " +
              (visual ? "max-w-[560px]" : "max-w-[620px]")
            }
          >
            {data.description}
          </p>
          <div className="mt-[34px] flex flex-wrap gap-3.5">
            <ServiceButton link={data.buttonOne} />
            <ServiceButton link={data.buttonTwo} secondary />
          </div>
        </div>
        {visual && data.image ? (
          <figure className="m-0 min-w-0 flex-[1_1_420px]">
            <div className="h-[400px] overflow-hidden rounded-md border border-white/12 bg-[#0e2c42]">
              <img
                src={mediaUrl(data.image)}
                alt={data.alt || ""}
                className="block h-full w-full object-cover object-[50%_55%]"
              />
            </div>
            <figcaption className={mono + " mt-3 text-[10px] text-[#9fb0bc]"}>
              {data.caption}
            </figcaption>
          </figure>
        ) : (
          !!data.facts?.length && (
            <dl className="m-0 grid flex-[1_1_300px] grid-cols-[auto_1fr] gap-x-5 gap-y-3.5 rounded-md border border-white/12 bg-white/5 px-7 py-[26px] text-[15px]">
              {data.facts.map((fact) => (
                <Fragment key={fact._key}>
                  <dt className={mono + " pt-[3px] text-[10px] text-[#9fb0bc]"}>
                    {fact.label}
                  </dt>
                  <dd className="m-0">{fact.value}</dd>
                </Fragment>
              ))}
            </dl>
          )
        )}
      </div>
    </MG2ASection>
  );
}
