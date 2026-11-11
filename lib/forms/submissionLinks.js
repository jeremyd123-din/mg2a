export const isSubmissionId = (value) =>
  typeof value === "string" &&
  /^submissions\.[A-Za-z0-9_-]{1,100}$/.test(value);
export function selectedSubmission(state) {
  return isSubmissionId(state?.submission) ? state.submission : null;
}

export function submissionShareUrl(href) {
  const url = new URL(href);
  url.search = "";
  url.hash = "";
  return url.href;
}
