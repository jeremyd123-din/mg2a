import * as blocks from "@/components/mg2a/blocks";
import { createDataAttribute } from "next-sanity";
export default function PageBuilder({ data, index, docId, docType }) {
  const Component = blocks[data?._type];
  if (!Component) {
    console.warn("Unknown MG2A section:", data?._type);
    return null;
  }
  const content = <Component data={data} index={index} />;
  if (!docId || !docType || !data._key) return content;
  const attribute = createDataAttribute({
    baseUrl: "/studio",
    type: docType,
    id: docId,
    path: `page_builder[_key=="${data._key}"]`,
  }).toString();
  return <div data-sanity={attribute}>{content}</div>;
}
