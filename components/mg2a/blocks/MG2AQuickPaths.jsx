import MG2ASection from "../ui/MG2ASection";
import { mediaUrl, safeHref } from "../ui/helpers";
export default function MG2AQuickPaths({ data }) {
  return (
    <MG2ASection
      data={data}
      aria-label="Find what you need"
      className="relative mt-[-112px]"
    >
      <div className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)]">
        <div className="mg-quick-paths-grid [&_>_a:last-child]:[border-right:0] grid [grid-template-columns:repeat(auto-fit,_minmax(260px,_1fr))] [background:var(--panel)] [border:1px_solid_var(--line)] rounded-[6px] [box-shadow:0_24px_60px_rgba(0,_0,_0,_0.28)]">
          {(data.paths || []).filter(Boolean).map((item, itemIndex) => (
            <a
              key={item._key || item._id || itemIndex}
              href={safeHref(item.href)}
              className="flex flex-col gap-[10px] p-[30px_32px] [border-right:1px_solid_var(--line)]"
            >
              <span className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[11px] [color:var(--accent)]">
                {item.eyebrow}
              </span>
              <span className="text-[20px] font-bold tracking-[-0.01em]">
                {item.text}
              </span>
              <span className="text-[15px] [color:var(--muted)]">
                {item.text2}
              </span>
              <span className="flex items-center gap-[8px] mt-[6px] font-semibold text-[15px] [color:var(--accent)]">
                {item.text3}
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
            </a>
          ))}
        </div>
      </div>
    </MG2ASection>
  );
}
