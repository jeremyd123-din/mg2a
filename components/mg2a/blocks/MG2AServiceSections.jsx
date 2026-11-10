import ServiceCard from "../ui/ServiceCard";
import { stegaClean } from "next-sanity";
import {
  mono,
  headingFor,
  ServiceFrame,
  RichText,
  Arrow,
  ServiceButton,
} from "../ui/ServiceUI";
import { mediaUrl, safeHref } from "../ui/helpers";
const number = (index) => String(index + 1).padStart(2, "0");
export function MG2AProjectStage({ data }) {
  return (
    <ServiceFrame
      data={data}
      className="bg-[var(--bg2)] border-b border-[var(--line)] py-10"
    >
      <div className={mono + " mb-[18px] text-[11px] text-[var(--muted)]"}>
        {data.title}
      </div>
      <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-0 p-0">
        {data.stages?.map((stage, index) => {
          const active = index + 1 === data.activeStage;
          return (
            <li
              key={stage._key}
              className={
                "pr-4 pt-4 pb-1 " +
                (active
                  ? "border-t-[3px] border-[var(--accent)]"
                  : "border-t-2 border-[var(--line)] text-[var(--muted)]")
              }
            >
              <div
                className={
                  mono +
                  " text-[10px] " +
                  (active ? "text-[var(--accent)]" : "")
                }
              >
                {number(index)}
                {active && ` · ${data.activeLabel}`}
              </div>
              <div
                className={
                  "mt-1.5 text-base " + (active ? "font-bold" : "font-semibold")
                }
              >
                {stage.title}
              </div>
            </li>
          );
        })}
      </ol>
    </ServiceFrame>
  );
}
export function MG2APracticeOverview({ data }) {
  const audience = !!data.audiences?.length;
  return (
    <ServiceFrame data={data} className="pt-24 pb-[72px]" articleClass="pt-16">
      <div className="flex flex-wrap gap-14">
        <div
          className={
            "min-w-0 flex-[999_1_560px] " + (audience ? "max-w-[760px]" : "")
          }
        >
          {data.eyebrow && (
            <div className={mono + " text-xs text-[var(--accent)]"}>
              {data.eyebrow}
            </div>
          )}
          {data.title && (
            <h2
              className={
                data._article
                  ? headingFor(data) + " mb-[22px]"
                  : "mt-4 mb-7 text-[clamp(30px,3.2vw,42px)] leading-[1.1] font-bold tracking-[-.02em]"
              }
            >
              {data.title}
            </h2>
          )}
          <div className="text-[17px] leading-[1.7] [&_p]:mb-[18px] [&_p+p]:text-[var(--muted)]">
            <RichText value={data.body} />
          </div>
        </div>
        {audience && (
          <aside className="flex-[1_1_300px] self-start rounded-md border border-[var(--line)] bg-[var(--panel)] p-7">
            <div className={mono + " text-[11px] text-[var(--accent)]"}>
              {data.audienceTitle}
            </div>
            <ul className="mt-4 flex list-none flex-col gap-3.5 p-0 text-base">
              {data.audiences.map((audience, index) => (
                <li key={index} className="flex gap-3">
                  <span aria-hidden="true" className="text-[var(--water)]">
                    →
                  </span>
                  {audience}
                </li>
              ))}
            </ul>
            {data.audienceLink?.label && (
              <a
                href={safeHref(data.audienceLink.href)}
                className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--accent)]"
              >
                {data.audienceLink.label}
                <Arrow />
              </a>
            )}
          </aside>
        )}
      </div>
    </ServiceFrame>
  );
}
export function MG2AServiceCards({ data }) {
  return (
    <ServiceFrame data={data} className="pt-6 pb-24">
      <h2 className={headingFor(data) + " mb-8"}>{data.title}</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
        {data.items?.map((item, index) => (
          <ServiceCard key={item._key || index} item={item} index={index} />
        ))}
      </div>
      {!!data.pairedLinks?.length && (
        <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-[var(--line)] pt-6">
          <span className={mono + " text-[11px] text-[var(--muted)]"}>
            {data.pairedTitle}
          </span>
          {data.pairedLinks.map((link) => (
            <a
              key={link._key}
              href={safeHref(link.href)}
              className="border-b border-[var(--line)] text-[15px] font-semibold"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </ServiceFrame>
  );
}
export function MG2AProcessSteps({ data }) {
  const columns = stegaClean(data.layout) !== "list";
  return (
    <ServiceFrame
      data={data}
      className={
        columns
          ? "border-y border-[var(--line)] bg-[var(--bg2)] py-[88px]"
          : "py-24"
      }
    >
      {data.eyebrow && (
        <div className={mono + " text-xs text-[var(--accent)]"}>
          {data.eyebrow}
        </div>
      )}
      <h2
        className={headingFor(data) + (columns ? " mt-4 mb-11" : " mb-[22px]")}
      >
        {data.title}
      </h2>
      <ol
        className={
          columns
            ? "m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-8 p-0"
            : "m-0 flex list-none flex-col p-0"
        }
      >
        {data.steps?.map((step, index) => (
          <li
            key={step._key}
            className={
              columns
                ? "border-t-2 border-[var(--accent)] pt-[22px]"
                : "flex gap-6 border-t border-[var(--line)] py-[22px] last:border-b"
            }
          >
            <span
              className={
                mono +
                " text-[var(--accent)] " +
                (columns ? "text-xs" : "w-10 shrink-0 pt-[3px] text-[13px]")
              }
            >
              {number(index)}
            </span>
            <div>
              <h3
                className={
                  columns ? "mt-2.5 text-xl font-bold" : "text-lg font-bold"
                }
              >
                {step.title}
              </h3>
              <p
                className={
                  "text-[15px] text-[var(--muted)] " +
                  (columns ? "mt-2.5 leading-[1.65]" : "mt-1.5 leading-[1.6]")
                }
              >
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </ServiceFrame>
  );
}
export function MG2ARelatedProjects({ data }) {
  return (
    <ServiceFrame data={data} className="py-24">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <h2 className={headingFor(data)}>{data.title}</h2>
        {data.allProjectsLink?.label && (
          <a
            href={safeHref(data.allProjectsLink.href)}
            className="flex items-center gap-2 font-semibold text-[var(--accent)]"
          >
            {data.allProjectsLink.label}
            <Arrow />
          </a>
        )}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5">
        {data.items?.map((item) => {
          const project = item.project;
          if (!project) return null;
          return (
            <a
              key={item._key}
              href={safeHref(project.href)}
              className="flex flex-col overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)] transition-transform hover:-translate-y-[3px] motion-reduce:transition-none"
            >
              <img
                src={mediaUrl(project.image)}
                alt={project.alt || ""}
                className="block h-[260px] w-full object-cover"
                style={{
                  objectPosition: stegaClean(item.imagePosition) || "50% 50%",
                }}
              />
              <div className="p-[26px]">
                <div className={mono + " text-[11px] text-[var(--accent)]"}>
                  {project.eyebrow}
                </div>
                <h3 className="mt-2.5 text-[22px] font-bold">
                  {project.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-[var(--muted)]">
                  {item.description || project.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </ServiceFrame>
  );
}
export function MG2AFaq({ data }) {
  const split = stegaClean(data.layout) === "split";
  return (
    <ServiceFrame
      data={data}
      className={
        split
          ? data.background === "page"
            ? "py-[88px]"
            : "border-t border-[var(--line)] bg-[var(--bg2)] py-[88px]"
          : "py-24"
      }
    >
      <div className={split ? "flex flex-wrap gap-12" : ""}>
        <div className={split ? "max-w-[380px] flex-[1_1_300px]" : ""}>
          {data.eyebrow && (
            <div className={mono + " text-xs text-[var(--accent)]"}>
              {data.eyebrow}
            </div>
          )}
          <h2 className={headingFor(data) + (split ? " mt-4" : " mb-3")}>
            {data.title}
          </h2>
          {data.description && (
            <p className="mt-4 text-base leading-[1.6] text-[var(--muted)]">
              {data.description}
            </p>
          )}
        </div>
        <div
          className={
            split
              ? "min-w-0 flex-[999_1_560px] border-t border-[var(--line)]"
              : ""
          }
        >
          {data.items?.map((item) => (
            <details
              key={item._key}
              className="group border-b border-[var(--line)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-[22px] text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="text-2xl text-[var(--accent)] transition-transform group-open:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <p className="mb-[22px] text-base leading-[1.65] text-[var(--muted)]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </ServiceFrame>
  );
}
export function MG2ACtaBanner({ data }) {
  return (
    <ServiceFrame data={data} className="bg-[var(--navy)] py-[72px] text-white">
      <div className="flex flex-wrap items-center justify-between gap-8">
        <div className="max-w-[640px]">
          <h2 className="text-[clamp(28px,3.2vw,42px)] leading-[1.1] font-bold tracking-[-.02em]">
            {data.title}
          </h2>
          <p className="mt-3.5 text-lg leading-[1.55] text-[#d3dde8]">
            {data.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3.5">
          <ServiceButton link={data.buttonOne} banner />
          <ServiceButton link={data.buttonTwo} secondary banner />
        </div>
      </div>
    </ServiceFrame>
  );
}
export function MG2AChecklist({ data }) {
  return (
    <ServiceFrame data={data} className="py-24">
      <h2 className={headingFor(data) + " mb-[22px]"}>{data.title}</h2>
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-3 p-0">
        {data.items?.map((item, index) => (
          <li
            key={index}
            className="flex gap-3.5 rounded-md border border-[var(--line)] bg-[var(--panel)] px-5 py-[18px] text-base leading-[1.5]"
          >
            <span aria-hidden="true" className="font-bold text-[var(--water)]">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
    </ServiceFrame>
  );
}
export function MG2ADeliverables({ data }) {
  return (
    <ServiceFrame data={data} className="py-24">
      <h2 className={headingFor(data) + " mb-[22px]"}>{data.title}</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-px overflow-hidden rounded-md border border-[var(--line)] bg-[var(--line)]">
        {data.items?.map((item, index) => (
          <div key={item._key} className="bg-[var(--bg)] p-6">
            <div className={mono + " text-[10px] text-[var(--water)]"}>
              {number(index)}
            </div>
            <h3 className="mt-2 text-[17px] font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-[1.6] text-[var(--muted)]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </ServiceFrame>
  );
}
export function MG2ARelatedServices({ data }) {
  return (
    <ServiceFrame data={data} className="py-24">
      <h2
        className={mono + " mb-4 text-[11px] font-normal text-[var(--muted)]"}
      >
        {data.title}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3">
        {data.items?.map((item) => (
          <a
            key={item._key}
            href={safeHref(item.href)}
            className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-5 transition-transform hover:-translate-y-[3px] motion-reduce:transition-none"
          >
            <div className={mono + " text-[10px] text-[var(--water)]"}>
              {item.eyebrow}
            </div>
            <h3 className="mt-2 text-base font-bold">{item.title}</h3>
          </a>
        ))}
      </div>
    </ServiceFrame>
  );
}
