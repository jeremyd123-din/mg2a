import { stegaClean } from "next-sanity";
import {
  ServiceFrame,
  serviceWrap,
  mono,
  RichText,
  ServiceButton,
  Arrow,
} from "../ui/ServiceUI";
import MG2ASection from "../ui/MG2ASection";
import InquiryForm from "../ui/InquiryForm";
import { mediaUrl, safeHref } from "../ui/helpers";
const heading =
  "text-[clamp(30px,3.4vw,46px)] leading-[1.06] font-bold tracking-[-.02em]";
const label = mono + " text-[12px] text-[var(--accent)]";
function Heading({
  data,
  small = false,
  className = "",
  titleClassName,
  titleGap = "mt-4",
  eyebrowClassName = "",
}) {
  return (
    <div className={className}>
      {data.eyebrow && (
        <div className={label + " " + eyebrowClassName}>{data.eyebrow}</div>
      )}
      {data.title && (
        <h2
          className={
            (data.eyebrow ? titleGap + " " : "") +
            (titleClassName ||
              (small
                ? "text-[clamp(28px,3vw,38px)] leading-[1.1] font-bold tracking-[-.02em]"
                : heading))
          }
        >
          {data.title}
        </h2>
      )}
    </div>
  );
}
function Portrait({ person }) {
  return (
    <div className="flex aspect-[4/5] items-end justify-center overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)]">
      {mediaUrl(person.image) ? (
        <img
          src={mediaUrl(person.image)}
          alt={person.alt || person.title || ""}
          className="h-full w-full object-cover"
        />
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="w-[72%] fill-[var(--line)]"
        >
          <circle cx="50" cy="38" r="20" />
          <path d="M12 100C12 76 28 64 50 64C72 64 88 76 88 100Z" />
        </svg>
      )}
    </div>
  );
}
export function MG2ACompanyHero({ data }) {
  const careers = stegaClean(data.variant) === "careers";
  return (
    <MG2ASection
      data={data}
      className={
        "overflow-hidden " +
        (careers ? "bg-[#1b4f72] text-white" : "bg-[#0b1822] text-[#f1efea]")
      }
    >
      {!careers && mediaUrl(data.image) && (
        <>
          <img
            src={mediaUrl(data.image)}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,24,34,.95),rgba(11,24,34,.78)_50%,rgba(11,24,34,.4))]"
          />
        </>
      )}
      {careers && (
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 640"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
        >
          <g
            transform="translate(1180 300) rotate(-12)"
            fill="none"
            stroke="#fff"
            strokeOpacity=".09"
          >
            {[
              [70, 48],
              [140, 96],
              [215, 148],
              [295, 204],
              [380, 262],
              [470, 324],
              [565, 390],
            ].map(([rx, ry]) => (
              <ellipse key={rx} rx={rx} ry={ry} />
            ))}
          </g>
        </svg>
      )}
      <div
        className={
          serviceWrap +
          " relative flex flex-wrap items-center gap-12 pt-14 " +
          (careers ? "pb-[88px]" : "pb-28")
        }
      >
        <div className="min-w-0 flex-[999_1_520px]">
          <nav
            aria-label="Breadcrumb"
            className={
              mono +
              " flex flex-wrap gap-2.5 text-[11px] " +
              (careers ? "text-[#c2d3e2]" : "text-[#b4c2cc]")
            }
          >
            <a href="/">Home</a>
            <span>/</span>
            <span
              aria-current="page"
              className={careers ? "text-white" : "text-[#f1efea]"}
            >
              {data.breadcrumb}
            </span>
          </nav>
          <div
            className={
              mono +
              (careers
                ? " mt-11 text-[12px] text-[#ffd2be]"
                : " mt-14 flex items-center gap-3.5 text-[12px] text-[var(--accentHi)]")
            }
          >
            {!careers && (
              <span className="inline-block h-px w-9 bg-[var(--accentHi)]" />
            )}
            {data.eyebrow}
          </div>
          <h1
            className={
              "font-bold tracking-[-.025em] " +
              (careers
                ? "mt-[18px] max-w-[700px] text-[clamp(40px,5.2vw,72px)] leading-[1.02]"
                : "mt-5 max-w-[820px] text-[clamp(40px,5vw,68px)] leading-[1.03]")
            }
          >
            {data.title}
          </h1>
          <p
            className={
              "mt-[22px] text-[clamp(17px,1.5vw,20px)] leading-[1.55] " +
              (careers
                ? "max-w-[580px] text-[#dce7f1]"
                : "max-w-[620px] text-[#d7dee3]")
            }
          >
            {data.description}
          </p>
          {(data.buttonOne || data.buttonTwo) && (
            <div className="mt-[34px] flex flex-wrap gap-3.5">
              <ServiceButton link={data.buttonOne} banner />
              <ServiceButton link={data.buttonTwo} secondary />
            </div>
          )}
        </div>
        {careers && (
          <aside className="flex-[1_1_300px] rounded-md border border-white/20 bg-white/[.08] p-7">
            <div className={mono + " text-[11px] text-[#c2d3e2]"}>
              {data.asideTitle}
            </div>
            <ul className="mt-4 space-y-3 text-[17px] font-semibold">
              {data.asideItems?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            {data.asideNote && (
              <p className="mt-6 border-t border-white/20 pt-5 text-[14px] leading-relaxed text-[#dce7f1]">
                {data.asideNote}
              </p>
            )}
          </aside>
        )}
      </div>
    </MG2ASection>
  );
}
export function MG2ACompanyStory({ data }) {
  return (
    <ServiceFrame data={data} className="pt-24 pb-[72px]">
      <div className="flex flex-wrap gap-16">
        <div className="max-w-[460px] flex-[1_1_320px]">
          <Heading data={data} />
        </div>
        <div className="min-w-0 max-w-[720px] flex-[999_1_480px] text-[18px] leading-[1.75] [&_p]:mb-5 [&_h3]:mt-7 [&_h3]:text-[24px] [&_h3]:font-bold">
          <RichText value={data.body} />
        </div>
      </div>
      {data.items?.length > 0 && (
        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-6">
          {data.items.map((item, i) => (
            <div
              key={item._key || i}
              className="border-t border-[var(--line)] pt-4"
            >
              <div className="text-[44px] font-bold tracking-[-.02em]">
                {item.value}
              </div>
              <div className="mt-1.5 text-[14px] text-[var(--muted)]">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      )}
    </ServiceFrame>
  );
}
export function MG2ACompanyFeatures({ data }) {
  const cards = stegaClean(data.variant) === "cards";
  return (
    <ServiceFrame
      data={data}
      className={
        cards ? "py-24" : "border-y border-[var(--line)] bg-[var(--bg2)] py-20"
      }
    >
      <Heading
        data={data}
        small={!cards}
        className={cards ? "max-w-[760px]" : ""}
      />
      <div
        className={
          "mt-10 grid " +
          (cards
            ? "grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4"
            : "grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-8")
        }
      >
        {data.items?.map((item, i) => (
          <div
            key={item._key || i}
            className={
              cards
                ? "rounded-md border border-[var(--line)] bg-[var(--panel)] p-7"
                : "border-t-2 border-[var(--accent)] pt-5"
            }
          >
            <div className={label}>{String(i + 1).padStart(2, "0")}</div>
            <h3
              className={
                (cards ? "mt-3.5" : "mt-2.5") + " text-[20px] font-bold"
              }
            >
              {item.title}
            </h3>
            <p
              className={
                "mt-2.5 text-[15px] text-[var(--muted)] " +
                (cards ? "leading-[1.6]" : "leading-[1.65]")
              }
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </ServiceFrame>
  );
}
export function MG2ATeamGrid({ data }) {
  return (
    <ServiceFrame data={data} className="py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <Heading data={data} className="max-w-[640px]" />
        {safeHref(data.link?.href) && (
          <a
            href={safeHref(data.link.href)}
            className="flex items-center gap-2 font-semibold text-[var(--accent)]"
          >
            {data.link.label}
            <Arrow />
          </a>
        )}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(150px,100%),1fr))] gap-5">
        {data.members?.map((person) => (
          <a key={person._id} href={safeHref(person.href)} className="group">
            <Portrait person={person} />
            <h3 className="mt-3.5 text-[18px] font-bold group-hover:text-[var(--accent)]">
              {person.title}
            </h3>
            <p className="mt-1 text-[14px] text-[var(--muted)]">
              {person.role}
            </p>
          </a>
        ))}
      </div>
      {!data.members?.length && (
        <p className="mt-6 text-[var(--muted)]">
          {data.emptyMessage || "Team information will be available soon."}
        </p>
      )}
    </ServiceFrame>
  );
}
export function MG2AClientList({ data }) {
  return (
    <ServiceFrame
      data={data}
      className="border-y border-[var(--line)] bg-[var(--bg2)] py-[72px]"
    >
      <div className="flex flex-wrap gap-x-14 gap-y-8">
        <div className="max-w-[320px] flex-[1_1_260px]">
          <Heading
            data={data}
            titleGap="mt-3.5"
            titleClassName="text-[28px] leading-[1.15] font-bold tracking-[-.015em]"
          />
        </div>
        <div className="grid flex-[999_1_560px] grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-x-6">
          {data.items?.map((item, i) => (
            <div
              key={i}
              className="border-b border-[var(--line)] py-3.5 font-semibold"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </ServiceFrame>
  );
}
export function MG2AOffices({ data }) {
  return (
    <ServiceFrame data={data} className="py-24">
      <Heading data={data} small />
      <div className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-5">
        {data.offices?.map((office, i) => (
          <div
            key={office._key || i}
            className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-8"
          >
            <div className={mono + " text-[11px] text-[var(--accent)]"}>
              {office.name}
            </div>
            <address className="mt-3.5 text-[18px] not-italic leading-[1.6]">
              {office.street}
              <br />
              {office.city}
            </address>
            <div className="mt-[18px] flex flex-wrap gap-5 font-semibold">
              <a href={safeHref("tel:" + office.telephone)}>{office.phone}</a>
              <a
                href={
                  "https://www.google.com/maps/search/?api=1&query=" +
                  encodeURIComponent(office.street + ", " + office.city)
                }
                className="text-[var(--accent)]"
              >
                Get directions →
              </a>
            </div>
          </div>
        ))}
      </div>
    </ServiceFrame>
  );
}
export function MG2ABenefits({ data }) {
  return (
    <ServiceFrame
      data={data}
      className="border-y border-[var(--line)] bg-[var(--bg2)] py-20"
    >
      <div className="flex flex-wrap gap-12">
        <div className="max-w-[380px] flex-[1_1_300px]">
          <Heading data={data} small />
          <p className="mt-3.5 text-[15px] leading-[1.6] text-[var(--muted)]">
            {data.description}
          </p>
        </div>
        <ul className="grid flex-[999_1_560px] grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-x-8">
          {data.items?.map((item, i) => (
            <li
              key={i}
              className="flex gap-3.5 border-b border-[var(--line)] py-[18px] text-[17px] font-semibold"
            >
              <span aria-hidden="true" className="text-[var(--accent)]">
                +
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </ServiceFrame>
  );
}
export function MG2AJobList({ data }) {
  return (
    <ServiceFrame data={data} className="py-24">
      <Heading data={data} />
      <div className="mt-7 border-t border-[var(--line)]">
        {data.jobs?.map((job) => (
          <a
            key={job._id}
            href={safeHref(job.href)}
            className="group flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-[var(--line)] py-[26px]"
          >
            <h3 className="text-[22px] font-bold group-hover:text-[var(--accent)]">
              {job.title}
            </h3>
            <span className="flex items-center gap-6">
              <span className={mono + " text-[11px] text-[var(--muted)]"}>
                {job.location}
              </span>
              <span className="text-[var(--accent)]">
                <Arrow />
              </span>
            </span>
          </a>
        ))}
      </div>
      {!data.jobs?.length && (
        <p className="mt-7 text-[var(--muted)]">
          {data.emptyMessage ||
            "There are no open positions at the moment. Please check back soon."}
        </p>
      )}
    </ServiceFrame>
  );
}
export function MG2AGraduateCta({ data }) {
  return (
    <ServiceFrame data={data} className="pb-24">
      <div className="flex flex-wrap items-center justify-between gap-7 rounded-md border border-l-4 border-[var(--line)] border-l-[var(--accent)] bg-[var(--panel)] p-[clamp(28px,4vw,48px)]">
        <div className="max-w-[680px]">
          <Heading
            data={data}
            titleGap="mt-3"
            eyebrowClassName="text-[11px]!"
            titleClassName="text-[clamp(24px,2.6vw,32px)] leading-[1.15] font-bold"
          />
          <p className="mt-3 text-[16px] leading-[1.6] text-[var(--muted)]">
            {data.description}
          </p>
        </div>
        <ServiceButton link={data.link} showArrow={false} />
      </div>
    </ServiceFrame>
  );
}
export function MG2AMemberProfile({ data }) {
  const person = data.person || {};
  return (
    <ServiceFrame data={data} className="py-20">
      <nav
        aria-label="Breadcrumb"
        className={label + " mb-10 flex flex-wrap gap-2.5"}
      >
        <a href="/">Home</a>
        <span>/</span>
        <a href="/about">About</a>
        <span>/</span>
        <span aria-current="page">{person.title}</span>
      </nav>
      <div className="grid items-start gap-12 md:grid-cols-[minmax(220px,320px)_1fr]">
        <Portrait person={person} />
        <div>
          <p className={label}>{person.role}</p>
          <h1 className="mt-4 text-[clamp(36px,5vw,60px)] font-bold leading-[1.05] tracking-[-.025em]">
            {person.title}
          </h1>
          {person.summary && (
            <p className="mt-6 text-[20px] leading-relaxed text-[var(--muted)]">
              {person.summary}
            </p>
          )}
          <h2 className="mt-10 text-[24px] font-bold">{data.title}</h2>
          <div className="mt-5 text-[18px] leading-relaxed [&_p]:mb-5">
            <RichText value={person.body} />
          </div>
          <div className="mt-7 flex flex-wrap gap-6 text-[var(--accent)]">
            {person.email && (
              <a href={safeHref("mailto:" + person.email)}>{person.email}</a>
            )}
            {person.phone && (
              <a href={safeHref("tel:" + person.phone.replace(/[^+\d]/g, ""))}>
                {person.phone}
              </a>
            )}
          </div>
          <a
            href="/about"
            className="mt-10 inline-block font-semibold text-[var(--accent)]"
          >
            ← Back to our team
          </a>
        </div>
      </div>
    </ServiceFrame>
  );
}
export function MG2AJobApplication({ data }) {
  return (
    <ServiceFrame
      data={data}
      className="border-t border-[var(--line)] bg-[var(--bg2)] pt-[88px] pb-[104px]"
    >
      {data.closed ? (
        <p className="text-[20px]">
          This position is no longer accepting applications.{" "}
          <a href="/careers" className="underline text-[var(--accent)]">
            View current openings
          </a>
          .
        </p>
      ) : (
        <div className="flex flex-wrap gap-16">
          <div className="max-w-[420px] flex-[1_1_300px]">
            <Heading data={data} />
            <p className="mt-5 text-[18px] leading-relaxed text-[var(--muted)]">
              {data.description}
            </p>
            <p className="mt-5 font-semibold">{data.jobTitle}</p>
          </div>
          <div className="min-w-0 flex-[999_1_520px]">
            <InquiryForm data={data} />
          </div>
        </div>
      )}
    </ServiceFrame>
  );
}
