export function blockIdentity(data) {
  return String(
    data._instanceKey || data._key || data._id || data._type,
  ).replace(/[^a-zA-Z0-9_-]/g, "_");
}
