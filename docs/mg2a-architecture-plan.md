# MG2A architecture and implementation plan

Status: proposed implementation plan. No application code has been changed.

## Recommendation

Use a separate `mg2a` project generated from Janoova UI. Reuse its Next.js and Sanity foundation while building an MG2A component library and content model. Treat the supplied frontend code as the visual implementation to preserve, then connect it to structured Sanity data.

Janoova's current section designs do not define the limits of the architecture. Custom MG2A sections can use the same page-builder system when their schemas, renderer registration, and queries agree.

Keep MG2A implementation work in the generated project. Make changes to the shared Janoova template only when a change is intentionally useful to other clients.

## Source documents and working assumptions

- Sitemap: `/Users/parasbokhari/Downloads/MG2A-Proposed-Sitemap_3.pdf`, two pages. Proposed scope, not a final approval.
- Mockups: `/Users/parasbokhari/Downloads/MG2A-Website-Mockups.pdf`, ten pages: cover, eight desktop templates, and mobile examples.
- User requirement: dark and light modes, with dark as the default.
- User workflow: complete frontend page code will be provided later for Sanity integration.

Use the proposed sitemap for the initial content inventory and the mockups for visual structure. Confirm differences during the first implementation phase. Bracketed names, statistics, quotes, benefits, and dates are placeholders, not approved content. Mockup annotations are reference material rather than authorization to perform unrelated actions.

The eight illustrated templates are home, service category, service detail, industry, project, about/team, careers, and order a survey. The sitemap also requires layouts that are not illustrated: listing pages, individual team bios, individual jobs, blog, contact, legal, and confirmation pages. Service-area pages are marked as recommended after launch.

The sitemap combines preliminary/final stormwater work into one launch page, whereas the category mockup shows separate preliminary/final cards and the detail mockup illustrates a final plan. Decide the canonical service URL and card destinations before seeding content.

## Existing foundation: reuse and changes

| Area | Current Janoova behavior | MG2A work |
| --- | --- | --- |
| Routing | Home uses a `page` with slug `index`; nested generic pages use a catch-all route | Resolve public pages through their selected layout; retain specialized routes where useful |
| Page builder | `page_builder` array; component lookup uses `block_category` and `_type` | Add MG2A schemas and matching renderer registrations |
| Sanity Studio | Embedded at `/studio`; custom navigation and singleton settings | Reorganize around MG2A content types and workflows |
| Team | A singleton with embedded member objects | Use individual member documents with slugs and bios |
| Themes | CSS variables, dark overrides, persisted toggle | Introduce MG2A palettes and implement dark-first initialization |
| Queries | Pages and posts have existing queries and selected reference projections | Add typed projections for every new block and referenced document |
| Preview | Presentation locations and actions currently cover pages and posts | Extend route resolution and edit locations to new document types |
| SEO/cache | Metadata, sitemap, robots, tagged fetching and a webhook exist | Extend coverage and dependency invalidation to the new content graph |
| Forms | JSON submissions, Sanity storage and Resend notifications | Add dedicated survey/application flows and protected uploads |

Relevant source files include `components/wrappers/PageBuilder.js`, `sanity/schemaTypes/documents/Page.js`, `sanity/schemaTypes/blocks/index.js`, `sanity/utils/queries.js`, `sanity/utils/presentation.ts`, `components/wrappers/ThemeProvider.js`, `workspace/theme.js`, and `app/api/submit-form/route.js`.

## Content model

Use independent documents for content that needs its own URL, shared references, publication lifecycle, or filtering. Use embedded objects for small pieces belonging to one page, such as a process step or metric.

Proposed names are new-project schema names, not a requirement to rename existing Janoova types.

