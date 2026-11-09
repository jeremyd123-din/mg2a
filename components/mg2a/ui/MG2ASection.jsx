import { sectionAnchor } from "@/lib/mg2a/sectionAnchors";
import { stegaClean } from "next-sanity";
import { blockIdentity, blockStyles } from "@/lib/mg2a/blockStyles";
export default function MG2ASection({
  data,
  paddingTarget,
  children,
  ...props
}) {
  const css = blockStyles(data, paddingTarget);
  const id = sectionAnchor(data);
  const aliases = [
    ...new Set(
      [props.id, stegaClean(data.anchor)].filter(
        (value) => value && value !== id,
      ),
    ),
  ];
  return (
    <section
      {...props}
      id={id}
      className={"relative " + (props.className || "")}
      data-mg2a-block={blockIdentity(data)}
      data-block-type={data._type}
    >
      {aliases.map((alias) => (
        <span
          key={alias}
          id={alias}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0"
        />
      ))}
      {css && <style>{css}</style>}
      {children}
    </section>
  );
}
