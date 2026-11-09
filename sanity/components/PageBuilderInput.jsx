import { useFormValue } from "sanity";
import { Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { EditIcon } from "@sanity/icons";
export default function PageBuilderInput(props) {
  const slug = useFormValue(["slug", "current"]);
  const preview = slug === "index" ? "/" : slug ? "/" + slug : null;
  return (
    <Stack space={3}>
      <Card padding={3} radius={2} border tone="transparent">
        <Flex gap={3} align="center" justify="space-between">
          <Stack space={2}>
            <Text size={1} weight="semibold">
              Page modules
            </Text>
            <Text size={1} muted>
              Add modules, drag to reorder, and select a module to edit its
              Content or Style.
            </Text>
          </Stack>
          {preview && (
            <Button
              as="a"
              href={"/studio/editor?preview=" + encodeURIComponent(preview)}
              text="Edit visually"
              icon={EditIcon}
              mode="ghost"
              fontSize={1}
            />
          )}
        </Flex>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  );
}
