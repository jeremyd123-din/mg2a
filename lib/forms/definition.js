const types = new Set([
  "text",
  "email",
  "tel",
  "url",
  "number",
  "date",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "hidden",
  "file",
]);
const reserved = new Set([
  "website",
  "_honeypot",
  "formId",
  "requestId",
  "page_url",
  "__proto__",
  "constructor",
  "prototype",
]);
export function parseFields(source) {
  const value =
    typeof source === "string"
      ? JSON.parse(source)
      : JSON.parse(source?.code || "null");
  const fields = Array.isArray(value) ? value : value?.fields;
  if (!Array.isArray(fields) || !fields.length || fields.length > 40)
    throw new Error("Provide a JSON array containing 1–40 fields.");
  const names = new Set();
  return fields.map((field) => {
    if (
      !field ||
      typeof field !== "object" ||
      !/^[a-zA-Z][a-zA-Z0-9_]{0,63}$/.test(field.name || "") ||
      reserved.has(field.name) ||
      names.has(field.name)
    )
      throw new Error(
        "Each field needs a unique name using letters, numbers or underscores.",
      );
    names.add(field.name);
    if (!types.has(field.type))
      throw new Error(`Unsupported field type: ${field.type}`);
    if (
      typeof field.label !== "string" ||
      !field.label.trim() ||
      field.label.length > 200
    )
      throw new Error(`Add a label for ${field.name}.`);
    const options = (field.options || []).map((option) =>
      typeof option === "string" ? { label: option, value: option } : option,
    );
    if (
      ["select", "radio"].includes(field.type) &&
      (!options.length || options.length > 100)
    )
      throw new Error(`Add options for ${field.name}.`);
    if (
      options.some(
        (option) =>
          !option ||
          typeof option.label !== "string" ||
          typeof option.value !== "string" ||
          option.value.length > 500,
      )
    )
      throw new Error(`Invalid options for ${field.name}.`);
    if (
      field.maxLength != null &&
      (!Number.isInteger(field.maxLength) ||
        field.maxLength < 1 ||
        field.maxLength > 10000)
    )
      throw new Error(`Invalid maxLength for ${field.name}.`);
    if (field.isMulti && field.type !== "select")
      throw new Error("isMulti is supported for select fields.");
    return {
      name: field.name,
      type: field.type,
      label: field.label,
      required: !!field.required,
      width: field.width === 100 ? 100 : 50,
      placeholder:
        typeof field.placeholder === "string" ? field.placeholder : undefined,
      options,
      group: typeof field.group === "string" ? field.group : undefined,
      multiple: !!field.multiple,
      accept:
        field.accept === "resume"
          ? ".pdf,.doc,.docx"
          : ".pdf,.jpg,.jpeg,.png,.tif,.tiff",
      defaultValue:
        typeof field.defaultValue === "string"
          ? field.defaultValue.slice(0, field.maxLength || 500)
          : undefined,
      isMulti: !!field.isMulti,
      maxLength:
        field.maxLength ||
        (field.type === "textarea" ? 5000 : field.type === "email" ? 254 : 500),
    };
  });
}
export function recipients(value) {
  const result = String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (
    result.length > 10 ||
    result.some(
      (email) =>
        email.length > 254 || !/^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/.test(email),
    )
  )
    throw new Error("Enter valid email addresses, separated by commas.");
  return [...new Set(result)];
}
export function validateValues(fields, input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Invalid fields.");
  return fields
    .filter((field) => field.type !== "file")
    .map((field) => {
      let value =
        (field.type === "hidden"
          ? field.defaultValue || ""
          : input[field.name]) ??
        (field.type === "checkbox" ? false : field.isMulti ? [] : "");
      if (field.type === "checkbox") {
        if (![true, false, "on", ""].includes(value))
          throw new Error(`Invalid ${field.label}.`);
        value = value === true || value === "on";
        if (field.required && !value)
          throw new Error(`${field.label} is required.`);
        return {
          _key: field.name,
          name: field.name,
          label: field.label,
          value: value ? "Yes" : "No",
        };
      }
      const values = field.isMulti ? value : [value];
      if (
        !Array.isArray(values) ||
        values.length > 100 ||
        values.some((v) => typeof v !== "string" || v.length > field.maxLength)
      )
        throw new Error(`Invalid ${field.label}.`);
      const cleaned = values.map((v) => v.trim());
      if (field.required && (!cleaned.length || cleaned.every((v) => !v)))
        throw new Error(`${field.label} is required.`);
      for (const text of cleaned) {
        if (!text) continue;
        if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))
          throw new Error(`Enter a valid ${field.label}.`);
        if (
          ["select", "radio"].includes(field.type) &&
          !field.options.some((option) => option.value === text)
        )
          throw new Error(`Choose a valid ${field.label}.`);
        if (field.type === "number" && !Number.isFinite(Number(text)))
          throw new Error(`Enter a number for ${field.label}.`);
        if (
          field.type === "date" &&
          (!/^\d{4}-\d{2}-\d{2}$/.test(text) || Number.isNaN(Date.parse(text)))
        )
          throw new Error(`Enter a date for ${field.label}.`);
        if (field.type === "url") {
          try {
            if (!["http:", "https:"].includes(new URL(text).protocol))
              throw new Error();
          } catch {
            throw new Error(`Enter a valid ${field.label}.`);
          }
        }
      }
      return {
        _key: field.name,
        name: field.name,
        label: field.label,
        value: cleaned.join(", "),
      };
    });
}
