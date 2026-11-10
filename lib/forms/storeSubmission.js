// Base64 expands files, so a valid upload can exceed Sanity's 4 MB mutation
// limit. Keep each write below 2 MB and make the submission visible only after
// every attachment chunk has been saved. Content-addressed IDs make retries safe.
export const MAX_MUTATION_BYTES = 2_000_000;
export function submissionBatches(submission, documents) {
  const batches = [];
  let batch = [],
    size = 32;
  for (const document of [...documents, submission]) {
    const bytes =
      Buffer.byteLength(
        JSON.stringify({ createIfNotExists: document }),
        "utf8",
      ) + 1;
    if (bytes + 32 > MAX_MUTATION_BYTES)
      throw new Error("Submission document is too large.");
    if (size + bytes > MAX_MUTATION_BYTES) {
      batches.push(batch);
      batch = [];
      size = 32;
    }
    batch.push(document);
    size += bytes;
  }
  if (batch.length) batches.push(batch);
  return batches;
}
export async function storeSubmission(client, submission, documents) {
  if (!documents.length) return client.createIfNotExists(submission);
  for (const batch of submissionBatches(submission, documents)) {
    let transaction = client.transaction();
    for (const document of batch)
      transaction = transaction.createIfNotExists(document);
    await transaction.commit();
  }
}
