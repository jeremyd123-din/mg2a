import * as blocks from "@/components/mg2a/blocks";
import { createDataAttribute } from "next-sanity";
export default function PageBuilder({
  data,
  index,
  docId,
  docType,
  fieldPath,
}) {
  const Component = blocks[data?._type];
  if (!Component) {
    console.warn("Unknown MG2A section:", data?._type);
    return null;
  }
  const path = fieldPath || `page_builder[_key=="${data._key}"]`;
  const content = (
    <Component
      data={data}
      index={index}
      editorContext={docId ? { docId, docType, path } : undefined}
    />
  );
  if (!docId || !docType || !data._key) return content;
  const attribute = createDataAttribute({
    baseUrl: "/studio",
    type: docType,
    id: docId,
    path,
  }).toString();
  return <div data-sanity={attribute}>{content}</div>;
}
