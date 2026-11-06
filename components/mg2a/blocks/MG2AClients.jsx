import MG2ASection from "../ui/MG2ASection";
import { mediaUrl, safeHref } from "../ui/helpers";
export default function MG2AClients({ data }) {
  return (
    <MG2ASection data={data} aria-label="Clients" className="p-[64px_0_24px]">
      <div className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)] flex flex-wrap items-center gap-[20px_40px]">
        <span className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] text-[11px] [color:var(--muted)] flex-[0_0_auto]">
          {data.eyebrow}
        </span>
        <div className="flex flex-wrap gap-[12px_36px] items-center font-bold text-[17px] tracking-[0.02em] [color:var(--muted)]">
          {(data.clients || []).filter(Boolean).map((item, itemIndex) => (
            <span key={item._key || item._id || itemIndex}>{item.text}</span>
          ))}
        </div>
      </div>
    </MG2ASection>
  );
}
