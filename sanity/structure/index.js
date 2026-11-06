import { DocumentsIcon } from "@sanity/icons";
export const structure = (S) =>
  S.list()
    .title("MG2A")
    .items([
      S.listItem()
        .title("Homepage")
        .child(S.document().schemaType("page").documentId("mg2a-homepage")),
      S.documentTypeListItem("page").title("Pages").icon(DocumentsIcon),
      S.listItem()
        .title("Global Header & Footer")
        .child(
          S.document().schemaType("mg2a_settings").documentId("mg2a-settings"),
        ),
      S.documentTypeListItem("mg2a_serviceCategory").title(
        "Service Categories",
      ),
      S.documentTypeListItem("mg2a_project").title("Projects"),
      S.documentTypeListItem("mg2a_industry").title("Industries"),
      S.documentTypeListItem("mg2a_office").title("Offices"),
      S.divider(),
      S.documentTypeListItem("post").title("Developer’s Journal"),
      S.documentTypeListItem("post_category").title("Journal Categories"),
      S.divider(),
      S.listItem()
        .title("SEO & Analytics")
        .child(
          S.document().schemaType("site_settings").documentId("site_settings"),
        ),
    ]);