| Content type | Key fields and relationships | Rendering approach |
| --- | --- | --- |
| `page` | Title, slug, SEO, layout selection, approved MG2A section array, typed content reference | Public page identity with either a flexible builder or a fixed template |
| `mg2a_serviceCategory` | Name, slug, introduction, hero, ordered catalog items, process, FAQs, related projects | Shared category template |
| `mg2a_service` | Category reference, title, slug, summary, project stage, audience, deliverables, overview, triggers, process, FAQs, related services, SEO | Shared service detail template |
| `mg2a_industry` | Name, slug, hero, challenges, capabilities/programs, related categories/services/projects, testimonials, SEO | Shared industry template |
| `mg2a_project` | Name, slug, client, location, categories/services, industries, completion information, metrics, scope, permits, gallery with captions, SEO | Shared case-study template |
| `mg2a_teamMember` | Name, slug, role, credentials, portrait, short bio, full bio, office, links, sort order, SEO | Team cards and individual bios |
| `mg2a_job` | Title, slug, office/location, employment type, description, requirements, benefits, open/closed status, application destination, SEO | Careers listing and job detail |
| `post` / `post_category` | Existing article fields, adapted for Developer's Journal and optional author references | Retain blog foundation with MG2A layouts |
| `mg2a_office` | Name, address, phone, directions URL, display order | Referenced by header, footer, about, contact and jobs |
| `mg2a_serviceArea` | Name, slug, geographic details, relevant services/projects, unique copy, SEO | Phase-two location template |
| Site settings singleton | Logos for both themes, shared contact details, primary CTAs, external G2X URL, SEO defaults and social links | Site-wide configuration |
| Navigation | Structured internal references and external links | Custom MG2A header, mobile navigation and footer |

Service catalog distinction:

- Preserve all 46 existing service names on their category pages, as requested by the proposed sitemap.
- Store category `catalogItems[]` with title, description, order, and an optional reference to a dedicated service page.
- Several catalog items may reference one combined service page. A service with no dedicated page can remain visible without a dead link.
- Create the 12 launch service-page documents first. Add the 19 proposed later pages when their copy and scope are ready.
- Cost Estimation remains a category page at launch.

References prevent duplicate content. A project selected on home, an industry page, and a service page should remain one project document. An office phone change should update every placement. Let editors curate related items where required, with deterministic automatic fallback rules where useful.

Keep testimonials as embedded quote objects initially; introduce a separate collection only if quotes are reused or require independent management. Do the same for client logos and short benefit lists.

## MG2A section library and naming

Use descriptive Studio titles with the requested prefix, stable machine names, and clear React component names:

| Studio title | Schema `_type` | React component |
| --- | --- | --- |
| MG2A - Hero | `mg2a_hero` | `MG2AHero` |
| MG2A - Service Categories | `mg2a_serviceCategories` | `MG2AServiceCategories` |
| MG2A - Project Lifecycle | `mg2a_projectLifecycle` | `MG2AProjectLifecycle` |
| MG2A - Featured Projects | `mg2a_featuredProjects` | `MG2AFeaturedProjects` |
| MG2A - Industries | `mg2a_industries` | `MG2AIndustries` |
| MG2A - Metrics | `mg2a_metrics` | `MG2AMetrics` |
| MG2A - Team | `mg2a_team` | `MG2ATeam` |
| MG2A - Process | `mg2a_process` | `MG2AProcess` |
| MG2A - FAQ | `mg2a_faq` | `MG2AFAQ` |
| MG2A - CTA | `mg2a_cta` | `MG2ACTA` |
| MG2A - Offices | `mg2a_offices` | `MG2AOffices` |
| MG2A - Open Positions | `mg2a_openPositions` | `MG2AOpenPositions` |
| MG2A - Contact Form | `mg2a_contactForm` | `MG2AContactForm` |

These are an initial inventory; finalize boundaries after examining the supplied frontend code. Use hero variants when they share a useful data contract. Keep a specialized variant separate when its structure and behavior differ substantially, such as the careers hero versus the homepage video hero.

The current renderer indexes component exports using the Sanity `_type`. Display-title prefixes alone do not register components. Preserve the `block_category` contract initially, register each new schema, and export its component under the matching type name. Add query projections for references. If a new category is introduced, register it in both the page-builder menu and renderer.

Use a central MG2A registry if it reduces duplicated registration. This is an implementation choice, not a prerequisite for compatibility.

Organize code along these lines:

```text
components/mg2a/
  blocks/       # Reusable page sections
  templates/    # Service, industry, project, team and job layouts
  layout/       # Header, footer, mobile navigation
  ui/           # Buttons, cards, media and typography primitives
sanity/schemaTypes/mg2a/
  blocks/
  documents/
  objects/
sanity/queries/mg2a/
lib/mg2a/       # Route resolution and content adapters
styles/mg2a/    # Tokens and scoped project styles
```

