// Files are stored in authenticated-only submission documents, never public assets.
export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
const allowed = new Set(["pdf", "jpg", "jpeg", "png", "tif", "tiff"]);
export async function prepareAttachments(uploads, definition, id) {
  if (uploads.length > 3)
    throw new Error("Attach no more than three documents.");
  for (const field of definition.filter((field) => field.type === "file")) {
    const count = uploads.filter(
      (upload) => upload.field === field.name,
    ).length;
    if (field.required && !count)
      throw new Error(`${field.label} is required.`);
    if (!field.multiple && count > 1)
      throw new Error(`Attach one document for ${field.label}.`);
  }
  let total = 0;
  const attachments = [],
    documents = [];
  for (const [index, { field, file }] of uploads.entries()) {
    if (!definition.some((item) => item.name === field && item.type === "file"))
      throw new Error("Unexpected attachment field.");
    total += file.size;
    if (!file.size || total > MAX_UPLOAD_BYTES)
      throw new Error("Documents must total 3 MB or less.");
    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowed.has(ext))
      throw new Error("Use PDF, JPG, PNG or TIFF documents.");
    const bytes = Buffer.from(await file.arrayBuffer());
    const valid =
      ext === "pdf"
        ? bytes.subarray(0, 5).toString() === "%PDF-"
        : ["jpg", "jpeg"].includes(ext)
          ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
          : ext === "png"
            ? bytes
                .subarray(0, 8)
                .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
            : bytes.subarray(0, 4).equals(Buffer.from([73, 73, 42, 0])) ||
              bytes.subarray(0, 4).equals(Buffer.from([77, 77, 0, 42]));
    if (!valid) throw new Error("A document does not match its file type.");
    const chunks = [];
    for (let start = 0; start < bytes.length; start += 400000) {
      const chunkId = `${id}-file${index}-part${chunks.length}`;
      chunks.push(chunkId);
      documents.push({
        _id: chunkId,
        _type: "formAttachmentChunk",
        data: bytes.subarray(start, start + 400000).toString("base64"),
      });
    }
    attachments.push({
      _key: "file" + index,
      _type: "submissionAttachment",
      name: file.name.replace(/[^a-zA-Z0-9_. -]/g, "_").slice(0, 150),
      bytes: bytes.length,
      mime:
        ext === "pdf"
          ? "application/pdf"
          : ext === "png"
            ? "image/png"
            : ["jpg", "jpeg"].includes(ext)
              ? "image/jpeg"
              : "image/tiff",
      field,
      chunks,
    });
  }
  return { attachments, documents };
}
