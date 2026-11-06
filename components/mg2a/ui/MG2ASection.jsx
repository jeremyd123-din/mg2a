import { blockIdentity, blockStyles } from "@/lib/mg2a/blockStyles";
export default function MG2ASection({
  data,
  paddingTarget,
  children,
  ...props
}) {
  const css = blockStyles(data, paddingTarget);
  return (
    <section
      {...props}
      data-mg2a-block={blockIdentity(data)}
      data-block-type={data._type}
    >
      {css && <style>{css}</style>}
      {children}
    </section>
  );
}
