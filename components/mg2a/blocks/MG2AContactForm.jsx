import MG2ASection from "../ui/MG2ASection";
import InquiryForm from "../ui/InquiryForm";
import OfficeDetails from "../ui/OfficeDetails";
export default function MG2AContactForm({ data }) {
  return (
    <MG2ASection
      data={data}
      id="contact"
      className="mg-section [&_.mg-offices_.mono]:text-[11px] py-[104px] [&_h2]:m-[16px_0_0] [&_h2]:text-[clamp(32px,_3.6vw,_48px)] [&_h2]:leading-[1.06] [&_h2]:font-bold [&_h2]:tracking-[-0.02em] [&_p]:m-[18px_0_0] [&_p]:text-[17px] [&_p]:leading-[1.6] [&_p]:[color:var(--muted)] [&_.mono]:text-[12px]"
    >
      <div className="wrap max-w-[1280px] mx-auto pl-[clamp(16px,_4vw,_56px)] pr-[clamp(16px,_4vw,_56px)] mg-contact-layout flex flex-wrap gap-[56px]">
        <div className="mg-contact-copy flex-[1_1_360px] max-w-[460px]">
          <div className="mono [font-family:var(--font-mono)] tracking-[0.14em] [text-transform:uppercase] mg-accent [color:var(--accent)]">
            {data.eyebrow}
          </div>
          <h2>{data.title}</h2>
          <p>{data.description}</p>
          <div className="mg-offices grid [grid-template-columns:repeat(2,_minmax(0,_1fr))] gap-[24px] mt-[40px] [&_.mono]:text-[11px]">
            {data.offices?.filter(Boolean).map((o) => (
              <OfficeDetails key={o._id} office={o} />
            ))}
          </div>
        </div>
        <InquiryForm data={data} />
      </div>
    </MG2ASection>
  );
}
