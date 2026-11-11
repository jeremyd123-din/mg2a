import { DocumentsIcon } from "@sanity/icons/Documents";
export const structure = (S) =>
  S.list()
    .title("MG2A")
    .items([
      S.listItem()
        .title("Homepage")
        .child(S.document().schemaType("page").documentId("mg2a-homepage")),
      S.documentTypeListItem("page")
        .title("Pages")
        .icon(DocumentsIcon)
        .child(
          S.documentList()
            .title("Pages")
            .schemaType("page")
            .filter(
              '_type == "page" && slug.current != "index" && !(_id in ["mg2a-homepage", "drafts.mg2a-homepage"])',
            ),
        ),
      S.listItem()
        .title("Site Settings")
        .child(
          S.document().schemaType("mg2a_settings").documentId("mg2a-settings"),
        ),
      S.documentTypeListItem("mg2a_serviceCategory").title(
        "Service Categories",
      ),
      S.documentTypeListItem("mg2a_project").title("Projects"),
      S.documentTypeListItem("mg2a_team").title("Team"),
      S.documentTypeListItem("mg2a_job").title("Open Positions"),
      S.divider(),
      S.documentTypeListItem("post").title("Blog"),
      S.documentTypeListItem("post_category").title("Blog Categories"),
      S.divider(),
      S.documentTypeListItem("form").title("Forms"),
      S.listItem()
        .title("Form Submissions")
        .child(
          S.documentList()
            .title("Form Submissions")
            .schemaType("formSubmission")
            .filter(
              '_type == "formSubmission" && _id in path("submissions.**")',
            )
            .defaultOrdering([{ field: "submitted_at", direction: "desc" }]),
        ),
    ]);
