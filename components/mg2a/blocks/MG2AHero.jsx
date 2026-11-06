import MG2ASection from "../ui/MG2ASection";
import InlineText from "../ui/InlineText";
import { mediaUrl, safeHref } from "../ui/helpers";
import HeroVideo from "../ui/HeroVideo";
export default function MG2AHero({ data }) {
  return (
    <MG2ASection
      data={data}
      paddingTarget=".mg-hero-content"
      className="mg-hero relative [background:#0b1822] [color:#f1efea] overflow-hidden"
    >
      <HeroVideo
        muted
        loop
        playsInline
        poster={mediaUrl(data.image)}
        aria-hidden="true"
        className="absolute inset-[0] w-[100%] h-[100%] object-cover object-[50%_40%]"
      >
        <source src={mediaUrl(data.file)} type="video/mp4" />
      </HeroVideo>
      <div
        aria-hidden="true"
        className="absolute inset-[0] [background:linear-gradient(_90deg,_rgba(11,_24,_34,_0.92)_0%,_rgba(11,_24,_34,_0.66)_42%,_rgba(11,_24,_34,_0.22)_100%_)]"
      ></div>
      <div
        aria-hidden="true"
        className="absolute inset-[0] [background:linear-gradient(_180deg,_rgba(11,_24,_34,_0.6)_0%,_rgba(11,_24,_34,_0)_24%,_rgba(11,_24,_34,_0)_66%,_rgba(11,_24,_34,_0.9)_100%_)]"
      ></div>
      <div
        className="hdr-space h-[125px] [@media(max-width:980px)]:h-[84px]"
        aria-hidden="true"
      ></div>
      <div className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)] mg-hero-content relative pt-[clamp(56px,_9vw,_120px)] pb-[180px]">
        <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[12px] [color:var(--accentHi)] flex items-center gap-[14px]">
          <span className="[display:inline-block] w-[36px] h-[1px] [background:var(--accentHi)]"></span>
          {data.eyebrow}
        </div>
        <h1 className="m-[24px_0_0] max-w-[760px] text-[clamp(40px,_5.6vw,_76px)] leading-[1.02] font-bold tracking-[-0.025em]">
          {data.title}
        </h1>
        <p className="m-[24px_0_0] max-w-[560px] text-[clamp(17px,_1.5vw,_20px)] leading-[1.55] [color:#cdd2d6]">
          {data.description}
        </p>
        <div className="flex flex-wrap gap-[14px] mt-[36px]">
          <a
            href={safeHref(data.buttonOne?.href)}
            className="btn inline-flex items-center gap-[10px] min-h-[48px] p-[0_22px] rounded-[4px] font-semibold text-[15px] [transition:transform_0.2s,_background-color_0.2s] [&:hover]:[transform:translateY(-1px)] motion-reduce:[transition:none] [background:var(--btn)] [color:#ffffff]"
          >
            {data.buttonOne?.label}
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
          <a
            href={safeHref(data.buttonTwo?.href)}
            className="btn inline-flex items-center gap-[10px] min-h-[48px] p-[0_22px] rounded-[4px] font-semibold text-[15px] [transition:transform_0.2s,_background-color_0.2s] [&:hover]:[transform:translateY(-1px)] motion-reduce:[transition:none] [border:1.5px_solid_rgba(241,_239,_234,_0.5)] [color:#f1efea]"
          >
            {data.buttonTwo?.label}
          </a>
        </div>
        <div className="flex items-center gap-[14px] mt-[56px] pt-[22px] max-w-[700px] [border-top:1px_solid_rgba(255,_255,_255,_0.16)]">
          <svg
            aria-hidden="true"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-[0_0_auto] [stroke:var(--accentHi)]"
          >
            <path d="M4 11L14 5L24 11"></path>
            <path d="M5 11H23"></path>
            <path d="M8 14V21M12 14V21M16 14V21M20 14V21"></path>
            <path d="M4 23.5H24"></path>
          </svg>
          <p className="mg-hero-trust [&_strong]:font-semibold [&_strong]:[color:#f1efea] [&_strong]:[white-space:nowrap] m-[0] text-[15px] leading-[1.5] [color:#cdd2d6]">
            <InlineText value={data.trustStatement} />
          </p>
        </div>
      </div>
    </MG2ASection>
  );
}
