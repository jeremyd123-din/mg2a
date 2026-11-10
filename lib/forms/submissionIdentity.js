const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
export function submissionIdentity(fields = []) {
  fields = Array.isArray(fields) ? fields : [];
  const find = (names) =>
    fields.find(
      (field) =>
        names.includes(normalize(field.name)) ||
        names.includes(normalize(field.label)),
    )?.value;
  const full = find([
    "name",
    "fullname",
    "yourname",
    "contactname",
    "applicantname",
    "submittername",
  ]);
  const first = find(["firstname", "givenname"]);
  const last = find(["lastname", "surname", "familyname"]);
  const email = find(["email", "emailaddress", "youremail", "contactemail"]);
  return {
    name: String(full || [first, last].filter(Boolean).join(" ") || "").trim(),
    email: String(email || "").trim(),
  };
}
