import { StructureResolver } from "sanity/structure";
import { VscMultipleWindows, VscServerProcess } from "react-icons/vsc";
import { MdArticle } from "react-icons/md";
import { FormSubmissionsLink } from "./FormSubmissionsLink";

export const structure = (S) =>
  S.list()
    .title("MG2A")
    .items([
      S.listItem().title("Homepage").child(S.document().schemaType("page").documentId("mg2a-homepage")),
      S.documentTypeListItem("page").title("Pages").icon(VscMultipleWindows),
      S.listItem().title("Global Header & Footer").child(S.document().schemaType("mg2a_settings").documentId("mg2a-settings")),
      S.documentTypeListItem("mg2a_serviceCategory").title("Service Categories"),
      S.documentTypeListItem("mg2a_project").title("Projects"),
      S.documentTypeListItem("mg2a_industry").title("Industries"),
      S.documentTypeListItem("mg2a_office").title("Offices"),
      S.documentTypeListItem("post").title("Posts"),
      S.documentTypeListItem("post_category").title("Post Categories"),
      S.documentTypeListItem("global_testimonials").title("Testimonials"),
      S.listItem()
        .title("Team Members")
        .id("global_team")
        .child(
          S.document()
            .schemaType("global_team")
            .documentId("global_team")
        ),
      S.divider(),
      S.documentTypeListItem("form").title("Forms"),
      S.listItem()
        .title("Form Submissions")
        .id("form-submissions-dashboard")
        .child(S.component(FormSubmissionsLink).title("Form Submissions")),
      S.documentTypeListItem("navigation").title("Navigation"),
      S.divider(),
      // Singletons
      S.listItem()
        .title("Site Settings")
        .id("site_settings")
        .child(
          S.document().schemaType("site_settings").documentId("site_settings")
        ),
    ]);
