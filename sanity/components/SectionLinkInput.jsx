import { useState } from "react";
import { useFormValue } from "sanity";
import { Button, Flex, TextInput } from "@sanity/ui";
import { CopyIcon } from "@sanity/icons";
import { sectionAnchorFromPath } from "@/lib/mg2a/sectionAnchors";
export default function SectionLinkInput(props) {
  const slug = useFormValue(["slug", "current"]);
  const [copied, setCopied] = useState(false);
  const anchor = sectionAnchorFromPath(props.path);
  const path = slug === "index" ? "/" : slug ? "/" + slug : "";
  const link = anchor ? `${path}#${anchor}` : "";
  return (
    <Flex gap={2}>
      <TextInput aria-label="Automatic section link" value={link} readOnly />
      <Button
        icon={CopyIcon}
        text={copied ? "Copied" : "Copy link"}
        disabled={!link}
        mode="ghost"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
      />
    </Flex>
  );
}
