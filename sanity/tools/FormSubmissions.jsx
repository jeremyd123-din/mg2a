"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient, useCurrentUser } from "sanity";
import { useRouter } from "sanity/router";
import {
  selectedSubmission,
  submissionShareUrl,
} from "@/lib/forms/submissionLinks";
import {
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  Select,
  Spinner,
  Stack,
  Text,
  TextInput,
} from "@sanity/ui";
import { SearchIcon } from "@sanity/icons/Search";
import { RefreshIcon } from "@sanity/icons/Refresh";
import { ArrowLeftIcon } from "@sanity/icons/ArrowLeft";
import { ArrowRightIcon } from "@sanity/icons/ArrowRight";
import { CopyIcon } from "@sanity/icons/Copy";
import { submissionIdentity } from "@/lib/forms/submissionIdentity";
import {
  submissionsQuery,
  submissionQueryParams,
  SUBMISSIONS_PAGE_SIZE,
} from "@/lib/forms/submissionQueries";
import SubmissionResponsesInput from "../components/SubmissionResponsesInput";
import SubmissionAttachmentsInput from "../components/SubmissionAttachmentsInput";
const statusLabels = { new: "New", reviewed: "Reviewed", archived: "Archived" };
const cell = {
  padding: "16px",
  textAlign: "left",
  borderBottom: "1px solid var(--card-border-color,rgba(127,127,127,.2))",
  verticalAlign: "middle",
};
function received(value) {
  const d = new Date(value);
  return value && !Number.isNaN(d.getTime()) ? d.toLocaleString() : "—";
}
export function rowIdentity(row) {
  const legacy = submissionIdentity(row.identityFields || row.fields);
  return {
    name: row.submitter_name || legacy.name,
    email: row.submitter_email || legacy.email,
  };
}
export function SubmissionsTable({ items = [], onOpen }) {
  return (
    <Card border radius={2} style={{ overflowX: "auto" }}>
      <table
        aria-label="Form submissions"
        style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}
      >
        <thead>
          <tr>
            {["Name", "Form", "Received", "Status", "Email"].map((label) => (
              <th key={label} scope="col" style={cell}>
                <Text size={1} weight="semibold">
                  {label}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row) => {
            const identity = rowIdentity(row);
            return (
              <tr
                key={row._id}
                onClick={() => onOpen(row._id)}
                style={{ cursor: "pointer" }}
              >
                <td style={cell}>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpen(row._id);
                    }}
                    style={{
                      padding: 0,
                      border: 0,
                      background: "none",
                      color: "inherit",
                      font: "inherit",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <Text size={1} weight="semibold">
                      {identity.name || identity.email || "View submission"}
                    </Text>
                  </button>
                </td>
                <td style={cell}>
                  <Text size={1}>{row.form_title || "Form submission"}</Text>
                </td>
                <td style={cell}>
                  <Text size={1} muted>
                    {received(row.submitted_at)}
                  </Text>
                </td>
                <td style={cell}>
                  <Badge tone={row.status === "new" ? "primary" : "default"}>
                    {statusLabels[row.status] || row.status || "New"}
                  </Badge>
                </td>
                <td style={cell}>
                  <Text size={1} muted>
                    {identity.email || "—"}
                  </Text>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
export function SubmissionDetail({ id, client, onClose, onUpdated }) {
  const [record, setRecord] = useState(null),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false),
    [copyStatus, setCopyStatus] = useState("");
  useEffect(() => {
    let active = true;
    client
      .getDocument(id)
      .then((doc) => {
        if (!active) return;
        if (
          doc?._type !== "formSubmission" ||
          !doc._id.startsWith("submissions.")
        )
          throw new Error();
        setRecord(doc);
      })
      .catch(() => {
        if (active)
          setError(
            "Unable to load this submission. Check your access and try again.",
          );
      });
    return () => {
      active = false;
    };
  }, [id, client]);
  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(
        submissionShareUrl(window.location.href),
      );
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Unable to copy. Copy the URL from your address bar.");
    }
  }
  async function changeStatus(status) {
    setSaving(true);
    setError("");
    try {
      const updated = await client
        .patch(id)
        .ifRevisionId(record._rev)
        .set({ status })
        .commit();
      setRecord(updated);
      onUpdated();
    } catch {
      setError(
        "Unable to update the status. Check your permissions or reopen this entry to load the latest version.",
      );
    } finally {
      setSaving(false);
    }
  }
  const identity = record ? rowIdentity(record) : {};
  return (
    <Dialog
      id="submission-details"
      header={identity.name || identity.email || "Submission details"}
      width={2}
      onClose={onClose}
      onClickOutside={onClose}
    >
      <Box padding={4}>
        <Stack space={4}>
          {error && (
            <Card padding={3} tone="critical" radius={2}>
              <Text size={1} role="alert">
                {error}
              </Text>
            </Card>
          )}
          {!record && !error && (
            <Flex align="center" gap={3}>
              <Spinner />
              <Text>Loading submission…</Text>
            </Flex>
          )}
          {record && (
            <>
              <Flex gap={3} align="center" wrap="wrap">
                <Button
                  icon={CopyIcon}
                  text={copyStatus === "Copied" ? "Copied" : "Copy URL"}
                  mode="ghost"
                  onClick={copyUrl}
                />
                <Text size={1} muted role="status">
                  {copyStatus !== "Copied"
                    ? copyStatus
                    : "Link copied. Sanity sign-in is required to view this entry."}
                </Text>
              </Flex>
              <Flex
                wrap="wrap"
                gap={4}
                align="flex-end"
                justify="space-between"
              >
                <Stack space={3}>
                  <Heading size={1}>
                    {record.form_title || "Form submission"}
                  </Heading>
                  <Text size={1} muted>
                    {received(record.submitted_at)}
                  </Text>
                  {record.page_url && (
                    <Text size={1} muted>
                      Page: {record.page_url}
                    </Text>
                  )}
                </Stack>
                <Stack space={2}>
                  <Text size={1} weight="medium">
                    Status
                  </Text>
                  <Select
                    aria-label="Submission status"
                    value={record.status || "new"}
                    disabled={saving}
                    onChange={(event) =>
                      changeStatus(event.currentTarget.value)
                    }
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </Stack>
              </Flex>
              <Stack space={3}>
                <Heading size={1}>Responses</Heading>
                <SubmissionResponsesInput value={record.fields} />
              </Stack>
              <Stack space={3}>
                <Heading size={1}>Documents</Heading>
                <SubmissionAttachmentsInput value={record.attachments} />
              </Stack>
              <Text size={1} muted>
                Email notification:{" "}
                {{
                  pending: "Pending",
                  sent: "Sent",
                  failed: "Failed",
                  disabled: "Not requested",
                }[record.notification_status] || "Not requested"}
              </Text>
            </>
          )}
        </Stack>
      </Box>
    </Dialog>
  );
}
export default function FormSubmissions() {
  const router = useRouter();
  const selected = selectedSubmission(router.state);
  const openSubmission = useCallback(
    (id) => router.navigate({ ...router.state, submission: id || undefined }),
    [router],
  );
  const baseClient = useClient({ apiVersion: "2025-02-19" }),
    user = useCurrentUser();
  const client = useMemo(
    () => baseClient.withConfig({ useCdn: false, perspective: "raw" }),
    [baseClient],
  );
  const [search, setSearch] = useState(""),
    [debounced, setDebounced] = useState(""),
    [formId, setFormId] = useState(""),
    [status, setStatus] = useState(""),
    [page, setPage] = useState(0),
    [refresh, setRefresh] = useState(0);
  const [result, setResult] = useState({ items: [], forms: [], total: 0 }),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(search);
      setPage(0);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    setError("");
    client
      .fetch(
        submissionsQuery,
        submissionQueryParams({ search: debounced, formId, status, page }),
      )
      .then((data) => {
        if (!active) return;
        if (page > 0 && data.total <= page * SUBMISSIONS_PAGE_SIZE) {
          setPage(
            Math.max(0, Math.ceil(data.total / SUBMISSIONS_PAGE_SIZE) - 1),
          );
          return;
        }
        setResult(data);
      })
      .catch(() => {
        if (active)
          setError(
            "Unable to load submissions. Check your Sanity access and try again.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [client, user, debounced, formId, status, page, refresh]);
  const reload = useCallback(() => setRefresh((value) => value + 1), []);
  if (!user)
    return (
      <Card padding={4}>
        <Text>Sign in to Sanity to view form submissions.</Text>
      </Card>
    );
  const start = result.total ? page * SUBMISSIONS_PAGE_SIZE + 1 : 0,
    end = Math.min((page + 1) * SUBMISSIONS_PAGE_SIZE, result.total);
  return (
    <Card style={{ height: "100%", overflow: "auto" }}>
      <Box padding={[3, 4, 5]} style={{ maxWidth: 1600, margin: "0 auto" }}>
        <Stack space={4}>
          <Flex wrap="wrap" gap={3} align="center" justify="space-between">
            <Stack space={3}>
              <Heading size={3}>Form submissions</Heading>
              <Text size={1} muted>
                Search entries, review responses and download submitted
                documents.
              </Text>
            </Stack>
            <Button
              icon={RefreshIcon}
              text="Refresh"
              mode="ghost"
              onClick={reload}
              disabled={loading}
            />
          </Flex>
          <Flex wrap="wrap" gap={3} align="center">
            <Box flex={1} style={{ minWidth: 220 }}>
              <TextInput
                aria-label="Search submissions"
                icon={SearchIcon}
                placeholder="Search names, email or responses…"
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
              />
            </Box>
            <Box style={{ minWidth: 200 }}>
              <Select
                aria-label="Filter by form"
                value={formId}
                onChange={(event) => {
                  setFormId(event.currentTarget.value);
                  setPage(0);
                }}
              >
                <option value="">All forms</option>
                {result.forms.map((form) => (
                  <option key={form._id} value={form._id}>
                    {form.title || "Untitled form"}
                  </option>
                ))}
              </Select>
            </Box>
            <Box style={{ minWidth: 160 }}>
              <Select
                aria-label="Filter by status"
                value={status}
                onChange={(event) => {
                  setStatus(event.currentTarget.value);
                  setPage(0);
                }}
              >
                <option value="">All statuses</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>
          {error && (
            <Card padding={4} radius={2} tone="critical">
              <Text role="alert">{error}</Text>
            </Card>
          )}
          {loading ? (
            <Flex
              padding={5}
              gap={3}
              align="center"
              justify="center"
              role="status"
            >
              <Spinner />
              <Text>Loading submissions…</Text>
            </Flex>
          ) : (
            !error && (
              <>
                {result.items.length ? (
                  <SubmissionsTable
                    items={result.items}
                    onOpen={openSubmission}
                  />
                ) : (
                  <Card border padding={5} radius={2}>
                    <Stack space={3}>
                      <Heading size={1}>
                        {debounced || formId || status
                          ? "No matching submissions"
                          : "No submissions yet"}
                      </Heading>
                      <Text size={1} muted>
                        {debounced || formId || status
                          ? "Try another search or clear the filters."
                          : "New form submissions will appear here."}
                      </Text>
                    </Stack>
                  </Card>
                )}
                <Flex
                  wrap="wrap"
                  align="center"
                  justify="space-between"
                  gap={3}
                >
                  <Text size={1} muted role="status">
                    {start}–{end} of {result.total} submissions
                  </Text>
                  <Flex gap={2}>
                    <Button
                      icon={ArrowLeftIcon}
                      text="Previous"
                      mode="ghost"
                      disabled={!page}
                      onClick={() => setPage((value) => value - 1)}
                    />
                    <Button
                      iconRight={ArrowRightIcon}
                      text="Next"
                      mode="ghost"
                      disabled={end >= result.total}
                      onClick={() => setPage((value) => value + 1)}
                    />
                  </Flex>
                </Flex>
              </>
            )
          )}
        </Stack>
      </Box>
      {selected && (
        <SubmissionDetail
          key={selected}
          id={selected}
          client={client}
          onClose={() => openSubmission(null)}
          onUpdated={reload}
        />
      )}
    </Card>
  );
}
