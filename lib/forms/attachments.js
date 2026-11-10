// Files are stored in authenticated-only submission documents, never public assets.
import { createHash } from "node:crypto";
import {
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_FILES,
  MAX_UPLOAD_MB,
} from "./uploadLimits";
export { MAX_UPLOAD_BYTES } from "./uploadLimits";
const surveyTypes = new Set(["pdf", "jpg", "jpeg", "png", "tif", "tiff"]);
function wordPackage(bytes) {
  // Inspect ZIP central directory names without extracting or executing contents.
  const names = new Set();
  for (let i = 0; i + 46 <= bytes.length; i++) {
    if (bytes.readUInt32LE(i) !== 0x02014b50) continue;
    const length = bytes.readUInt16LE(i + 28),
      extra = bytes.readUInt16LE(i + 30),
      comment = bytes.readUInt16LE(i + 32);
    if (i + 46 + length + extra + comment > bytes.length) return false;
    names.add(bytes.subarray(i + 46, i + 46 + length).toString("utf8"));
    i += 45 + length + extra + comment;
  }
  return (
    bytes.readUInt32LE(0) === 0x04034b50 &&
    names.has("[Content_Types].xml") &&
    names.has("word/document.xml")
  );
}
export async function prepareAttachments(uploads, definition, id) {
  if (uploads.length > MAX_UPLOAD_FILES)
    throw new Error(`Attach no more than ${MAX_UPLOAD_FILES} documents.`);
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
      throw new Error(`Documents must total ${MAX_UPLOAD_MB} MB or less.`);
    const ext = file.name.split(".").pop().toLowerCase();
    const resume =
      definition.find((item) => item.name === field)?.accept ===
      ".pdf,.doc,.docx";
    if (!(resume ? ["pdf", "doc", "docx"].includes(ext) : surveyTypes.has(ext)))
      throw new Error(
        resume
          ? "Use a PDF or Word resume."
          : "Use PDF, JPG, PNG or TIFF documents.",
      );
    const bytes = Buffer.from(await file.arrayBuffer());
    const valid =
      ext === "docx"
        ? bytes.length >= 46 && wordPackage(bytes)
        : ext === "doc"
          ? bytes
              .subarray(0, 8)
              .equals(Buffer.from([208, 207, 17, 224, 161, 177, 26, 225])) &&
            bytes.includes(Buffer.from("WordDocument", "utf16le"))
          : ext === "pdf"
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
    const digest = createHash("sha256")
      .update(bytes)
      .digest("hex")
      .slice(0, 24);
    const chunks = [];
    for (let start = 0; start < bytes.length; start += 400000) {
      const chunkId = `${id}-file${index}-${digest}-part${chunks.length}`;
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
        ext === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : ext === "doc"
            ? "application/msword"
            : ext === "pdf"
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
