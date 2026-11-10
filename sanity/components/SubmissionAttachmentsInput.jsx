import { useState } from "react";
import { useClient } from "sanity";
import { Button, Stack, Text } from "@sanity/ui";
export default function SubmissionAttachmentsInput({ value = [] }) {
  const client = useClient({ apiVersion: "2025-02-19" });
  const [error, setError] = useState("");
  async function download(file) {
    try {
      setError("");
      const chunks = await client.fetch(
        "*[_id in $ids]{_id,data}",
        { ids: file.chunks },
        { perspective: "raw" },
      );
      const parts = file.chunks.map((id) => {
        const chunk = chunks.find((chunk) => chunk._id === id);
        if (!chunk) throw new Error();
        return Uint8Array.from(atob(chunk.data), (c) => c.charCodeAt(0));
      });
      const url = URL.createObjectURL(new Blob(parts, { type: file.mime }));
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("Unable to download this document. Please try again.");
    }
  }
  return (
    <Stack space={3}>
      {value.map((file) => (
        <Button
          key={file._key}
          text={`${file.name} (${Math.ceil(file.bytes / 1024)} KB)`}
          onClick={() => download(file)}
          mode="ghost"
        />
      ))}
      {!value.length && (
        <Text size={1} muted>
          No documents attached.
        </Text>
      )}
      {error && <Text size={1}>{error}</Text>}
    </Stack>
  );
}