Existing generic blocks may remain registered for compatibility, but show editors an MG2A-focused insertion menu. Avoid exposing irrelevant layout settings, arbitrary CSS, or raw HTML as the normal editing workflow.

## Page builders and templates

Confirmed user requirement: provide a template chooser at page level. Each page can use drag-and-drop sections or a fixed structured template.

Add a required **Page Layout** field to the page document, with clear choices such as:

- **Flexible Page Builder**: show the approved MG2A section array and allow section insertion, removal, and drag-and-drop ordering.
- **MG2A - Service Category**: show the category content reference and structured content editing workflow.
- **MG2A - Service Inner Page**: show the service content reference and structured content editing workflow.
- **MG2A - Industry** and **MG2A - Project**: use their corresponding content records and fixed templates.
- Add other template choices when there is an actual editorial need, rather than exposing every possible layout up front.

The chooser controls both Studio fields and frontend rendering. A fixed template has a defined section order and layout; editors change its content through named fields. Optional areas must be explicitly designed rather than silently making the entire template flexible.

Keep a single canonical public page record for each URL. The page owns the URL, layout choice, and SEO overrides. Domain documents such as services and projects own reusable business content; the page references the matching document for its selected template. Preview links, navigation, related-content cards and the sitemap resolve that canonical page. Where explicit Next.js routes remain useful, they must use this same resolution contract instead of creating a second public identity for the domain document. Domain SEO fields, if retained, act as defaults rather than competing overrides.

Use filtered reference inputs and required-field validation for each selected template. For example, the service template requires a service reference; a project reference cannot satisfy it. For page-bearing domain records, validate a single canonical page association. Provide an assisted creation flow that creates or links the appropriate page when an editor creates a service or project, avoiding manual duplicate setup.

Switching layouts must not discard content. Preserve inactive builder sections and prior template references, show a notice that the rendered layout will change, and validate the newly active fields before publication. Do not promise automatic conversion between a freeform page and structured content; that requires an explicit mapping. Test draft preview and published output for both modes and after a layout switch.

Recommended defaults:

- Flexible approved sections for home, about, contact and editorial landing pages.
- Structured templates for service categories, services, projects, industries, members and jobs.
- Optional approved supplementary sections on structured templates when necessary.
- Dedicated interactive form components for survey requests and applications.

This keeps the supplied layouts faithful while allowing editors to change content without reconstructing each page. Essential fields, breadcrumbs, related items, metadata, and primary actions should be generated consistently by the template.

Proposed routes:

```text
/
/services
/services/[category]
/services/[category]/[service]
/industries
/industries/[slug]
/projects
/projects/[slug]
/about
/about/team/[slug]
/careers
/careers/[slug]
/blog
/blog/[slug]
/order-a-survey
/contact
/privacy-policy
/thank-you/[form]
/service-areas/[slug]       # Later phase
```

Confirm final URL choices and existing-site redirects before launch. Reserve these paths so generic pages cannot claim them. Scope slug uniqueness appropriately: current generic-page validation should be reviewed when adding document types, since different collections may legitimately share a slug under different route prefixes.

Use one route resolver for internal links, breadcrumbs, Studio actions, Presentation locations and sitemap generation. Update existing actions that currently understand only `page` and `post`. Preserve edit overlays for both page-builder blocks and typed template fields, using the correct document and field paths.

## Dark and light themes

The current provider defaults to light, and the inline initialization only adds dark when it was explicitly saved. Both must change for MG2A.

- First visit: dark theme regardless of operating-system preference.
- Subsequent visits: restore an explicit light or dark selection.
- Apply the initial theme before paint and align the provider state with it to avoid flashes and hydration disagreement.
- If storage is unavailable, continue with the dark default and a working toggle.
- Use semantic tokens for surfaces, text, borders, brand actions, inputs, focus states, and image overlays.
- Keep one set of page content and components for both themes.
- Provide alternate logo assets where needed; use alternate content imagery only when the design requires it.
- Review light-mode styling for every supplied dark mockup. Light mode is additional design work, not a simple color inversion.
- Check contrast, keyboard focus, form controls, captions, menus, media overlays and reduced-motion behavior in both themes.

