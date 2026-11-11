import ServiceCard from "../ui/ServiceCard";
import { Fragment } from "react";
import { stegaClean } from "next-sanity";
import {
  ServiceFrame,
  serviceWrap,
  mono,
  serviceHeading,
  RichText,
  ServiceButton,
  Arrow,
} from "../ui/ServiceUI";
import MG2ASection from "../ui/MG2ASection";
import { mediaUrl, safeHref, projectCardPosition } from "../ui/helpers";
import InlineText from "../ui/InlineText";
import InquiryForm from "../ui/InquiryForm";
import icons from "@/lib/mg2a/industryIcons.json";
const num = (i) => String(i + 1).padStart(2, "0");
function Icon({ name }) {
  return icons[stegaClean(name)] ? (
    <span
      className="block [&_svg]:block"
      dangerouslySetInnerHTML={{ __html: icons[stegaClean(name)] }}
    />
  ) : null;
}
function HeroBreadcrumb({
  data,
  parent,
  color = "text-[#9fb0bc]",
  current = "text-[#f1efea]",
}) {
  const ancestor = data.breadcrumbParent || parent;
  return (
    <nav
      aria-label="Breadcrumb"
      className={mono + " flex flex-wrap gap-2.5 text-[11px] " + color}
    >
      <a href="/">Home</a>
      <span aria-hidden="true">/</span>
      {ancestor && (
        <>
          <a href={safeHref(ancestor.href)}>{ancestor.label}</a>
          <span aria-hidden="true">/</span>
        </>
      )}
      <span aria-current="page" className={current}>
        {data.breadcrumb || data.title}
      </span>
    </nav>
  );
}
export function MG2APageHero({ data }) {
  return (
    <ServiceFrame
      data={data}
      className="bg-[#0b1822] text-[#f1efea] pt-14 pb-16"
    >
      <HeroBreadcrumb data={data} />
      <h1 className="mt-9 text-[clamp(40px,5vw,66px)] leading-[1.03] font-bold tracking-[-.025em]">
        {data.title}
      </h1>
      {data.description && (
        <p className="mt-[18px] max-w-[640px] text-[clamp(17px,1.5vw,20px)] leading-[1.55] text-[#cdd2d6]">
          {data.description}
        </p>
      )}
    </ServiceFrame>
  );
}
export function MG2AProjectHero({ data }) {
  const industry = stegaClean(data.variant) === "industry";
  return (
    <MG2ASection
      data={data}
      className={
        "flex flex-col justify-end overflow-hidden " +
        (industry
          ? "bg-[#0b1822] text-[#f1efea]"
          : "min-h-[560px] bg-[#0e2c42] text-white")
      }
    >
      <img
        src={mediaUrl(data.image)}
        alt=""
        aria-hidden="true"
        className={
          "absolute inset-0 h-full w-full object-cover " +
          (industry ? "object-[60%_55%]" : "object-[50%_40%]")
        }
      />
      <div
        aria-hidden="true"
        className={
          industry
            ? "absolute inset-0 bg-[linear-gradient(90deg,rgba(11,24,34,.95),rgba(11,24,34,.80)_45%,rgba(11,24,34,.35))]"
            : "absolute inset-0 bg-[linear-gradient(180deg,rgba(11,24,34,.82)_0%,rgba(11,24,34,.6)_30%,rgba(11,24,34,.72)_60%,rgba(11,24,34,.96)_100%)]"
        }
      />
      <div
        className={
          serviceWrap +
          " relative " +
          (industry ? "pt-14 pb-24" : "pt-12 pb-14")
        }
      >
        <HeroBreadcrumb
          data={data}
          color={industry ? "text-[#b4c2cc]" : "text-[#c2d0da]"}
          current={industry ? "text-[#f1efea]" : "text-white"}
          parent={
            industry
              ? { label: "Industries", href: "/industries" }
              : { label: "Projects", href: "/projects" }
          }
        />
        <div
          className={
            mono +
            " text-[12px] text-[var(--onDark)] " +
            (industry ? "mt-11 flex items-center gap-3.5" : "mt-40")
          }
        >
          {industry && (
            <span className="inline-block h-px w-9 bg-[var(--accentHi)]" />
          )}
          {data.eyebrow}
        </div>
        <h1
          className={
            "font-bold tracking-[-.025em] " +
            (industry
              ? "mt-5 max-w-[760px] text-[clamp(40px,5vw,66px)] leading-[1.03]"
              : "mt-4 max-w-[860px] text-[clamp(40px,5.2vw,72px)] leading-[1.02]")
          }
        >
          {data.title}
        </h1>
        <p
          className={
            "text-[clamp(17px,1.5vw,20px)] leading-[1.55] text-[#d7dee3] " +
            (industry ? "mt-[22px] max-w-[600px]" : "mt-[18px] max-w-[640px]")
          }
        >
          {data.description}
        </p>
        {industry && (
          <>
            <div className="mt-[34px] flex flex-wrap gap-3.5">
              <ServiceButton link={data.buttonOne} />
              <ServiceButton link={data.buttonTwo} secondary />
            </div>
            {data.trustStatement && (
              <div className="mt-14 flex max-w-[700px] items-center gap-3.5 border-t border-white/18 pt-[22px]">
                <svg
                  aria-hidden="true"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 stroke-[var(--accentHi)]"
                >
                  <path d="M4 11L14 5L24 11" />
                  <path d="M5 11H23" />
                  <path d="M8 14V21M12 14V21M16 14V21M20 14V21" />
                  <path d="M4 23.5H24" />
                </svg>
                <p className="text-[15px] leading-[1.5] text-[#d7dee3] [&_strong]:font-semibold [&_strong]:text-white [&_strong]:whitespace-nowrap">
                  <InlineText value={data.trustStatement} />
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </MG2ASection>
  );
}
export function MG2AProjectFacts({ data }) {
  return (
    <ServiceFrame
      data={data}
      className="border-b border-[var(--line)] bg-[var(--bg2)] py-8"
    >
      <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-6">
        {data.items?.map((item) => (
          <div key={item._key}>
            <dt className={mono + " text-[10px] text-[var(--muted)]"}>
              {item.label}
            </dt>
            <dd className="mt-2 text-[16px] leading-[1.4] font-semibold">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </ServiceFrame>
  );
}
export function MG2AProjectStats({ data }) {
  return (
    <ServiceFrame data={data} className="pt-20 pb-6">
      <div className={mono + " text-[12px] text-[var(--accent)]"}>
        {data.title}
      </div>
      <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-6">
        {data.items?.map((item, i) => (
          <div
            key={item._key}
            className={
              "border-t-2 pt-[18px] " +
              (i < 2 ? "border-[var(--accent)]" : "border-[var(--water)]")
            }
          >
            <div className="text-[clamp(48px,5vw,64px)] leading-none font-bold tracking-[-.03em]">
              {item.value}
            </div>
            <div className="mt-2.5 text-[16px] text-[var(--muted)]">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </ServiceFrame>
  );
}
export function MG2AProjectStory({ data }) {
  return (
    <ServiceFrame data={data} className="pt-[72px] pb-[88px]">
      <div className="flex flex-wrap gap-16">
        <div className="min-w-0 max-w-[780px] flex-[999_1_560px]">
          <h2 className={serviceHeading + " mb-[22px]"}>{data.title}</h2>
          <div className="text-[17px] leading-[1.7] [&_p]:mb-[18px] [&_p+p]:text-[var(--muted)]">
            <RichText value={data.body} />
          </div>
          {!!data.scope?.length && (
            <>
              <h3 className="mt-10 mb-[18px] text-[22px] font-bold">
                {data.scopeTitle}
              </h3>
              <ul className="border-t border-[var(--line)]">
                {data.scope.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-4 border-b border-[var(--line)] py-4 text-[16px]"
                  >
                    <span aria-hidden="true" className="text-[var(--accent)]">
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
          {data.permits && (
            <>
              <h3 className="mt-10 mb-3.5 text-[22px] font-bold">
                {data.permitsTitle}
              </h3>
              <p className="text-[16px] leading-[1.8] text-[var(--muted)]">
                {data.permits}
              </p>
            </>
          )}
        </div>
        {(data.services?.length || data.ctaTitle) && (
          <aside className="sticky top-[108px] flex flex-[1_1_300px] flex-col gap-4 self-start">
            {!!data.services?.length && (
              <div className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-[26px]">
                <div className={mono + " text-[11px] text-[var(--accent)]"}>
                  {data.servicesTitle}
                </div>
                <ul className="mt-3.5 flex flex-col gap-1 text-[15px]">
                  {data.services.map((item) => (
                    <li key={item._key}>
                      <a
                        href={safeHref(item.href)}
                        className="flex justify-between border-b border-[var(--line)] py-2"
                      >
                        {item.label}
                        <Arrow />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.ctaTitle && (
              <div className="rounded-md bg-[var(--navy)] p-[26px] text-white">
                <h3 className="text-[20px] leading-[1.25] font-bold">
                  {data.ctaTitle}
                </h3>
                <p className="mt-2.5 text-[15px] leading-[1.55] text-[#d3dde8]">
                  {data.ctaText}
                </p>
                <div className="mt-[18px]">
                  <ServiceButton link={data.ctaLink} banner />
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </ServiceFrame>
  );
}
export function MG2AImageGallery({ data }) {
  return (
    <ServiceFrame data={data} className="pb-24">
      <div className={mono + " mb-5 text-[12px] text-[var(--accent)]"}>
        {data.title}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-5">
        {data.items?.map((item) => (
          <figure key={item._key}>
            <img
              src={mediaUrl(item.image)}
              alt={item.alt || ""}
              className="block h-[380px] w-full rounded-md border border-[var(--line)] object-cover"
              style={{ objectPosition: stegaClean(item.position) || "50% 50%" }}
            />
            <figcaption className="mt-3 text-[14px] text-[var(--muted)]">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </ServiceFrame>
  );
}
export function MG2AProjectGrid({ data }) {
  const projects = (data.projects || []).slice(0, data.limit || 1000);
  return (
    <ServiceFrame
      data={data}
      className={
        "py-[88px] " +
        (data.muted ? "border-t border-[var(--line)] bg-[var(--bg2)]" : "")
      }
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <h2 className={serviceHeading}>{data.title}</h2>
        {data.compact && (
          <a
            href="/projects"
            className="flex items-center gap-2 font-semibold text-[var(--accent)]"
          >
            All projects
            <Arrow />
          </a>
        )}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5">
        {projects.map((project) => (
          <a
            key={project._id}
            href={safeHref(project.href)}
            className="flex flex-col overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)] transition-transform hover:-translate-y-[3px] motion-reduce:transition-none"
          >
            <img
              src={mediaUrl(project.image)}
              alt={project.alt || ""}
              style={{ objectPosition: projectCardPosition(project) }}
              className={
                "block w-full object-cover " +
                (data.compact ? "h-[200px]" : "h-[260px]")
              }
            />
            <div className="p-[22px]">
              <div
                className={
                  mono +
                  " text-[11px] " +
                  (project.cardTone === "water"
                    ? "text-[var(--water)]"
                    : "text-[var(--accent)]")
                }
              >
                {project.eyebrow}
              </div>
              <h3 className="mt-2 text-[19px] font-bold">{project.title}</h3>
              {!data.compact && (
                <p className="mt-3 text-[15px] leading-[1.6] text-[var(--muted)]">
                  {project.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
      {!projects.length && <p>No projects are currently published.</p>}
    </ServiceFrame>
  );
}
export function MG2AIndustryListing({ data }) {
  return (
    <ServiceFrame data={data} className={data.compact ? "pb-24" : "py-24"}>
      <h2
        className={
          data.compact
            ? mono +
              " border-b border-[var(--line)] pb-3.5 text-[11px] font-normal text-[var(--muted)]"
            : serviceHeading + " mb-8"
        }
      >
        {data.title}
      </h2>
      <div
        className={
          data.compact
            ? "grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))]"
            : "grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4"
        }
      >
        {data.industries?.map((item, index) =>
          data.compact ? (
            <a
              key={item._id}
              href={safeHref(item.href)}
              className="flex min-h-16 items-center justify-between gap-3 pr-4 border-b border-[var(--line)] text-[17px] font-semibold"
            >
              {item.label}
              <span aria-hidden="true" className="text-[var(--accent)]">
                →
              </span>
            </a>
          ) : (
            <ServiceCard
              key={item._id}
              index={index}
              item={{
                title: item.label,
                description: item.listing_summary,
                href: item.href,
                label: "View Industry",
              }}
            />
          ),
        )}
      </div>
    </ServiceFrame>
  );
}
export function MG2ACommunityStrip({ data }) {
  return (
    <ServiceFrame
      data={data}
      className="border-b border-[var(--line)] bg-[var(--bg2)] py-10"
    >
      <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3.5">
        <div className={mono + " text-[11px] text-[var(--muted)]"}>
          {data.title}
        </div>
        <p className="flex-[1_1_600px] text-[16px] leading-[1.9] font-semibold">
          {data.description}
        </p>
      </div>
    </ServiceFrame>
  );
}
export function MG2AIndustrySupport({ data }) {
  return (
    <ServiceFrame data={data} className="py-24">
      <div className="max-w-[680px]">
        <div className={mono + " text-[12px] text-[var(--accent)]"}>
          {data.eyebrow}
        </div>
        <h2 className="mt-4 text-[clamp(30px,3.2vw,42px)] leading-[1.08] font-bold tracking-[-.02em]">
          {data.title}
        </h2>
      </div>
      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
        {data.items?.map((item) => (
          <div
            key={item._key}
            className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-7"
          >
            <Icon name={item.icon} />
            <h3 className="mt-[18px] text-[20px] font-bold">{item.title}</h3>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--muted)]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </ServiceFrame>
  );
}
export function MG2AIndustryPrograms({ data }) {
  return (
    <ServiceFrame data={data} className="pb-24">
      <div className={mono + " text-[12px] text-[var(--accent)]"}>
        {data.eyebrow}
      </div>
      <h2 className="mt-4 mb-10 text-[clamp(30px,3.2vw,42px)] leading-[1.08] font-bold tracking-[-.02em]">
        {data.title}
      </h2>
      <article className="flex flex-wrap overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)]">
        <img
          src={mediaUrl(data.image)}
          alt={data.alt || ""}
          className="block h-[380px] min-w-0 flex-[1_1_460px] object-cover"
        />
        <div className="min-w-0 flex-[1_1_420px] p-[clamp(28px,4vw,44px)]">
          <div className={mono + " text-[11px] text-[var(--accent)]"}>
            {data.featureEyebrow}
          </div>
          <h3 className="mt-3 text-[26px] leading-[1.2] font-bold">
            {data.featureTitle}
          </h3>
          <p className="mt-3.5 text-[16px] leading-[1.65] text-[var(--muted)]">
            {data.featureText}
          </p>
          <dl className="mt-[22px] grid grid-cols-[auto_1fr] gap-x-[18px] gap-y-2.5 text-[14px] leading-[1.5]">
            {data.facts?.map((item) => (
              <Fragment key={item._key}>
                <dt
                  className={mono + " pt-[3px] text-[10px] text-[var(--muted)]"}
                >
                  {item.label}
                </dt>
                <dd>{item.value}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      </article>
      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5">
        {data.items?.map((item) => (
          <article
            key={item._key}
            className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-[clamp(28px,4vw,40px)]"
          >
            <Icon name={item.icon} />
            <div
              className={
                mono +
                " mt-[18px] text-[11px] " +
                (stegaClean(item.icon) === "program1"
                  ? "text-[var(--accent)]"
                  : "text-[var(--water)]")
              }
            >
              {item.eyebrow}
            </div>
            <h3 className="mt-2.5 text-[22px] leading-[1.2] font-bold">
              {item.title}
            </h3>
            <p className="mt-3 text-[15px] leading-[1.65] text-[var(--muted)]">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </ServiceFrame>
  );
}
export function MG2ATestimonialProject({ data }) {
  const p = data.project;
  return (
    <ServiceFrame
      data={data}
      className="border-y border-[var(--line)] bg-[var(--bg2)] py-[88px]"
    >
      <div className="flex flex-wrap items-center gap-12">
        <figure className="flex-[1_1_460px]">
          <svg
            aria-hidden="true"
            width="40"
            height="32"
            viewBox="0 0 40 32"
            className="fill-[var(--accent)]"
          >
            <path d="M0 32V18C0 8 6 2 16 0L17 5C11 7 9 11 9 15H16V32ZM23 32V18C23 8 29 2 39 0L40 5C34 7 32 11 32 15H39V32Z" />
          </svg>
          <blockquote className="mt-5 text-[clamp(20px,2vw,26px)] leading-[1.45] font-medium">
            {data.quote}
          </blockquote>
          <figcaption className="mt-[18px] text-[15px] text-[var(--muted)]">
            {data.attribution}
          </figcaption>
        </figure>
        {p && (
          <a
            href={safeHref(p.href)}
            className="flex flex-[1_1_380px] flex-col overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)]"
          >
            <img
              src={mediaUrl(p.image)}
              alt={p.alt || ""}
              className="h-[220px] w-full object-cover"
            />
            <div className="p-6">
              <div className={mono + " text-[11px] text-[var(--accent)]"}>
                {data.eyebrow}
              </div>
              <h3 className="mt-2.5 text-[20px] font-bold">{p.title}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--muted)]">
                {data.description}
              </p>
            </div>
          </a>
        )}
      </div>
    </ServiceFrame>
  );
}
export function MG2ASurveyForm({ data }) {
  return (
    <ServiceFrame data={data} className="pt-16 pb-[104px]">
      <div className="flex flex-wrap items-start gap-12">
        <InquiryForm data={data} appearance="grouped" />
        <aside className="sticky top-[108px] flex flex-[1_1_320px] flex-col gap-4">
          <div className="rounded-md bg-[var(--navy)] p-7 text-white">
            <div className={mono + " text-[11px] text-[#c2d3e2]"}>
              {data.nextTitle}
            </div>
            <ol className="mt-[18px] flex flex-col gap-[18px]">
              {data.nextSteps?.map((step, i) => (
                <li key={i} className="flex gap-3.5 text-[16px] leading-[1.5]">
                  <span
                    className={mono + " pt-[3px] text-[12px] text-[#ffd2be]"}
                  >
                    {num(i)}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-7">
            <div className={mono + " text-[11px] text-[var(--accent)]"}>
              {data.helpTitle}
            </div>
            <ul className="mt-4 flex flex-col gap-2.5 text-[15px] leading-[1.5]">
              {data.helpItems?.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[var(--accent)]">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <a
            href={safeHref(data.clientAccessUrl)}
            aria-disabled={!data.clientAccessUrl}
            className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-6 py-5 font-semibold"
          >
            {data.clientAccessLabel}
          </a>
        </aside>
      </div>
    </ServiceFrame>
  );
}
