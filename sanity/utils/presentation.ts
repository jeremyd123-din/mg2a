import { DocumentLocationResolver } from "sanity/presentation";
import { map } from "rxjs";

export const locations: DocumentLocationResolver = (params, context) => {
  if (
    ["mg2a_settings", "mg2a_job", "mg2a_serviceCategory"].includes(params.type)
  ) {
    return { locations: [{ title: "Homepage", href: "/" }] };
  }
  if (["page", "post", "mg2a_project"].includes(params.type)) {
    const doc$ = context.documentStore.listenQuery(
      `*[_id == $id][0]{title,slug}`,
      params,
      { perspective: "previewDrafts" },
    );

    return doc$.pipe(
      map((doc) => {
        if (!doc?.slug?.current) return null;

        const directory =
          params.type === "post"
            ? "/blog"
            : params.type === "mg2a_project"
              ? "/projects"
              : "";
        const slug = doc.slug.current;
        const path = slug === "index" ? "/" : `/${slug}`;

        return {
          locations: [
            {
              title: doc.title || "Untitled",
              href: [directory, path].filter(Boolean).join(""),
            },
          ],
        };
      }),
    );
  }

  return null;
};