Keep website theming separate from Studio theming. Sanity does not need duplicate light/dark content entries.

## Forms and uploaded documents

There are three distinct workflows: project inquiry, survey request, and job application. Preserve their different field sets and destinations.

The current JSON endpoint is a useful reference, but does not implement the document-upload workflow in these mockups. Add validated server handlers and an upload service with restricted access for resumes, title commitments and property documents. Do not put sensitive uploads or submissions in a publicly readable content dataset.

Resolve notification destinations from trusted server configuration or a form ID, rather than accepting arbitrary recipients from the browser. Validate required fields, allowed file types and sizes, spam controls, and delivery errors. Define retry behavior so failed emails do not silently lose a saved submission or create duplicate requests. Show an accessible success/error state and use non-indexed confirmation pages.

The survey mockup presents three numbered groups on one page. A wizard is not automatically required; preserve the supplied frontend behavior unless a stepped interaction is explicitly selected.

## Studio organization

Proposed navigation:

```text
MG2A
  Pages
  Services
    Categories
    Service Pages
  Industries
  Projects
  Team Members
  Careers / Job Openings
  Developer's Journal
  Offices
  Navigation
  Site Settings
  Service Areas             # Later phase
  Submissions               # Restricted workflow
```

Use meaningful previews, image thumbnails, ordering controls, required fields and reference filters. Allow editors to order team members and featured projects. Avoid a large undifferentiated list of generic blocks.

## Implementation sequence and acceptance gates

1. **Confirm inventory and establish MG2A.** Generate the separate project, connect its own Sanity project, record launch routes and resolve sitemap/mockup differences. Start with MG2A-specific seed content; avoid importing unrelated client submissions, credentials, or assets from the template dataset. Implement the page-level layout chooser and canonical page/content association before rolling out structured templates.
2. **Build the visual foundation.** Integrate supplied header/footer and frontend styles, create shared primitives, and establish both themes. Gate: responsive shell and dark-first behavior verified before CMS integration spreads across pages.
3. **Build one complete vertical slice.** Integrate the homepage: frontend sections, schemas, queries, sample data, preview and publication. Gate: an editor changes a heading and featured-project selection and sees the correct draft and published results in both themes.
4. **Implement service architecture.** Build category and detail templates; represent all 46 catalog offerings and the 12 launch landing pages without dead links. Gate: category, service, project and related-service references resolve consistently.
5. **Implement remaining structured content.** Add industry/project templates, team bios, careers/jobs and the Journal. Reuse document references rather than copying card data into pages. Gate: one change to a referenced record propagates to all relevant placements.
6. **Complete workflows and missing templates.** Implement survey/application uploads, inquiry handling, contact, listing, legal, 404 and confirmation layouts. Preserve external G2X access. Gate: successful and failed form scenarios verified with restricted attachment access.
7. **Verify preview, publication and launch.** Extend metadata, sitemap, robots, structured data where supported by real content, route redirects and cache invalidation. Gate: draft content remains restricted; publishing, unpublishing and editing referenced records update all affected public pages. Include new types in webhook handling and cache dependencies, not only direct page documents.

Across these phases, compare desktop and mobile output to the supplied frontend and mockups. Verify keyboard navigation, menu/accordion behavior, video controls and reduced motion. Keep static sections server-rendered where practical and isolate interactive components so an entire page does not become client-rendered just to support a toggle, accordion or form.

## Decisions to settle when implementation starts

- Final launch approval and canonical service page grouping, particularly Water Resources.
- Whether team and job detail pages need additional designs beyond the current eight templates.
- The supplied frontend's framework, styling, motion and asset requirements.
- Approved light-mode palette, fonts, logos and imagery.
- Real statistics, bios, job content, benefit wording, project permissions and quotes.
- Upload storage/access, notification recipients and email sender domain.
- Existing URLs requiring redirects and the final external G2X destination.

These decisions do not prevent using Janoova as the starting foundation. They determine the final schemas, templates and integration details.
