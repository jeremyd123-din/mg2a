"use client";

import { useState, useId, useRef } from "react";
import { stegaClean } from "next-sanity";
import { parseFields } from "@/lib/forms/definition";
export default function InquiryForm({ data, appearance = "panel" }) {
  const [status, setStatus] = useState("idle");
  const id = useId();
  const requestId = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const definition = stegaClean(data.form);
  let fields;
  try {
    fields = parseFields(definition?.form_fields);
  } catch {
    fields = null;
  }

  async function submit(event) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(
      fields.map((field) => [
        field.name,
        field.type === "checkbox"
          ? formData.has(field.name)
          : field.isMulti
            ? formData.getAll(field.name)
            : formData.get(field.name) || "",
      ]),
    );
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: definition._id,
          requestId: requestId.current,
          values,
          website: formData.get("website"),
          pagePath: window.location.pathname,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || definition.error_message || "Submission failed",
        );
      setStatus("success");
      form.reset();
      requestId.current = null;
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("error");
    }
  }
  if (!fields)
    return (
      <p role="status">This form is unavailable. Please contact an office.</p>
    );
  return (
    <form
      className={
        (appearance === "plain"
          ? "border-0! bg-transparent! p-0! gap-[18px]! flex-[999_1_460px]! "
          : "") +
        "mg-inquiry flex-[999_1_480px] min-w-[0] grid [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_220px),_1fr))] gap-[20px] p-[36px] [background:var(--panel)] [border:1px_solid_var(--line)] rounded-[6px] [&_label]:flex [&_label]:flex-col [&_label]:gap-[8px] [&_label]:text-[14px] [&_label]:font-semibold [&_input]:min-h-[48px] [&_input]:min-w-[0] [&_input]:w-[100%] [&_input]:p-[0_14px] [&_input]:font-[400] [&_input]:[color:var(--ink)] [&_input]:[background:var(--bg)] [&_input]:[border:1px_solid_var(--line)] [&_input]:rounded-[4px] [&_select]:min-h-[48px] [&_select]:min-w-[0] [&_select]:w-[100%] [&_select]:p-[0_14px] [&_select]:font-[400] [&_select]:[color:var(--ink)] [&_select]:[background:var(--bg)] [&_select]:[border:1px_solid_var(--line)] [&_select]:rounded-[4px] [&_textarea]:min-h-[48px] [&_textarea]:min-w-[0] [&_textarea]:w-[100%] [&_textarea]:p-[12px_14px] [&_textarea]:font-[400] [&_textarea]:[color:var(--ink)] [&_textarea]:[background:var(--bg)] [&_textarea]:[border:1px_solid_var(--line)] [&_textarea]:rounded-[4px] [&_textarea]:[resize:vertical] [&_button]:[border:0]"
      }
      onSubmit={submit}
    >
      {fields.map((field) => {
        const fieldId = `${id}-${field.name}`;
        const common = {
          id: fieldId,
          name: field.name,
          required: field.required,
          placeholder: field.placeholder,
          maxLength: field.maxLength,
        };
        const wide = field.width === 100 ? "[grid-column:1/-1]" : "";
        if (field.type === "radio")
          return (
            <fieldset key={field.name} className={wide}>
              <legend className="mb-2 text-sm font-semibold">
                {field.label}
              </legend>
              {field.options.map((option, index) => (
                <label
                  key={option.value}
                  htmlFor={`${fieldId}-${index}`}
                  className="flex-row! items-center mb-2"
                >
                  <input
                    id={`${fieldId}-${index}`}
                    className="w-4! min-h-4!"
                    type="radio"
                    name={field.name}
                    value={option.value}
                    required={field.required}
                  />
                  {option.label}
                </label>
              ))}
            </fieldset>
          );
        if (field.type === "checkbox")
          return (
            <label
              key={field.name}
              htmlFor={fieldId}
              className={`flex-row! items-center ${wide}`}
            >
              <input {...common} className="w-4! min-h-4!" type="checkbox" />
              {field.label}
            </label>
          );
        if (field.type === "hidden")
          return (
            <input
              key={field.name}
              name={field.name}
              type="hidden"
              value={field.defaultValue || ""}
            />
          );
        return (
          <label key={field.name} htmlFor={fieldId} className={wide}>
            {field.label}
            {field.type === "textarea" ? (
              <textarea {...common} rows={4} />
            ) : field.type === "select" ? (
              <select
                {...common}
                multiple={field.isMulti}
                defaultValue={field.isMulti ? [] : undefined}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...common}
                type={field.type}
                autoComplete={
                  field.type === "email"
                    ? "email"
                    : field.type === "tel"
                      ? "tel"
                      : field.name === "name"
                        ? "name"
                        : undefined
                }
              />
            )}
          </label>
        );
      })}
      <div
        className="mg-honeypot absolute [left:-10000px] w-[1px] h-[1px] overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={id}>Leave this field empty</label>
        <input id={id} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="mg-form-actions flex flex-wrap justify-between items-center gap-[16px] [&_>_span]:text-[13px] [&_>_span]:[color:var(--muted)] [&_>_span]:flex-[1_1_200px] mg-full-width [grid-column:1/-1]">
        {definition.note && <span>{definition.note}</span>}
        <button
          type="submit"
          className="btn inline-flex items-center gap-[10px] min-h-[48px] p-[0_22px] rounded-[4px] font-semibold text-[15px] [transition:transform_0.2s,_background-color_0.2s] [&:hover]:[transform:translateY(-1px)] motion-reduce:[transition:none] mg-primary [background:var(--btn)] [color:white]"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : definition.button_title}
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
            ? definition.thankyou_message
            : status === "error"
              ? errorMessage || definition.error_message || "Please try again."
              : ""}
        </div>
      )}
    </form>
  );
}
