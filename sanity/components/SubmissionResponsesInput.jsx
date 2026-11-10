import { Card, Text } from "@sanity/ui";
function answer(value) {
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value))
    return value.length ? value.map(answer).join(", ") : "—";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}
const cell = {
  padding: "14px 16px",
  textAlign: "left",
  verticalAlign: "top",
  borderBottom: "1px solid var(--card-border-color,rgba(127,127,127,.2))",
};
export default function SubmissionResponsesInput({ value = [] }) {
  if (!value.length)
    return (
      <Text size={1} muted>
        No responses recorded.
      </Text>
    );
  return (
    <Card border radius={2} style={{ overflowX: "auto" }}>
      <table
        aria-label="Submitted responses"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr>
            <th scope="col" style={{ ...cell, width: "32%" }}>
              <Text size={1} weight="semibold">
                Field
              </Text>
            </th>
            <th scope="col" style={cell}>
              <Text size={1} weight="semibold">
                Response
              </Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {value.map((field, index) => (
            <tr key={field._key || field.name || index}>
              <th scope="row" style={cell}>
                <Text
                  size={1}
                  weight="medium"
                  style={{ overflowWrap: "anywhere" }}
                >
                  {field.label || field.name || "Field"}
                </Text>
              </th>
              <td style={cell}>
                <Text
                  size={1}
                  style={{
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    lineHeight: 1.6,
                  }}
                >
                  {answer(field.value)}
                </Text>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
