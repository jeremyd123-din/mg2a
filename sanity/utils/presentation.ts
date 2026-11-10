import { DocumentLocationResolver } from "sanity/presentation";
import { map } from "rxjs";

export const locations: DocumentLocationResolver = (params, context) => {
  if (["mg2a_settings", "mg2a_serviceCategory"].includes(params.type)) {
    return { locations: [{ title: "Homepage", href: "/" }] };
  }
  if (
    ["page", "post", "mg2a_project", "mg2a_team", "mg2a_job"].includes(
      params.type,
    )
  ) {
    const doc$ = context.documentStore.listenQuery(
      `*[_id == $id][0]{title,slug}`,
      params,
      { perspective: "previewDrafts" },
    );

    return doc$.pipe(
      map((doc) => {
        if (!doc?.slug?.current) return null;

        const directory =
          (
            {
              post: "/blog",
              mg2a_project: "/projects",
              mg2a_team: "/about",
              mg2a_job: "/careers",
            } as Record<string, string>
          )[params.type] || "";
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
