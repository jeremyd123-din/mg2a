"use client";

import { useState, useId } from "react";
export default function InquiryForm({ data }) {
  const [status, setStatus] = useState("idle");
  const id = useId();
  async function submit(event) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/mg2a/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Delivery failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }
  return (
    <form
      className="mg-inquiry flex-[999_1_480px] min-w-[0] grid [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_220px),_1fr))] gap-[20px] p-[36px] [background:var(--panel)] [border:1px_solid_var(--line)] rounded-[6px] [&_label]:flex [&_label]:flex-col [&_label]:gap-[8px] [&_label]:text-[14px] [&_label]:font-semibold [&_input]:min-h-[48px] [&_input]:min-w-[0] [&_input]:w-[100%] [&_input]:p-[0_14px] [&_input]:font-[400] [&_input]:[color:var(--ink)] [&_input]:[background:var(--bg)] [&_input]:[border:1px_solid_var(--line)] [&_input]:rounded-[4px] [&_select]:min-h-[48px] [&_select]:min-w-[0] [&_select]:w-[100%] [&_select]:p-[0_14px] [&_select]:font-[400] [&_select]:[color:var(--ink)] [&_select]:[background:var(--bg)] [&_select]:[border:1px_solid_var(--line)] [&_select]:rounded-[4px] [&_textarea]:min-h-[48px] [&_textarea]:min-w-[0] [&_textarea]:w-[100%] [&_textarea]:p-[12px_14px] [&_textarea]:font-[400] [&_textarea]:[color:var(--ink)] [&_textarea]:[background:var(--bg)] [&_textarea]:[border:1px_solid_var(--line)] [&_textarea]:rounded-[4px] [&_textarea]:[resize:vertical] [&_button]:[border:0]"
      onSubmit={submit}
    >
      <label>
        {data.nameLabel}
        <input name="name" autoComplete="name" required maxLength={150} />
      </label>
      <label>
        {data.emailLabel}
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
        />
      </label>
      <label>
        {data.phoneLabel}
        <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
      </label>
      <label>
        {data.needLabel}
        <select name="need" required>
          {data.options?.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="mg-full-width [grid-column:1/-1]">
        {data.detailsLabel}
        <textarea name="details" rows={4} required maxLength={5000} />
      </label>
      <div
        className="mg-honeypot absolute [left:-10000px] w-[1px] h-[1px] overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={id}>Leave this field empty</label>
        <input id={id} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="mg-form-actions flex flex-wrap justify-between items-center gap-[16px] [&_>_span]:text-[13px] [&_>_span]:[color:var(--muted)] [&_>_span]:flex-[1_1_200px] mg-full-width [grid-column:1/-1]">
        <span>{data.note}</span>
        <button
          type="submit"
          className="btn inline-flex items-center gap-[10px] min-h-[48px] p-[0_22px] rounded-[4px] font-semibold text-[15px] [transition:transform_0.2s,_background-color_0.2s] [&:hover]:[transform:translateY(-1px)] motion-reduce:[transition:none] mg-primary [background:var(--btn)] [color:white]"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : data.submitLabel}
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M3 8H13M9 4L13 8L9 12" />
          </svg>
        </button>
      </div>
      {(status === "success" || status === "error") && (
        <div
          className="mg-full-width [grid-column:1/-1]"
          aria-live="polite"
          role="status"
        >
          {status === "success"
            ? data.successMessage
            : status === "error"
              ? data.errorMessage
              : ""}
        </div>
      )}
    </form>
  );
}
