import { servicePageTemplate } from "./lib/mg2a/serviceDefaults";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
import schemaTypes from "@/sanity/schemaTypes";
import clientConfig from "./sanity/config/clientConfig";
import { baseUrl, organization } from "./lib/constants";
import { locations } from "./sanity/utils/presentation";
import { codeInput } from "@sanity/code-input";
import { media } from "sanity-plugin-media";
import { structure } from "./sanity/structure";
import { viewPageAction } from "./sanity/actions/viewPageAction";
import { openInEditorAction } from "./sanity/actions/openInEditorAction";
import { pastePageJsonAction } from "./sanity/actions/pastePageJsonAction";

const singletonActions = new Set(["publish", "discardChanges", "restore"]);
const singletonTypes = new Set(["mg2a_settings"]);

export default defineConfig({
  name: "default",
  title: `${organization} Studio`,
  basePath: "/studio",
  ...clientConfig,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      name: "editor",
      title: "Editor",
      previewUrl: {
        draftMode: {
          enable: `${baseUrl}/api/draft`,
        },
      },
      resolve: { locations },
    }),
    visionTool(),
    codeInput(),
    media(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => [
      ...templates.filter(
        ({ schemaType }) =>
          !singletonTypes.has(schemaType) && schemaType !== "formSubmission",
      ),
      {
        id: "mg2a-service-overview",
        title: "Service overview page",
        schemaType: "page",
        value: servicePageTemplate(0),
      },
      {
        id: "mg2a-service-detail",
        title: "Service detail page",
        schemaType: "page",
        value: servicePageTemplate(1),
      },
    ],
  },
  document: {
    // For singleton types, filter out actions that are not explicitly included
    // in the `singletonActions` list defined above
    actions: (input, context) => {
      // Submissions use a private document path and live editing. Never publish,
      // duplicate or move them into publicly readable root documents.
      if (context.schemaType === "formSubmission") return [];

      if (singletonTypes.has(context.schemaType)) {
        return input.filter(
          ({ action }) => action && singletonActions.has(action),
        );
      }
      if (
        ["page", "post", "mg2a_project", "mg2a_team", "mg2a_job"].includes(
          context.schemaType,
        )
      ) {
        return [
          ...input,
          viewPageAction,
          openInEditorAction,
          ...(context.schemaType === "page" ? [pastePageJsonAction] : []),
        ];
      }
      return input;
    },
  },
});
