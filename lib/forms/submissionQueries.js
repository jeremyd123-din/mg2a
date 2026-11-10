export const SUBMISSIONS_PAGE_SIZE = 25;
const filter = `_type=="formSubmission" && _id in path("submissions.**") && ($formId=="" || form_id==$formId) && ($status=="" || status==$status) && ($pattern=="" || submitter_name match $pattern || submitter_email match $pattern || form_title match $pattern || fields[].value match $pattern)`;
export const submissionsQuery = `{
 "total":count(*[${filter}]),
 "items":*[${filter}]|order(submitted_at desc,_id asc)[$start...$end]{_id,_rev,form_id,form_title,submitted_at,status,notification_status,submitter_name,submitter_email,"identityFields":fields[name in ["name","full_name","fullname","first_name","last_name","email","email_address"] || label in ["Name","Full name","First name","Last name","Email","Email address"]]{name,label,value}},
 "forms":*[_type=="form" && !(_id in path("drafts.**"))]|order(title asc){_id,title}
}`;
export function submissionQueryParams({
  search = "",
  formId = "",
  status = "",
  page = 0,
} = {}) {
  const text = String(search)
    .trim()
    .slice(0, 200)
    .replace(/[\\*?]/g, "");
  const start =
    Math.max(0, Number.isInteger(page) ? page : 0) * SUBMISSIONS_PAGE_SIZE;
  return {
    pattern: text ? "*" + text + "*" : "",
    formId,
    status: ["new", "reviewed", "archived"].includes(status) ? status : "",
    start,
    end: start + SUBMISSIONS_PAGE_SIZE,
  };
}
