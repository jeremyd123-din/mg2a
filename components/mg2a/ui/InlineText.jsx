import { htmlToDOM } from "html-react-parser";
import { Fragment } from "react";
import { stegaClean } from "next-sanity";

// Editors may emphasize text; tags never supply attributes or executable HTML.
export function inlineTextNodes(value) {
  const render = (nodes) =>
    nodes.map((node, index) => {
      if (node.type === "text") return node.data;
      if (node.type !== "tag") return null;
      const children = render(node.children || []);
      if (node.name === "strong" || node.name === "b")
        return <strong key={index}>{children}</strong>;
      return <Fragment key={index}>{children}</Fragment>;
    });
  return render(htmlToDOM(stegaClean(value || "")));
}
export default function InlineText({ value }) {
  return inlineTextNodes(value);
}
