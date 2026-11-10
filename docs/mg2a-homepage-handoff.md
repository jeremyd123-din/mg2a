# MG2A homepage development

The November 5 developer handoff is the visual specification. It supersedes the earlier theme plan: home defaults dark, other pages light; header and footer stay navy; visitors do not see a theme toggle. Page theme, orange accent and flip-card blue are CMS settings. No website deployment has been performed.

## Editor workflow

- Open `/studio`, then **Homepage**, or edit a page under **Pages**.
- Choose **Flexible Page Builder**. Add MG2A sections, edit content and drag to reorder. There is no Show section toggle; remove a section from the flexible builder when it is not needed. Only implemented layouts are exposed; structured service/project/industry templates belong to the next phase.
- Use **Site Settings** to edit navigation, buttons, branding, inquiry delivery, embedded offices, and SEO/analytics. Change office addresses and phone numbers under its Offices tab.
- **Service Categories**, **Projects** and **Industries** are shared records selected by homepage blocks. These are card content records in this phase, not complete destination pages.
- **Editor** in Studio enables authenticated draft preview and section overlays. Public requests use published content; publishing requires the Sanity revalidation webhook for immediate production cache updates.
- `/blocks` previews the MG2A section library.
- `npm run seed:mg2a` uploads supplied media and creates missing records. It preserves existing CMS edits. `MG2A_HANDOFF_DIR` can override the asset source directory. `lib/mg2a/assets.json` records public asset references so inserted sections can start with valid media.

The initial content is seeded into the configured `production` dataset. Site-wide indexing is controlled by Site Settings → SEO & Analytics → Disable search indexing. New pages default to allowing indexing; leave the site-wide switch enabled until launch.

## Client information still required

- **Inquiry notification recipients:** configured on each form under Forms → Notification recipients.
- **G2X Client Access URL:** currently blank. The Client Access labels are visible to match the mockup, with navigation disabled until supplied.
- **Verified sending domain/address:** the endpoint uses `MG2A_INQUIRY_FROM` or the existing Janoova sender `MG2A Inquiries <forms@janoova.com>`. Confirm sender verification and delivery in Resend before launch.
- Real statistics, approved testimonial and actual open positions. At the user’s explicit request, all supplied homepage placeholder statistics, testimonial and job listings are included in both the development homepage and its existing draft to match the mockup. Bracketed placeholders are allowed and do not prevent publishing. The Why MG2A block now includes its original statistics and testimonial fields, and the Careers block fetches the shared Open Positions records.
- High-resolution project images and MG2A drone footage. The supplied stock video and low-resolution images are uploaded to Sanity for development.
- Resolve combined preliminary/final stormwater launch-page grouping before creating service pages. The homepage card currently preserves the four offerings from the supplied homepage; it does not seed dedicated service-page URLs.

## Delivery and remaining launch work

The shared form endpoint validates submitted values against the published form, saves responses under an authenticated-only Sanity document path, and then sends Resend notifications to that form’s recipients. Email failures retain the responses and appear in the submission’s notification status. Automated checks use stub delivery; live email delivery is not tested.

The global shell, homepage, Services hub, Water Resources overview and Stormwater Management detail page are implemented. Navigation points to planned canonical URLs; their destination pages are part of later development. Header and footer links can be edited in Sanity. Do not treat this development seed as a launch-ready website.

Configure Sanity CORS for localhost and deployed origins, and a signed webhook pointing to `/api/revalidate` with `{ "_type": _type, "_id": _id }`. Include page, mg2a_settings, mg2a_project, mg2a_serviceCategory, mg2a_industry and mg2a_job. Set the server-only `SANITY_REVALIDATE_SECRET`; the older `NEXT_PUBLIC_SANITY_HOOK` remains a compatibility fallback. All homepage reference types have cache tags. Enable preview using the existing Studio Presentation integration.

## Verification completed

- Production build passed.
- Full schema (including the code-input plugin) compiled without schema errors.
- All 37 MG2A section types have matching renderers and are available in the insertion menu; the homepage uses 10 sections, with Metrics available when verified figures are supplied.
- Checked desktop rendering, 390px mobile overflow, menu opening/Escape dismissal, hero pause/play state and completed shared card lists.
- Form checks used stubbed delivery: required fields, email/header validation, field lengths, origin checks, honeypot, server-owned recipient, and delivery failure. Live email delivery remains untested.
- Studio loads its login screen without browser errors. A signed-in editor session is still required to verify editing, drag/drop and publishing in the actual Studio UI. Production webhook delivery is not yet configured or verified.

## Tailwind and per-section editing update

All MG2A header, footer, section, form and UI styles now use literal Tailwind utilities, including responsive and interaction states. The former numbered generated CSS rules have been removed. Shared brand/theme variables remain in `styles/mg2a/tokens.css`; `styles/mg2a/index.css` only imports tokens and applies Tailwind base utilities. The inherited generic Janoova components have been removed.

Every MG2A section has **Content** and **Style** tabs. Style includes optional top/bottom padding in pixels for desktop and mobile (at 980px and below), plus the library's `scoped_css` code field. Blank padding values retain the supplied design. Styles are compiled under that section's unique `data-mg2a-block` selector; editing one instance cannot target a sibling instance using ordinary nested selectors. Hero padding targets its copy container and Careers padding targets its inner content container, preserving their full-width media/backgrounds. Custom CSS may use nested selectors and media queries, for example `h2 { max-width: 650px; }`.

The hero uses **Button one** and **Button two**, each with Title and Link, and one **Trust statement** string. Editors can use `<strong>` or `<b>` in that string. Rendering discards attributes and executable tags, and removes Sanity preview annotations before parsing. The migration preserves existing published and draft values while retiring the fragmented fields and section toggles. Drafts remain drafts.

The header/footer use the exact inline logo artwork from the supplied homepage, and service icons use its seven exact SVG drawings. Comparison of the original and the developer previews at 1280px desktop and 390px phone widths measured identical heights for all ten homepage sections with the same content. The placeholders still need client replacement before launch. Client Access is displayed without an active link until its URL is supplied.

The favicon uses the exact 96×96 PNG supplied by the user from mg2a.com. Project feature/card images and the hero video use the standard Tailwind `object-cover` utility; the earlier invalid `object-[cover]` classes were removed.

## MG2A-only framework cleanup

The inherited Janoova block components/schemas, navigation document, global team/testimonial singletons, generic form/dashboard workflow, theme files, font/theme selectors, demo starters and unused UI wrappers have been removed. The site retains the Next.js/Sanity routing, metadata, sitemap, revalidation and draft-preview infrastructure it uses. Existing Journal routes now use MG2A Tailwind views. No CMS documents were deleted. Legacy static asset folders are retained, but are not used by the MG2A renderer.

Site Settings owns navigation, branding, embedded offices, indexing, default sharing image and GTM settings. `styled-components` remains a dependency because Sanity Studio requires it; the public MG2A UI does not use it.

### Adjust one section’s padding

Open **Homepage → Page Builder → the section → Style → Vertical padding**. Set **Top**, **Bottom**, **Mobile top**, or **Mobile bottom** in pixels. Leave a value blank for the approved default; `0` removes that padding. Mobile values apply at 980px and below. These settings affect only that section instance.

For more detailed changes, use that section’s **Style → Scoped CSS**, for example:

```scss
h2 {
  max-width: 650px;
}
```

Use the numeric padding controls for the hero and Careers sections: their padding belongs to an inner content container so the photograph/background remains full width. Other section roots can also be adjusted with declarations such as `padding-top: 80px;` in Scoped CSS.

### Adjust several sections on one page

Use **Pages → the page → Style → Page CSS**. This accepts nested CSS/SCSS, compiled under that page’s main-content selector. For example:

```scss
[data-block-type="mg2a_industries"] {
  padding-top: 80px;
  padding-bottom: 80px;
}
```

Page CSS affects that page only. Section-level CSS is the preferred choice for a single block. It remains attached to the block when it is reordered or copied. Neither option changes the global header or footer.

## Studio organization and launch navigation

Homepage is a shortcut to the canonical page document, not a separate schema. It is excluded from the general Pages list. Blog contains articles; Blog Categories groups those articles. Offices now live inside Site Settings. Open Positions is a shared document list: published records marked Open populate the homepage Careers section, ordered by their display order. Projects and Industries remain shared referenced records. Legacy office/SEO documents were retained in the dataset; no content was deleted.

All 37 MG2A sections have actual browser screenshots in `public/mg2a/block-previews`, used by the insertion grid and block previews. `/blocks/[type]` renders an individual section for preview maintenance.

The launch sitemap inventory is in `lib/mg2a/navigation.js`. Only Services and Industries expand, on desktop and mobile. Services includes seven category destinations and 12 launch detail destinations; Industries includes nine destinations. Projects, About and Careers are direct header links. Journal and Service Areas remain in the launch route inventory but are omitted from the header at the user’s request. Contact and Order a Survey are direct actions. Recommended-later service pages and additional counties are excluded. The two launch counties and six projects are catalogued for their future hub pages, with no additional header submenus. Dynamic team, job and article routes and system routes are documented separately in that file. Configured URLs do not create destination page content; those pages remain future development work.

Edit navigation in Site Settings → Header → Primary links. Submenu groups appear only for `/services` and `/industries`. `node --env-file=.env.local scripts/seed-mg2a-navigation.mjs` applies the launch menu with revision checks and a local backup; `scripts/migrate-mg2a-editor-model.mjs` is the one-time offices/jobs/settings migration.

### Edit footer navigation

Open **Site Settings → Footer**. **Services links** and **Company links** are separate reorderable arrays: expand a row to edit its Label and Destination, add a row for another link, or remove a row. Publish Site Settings to apply changes. Column titles, description and the footer license statement are on the same tab. Addresses/phones are under **Offices**; the shared Client Access label and URL are under **Header**. The footer matches the supplied HTML: seven service links, six company links, then Client Access.

Header spacing matches the original 1280px container and 32px navigation gap at 15px type. Both action buttons display on desktop; the mobile menu breakpoint remains 980px.

## Reusable forms and saved submissions

Open **Forms** to create or edit a form. Use **Fields (JSON)** for a strict JSON array, for example:

```json
[
  { "name": "name", "type": "text", "label": "Name", "required": true },
  { "name": "email", "type": "email", "label": "Email", "required": true },
  {
    "name": "details",
    "type": "textarea",
    "label": "Project details",
    "required": true,
    "width": 100
  }
]
```

Supported types are text, email, tel, url, number, date, textarea, select, radio, checkbox and hidden. Select/radio options can be strings or `{ "label": "Displayed text", "value": "stored-value" }` objects. `width` is 50 or 100; `isMulti` enables multiple selection on a select. Fields may set a placeholder and maxLength. Hidden fields use a defaultValue from the form definition. JavaScript expressions and executable code are not accepted. File uploads are not part of this field model.

Set notification recipients on the form (comma-separated). Leave blank for storage without email. Publish the form, then choose it under **Homepage/Pages → Contact Form → Form**. Labels, options, button text, note and confirmation/error messages belong to the reusable form; section headings, offices and styling stay with the section. All future form modules should use the same reference and renderer. The homepage’s existing field content has been migrated.

**Form Submissions** lists stored responses, source path, received time and email status. Editors can mark them new, reviewed or archived. Records use `submissions.<UUID>` IDs, which require authenticated access under Sanity’s default document-path permissions. The schema uses live editing and exposes no publishing/duplicate actions or creation templates, so records keep their private IDs. Validate any future custom role changes against this requirement. The API saves before emailing; repeat requests reuse a UUID and do not create duplicate records/notifications. Failed notifications remain visible as Failed (or Pending if the status update could not complete); there is no automatic resend queue.

`node scripts/check-mg2a-submission-access.mjs` creates and removes a non-personal access-check record to verify anonymous reads are denied. `npm run check:mg2a` tests form validation, trusted recipients, idempotency, storage failures and email failures using stubs. `node scripts/migrate-mg2a-forms.mjs` migrates old contact-block fields and moves the former site-wide recipient to reusable forms, with a backup in the temporary directory. Server-side `SANITY_TOKEN` must have permission to create/read/update `submissions.**`; `RESEND_API_KEY` and `MG2A_INQUIRY_FROM` configure email delivery on Vercel.

## Service pages and modular editing

Implemented paths: `/services`, `/services/water-resources`, and `/services/water-resources/stormwater-management-plans`. The overview and detail follow the two supplied service HTML mockups. The hub uses the existing category copy and the same service modules. The detail retains the mockup’s Final Stormwater Management Plan title while using the grouped stormwater URL already in the launch navigation. Other service destinations remain planned pages.

In **Pages**, choose **Service overview page** or **Service detail page** when creating a page. Each is a starting arrangement of editable modules, with indexing allowed by default and the site-wide indexing switch still respected. The seed command `node scripts/seed-mg2a-services.mjs` only creates missing records and does not overwrite edits.

A detail page has a separate **Service hero**, **Service content**, and **Service inquiry form**. Open **Service content → Content sections** to add, remove or drag text, checklists, deliverables, process steps, FAQs and related services into order. **Overview text → Text** is a rich-text editor with paragraphs, bold/italic, links and lists. The desktop contents menu is generated from the child sections and follows their order. Its title and extra links are editable on the parent. Child sections may override their **Contents menu label** under Style. Anchors are generated automatically. Related services are omitted from the menu unless given an explicit menu label. On mobile the sidebar is hidden and all content remains in its reading order.

All module rows show the module’s name, followed by its content heading/eyebrow as the description. Use the existing **Open in Editor** page action for Sanity Presentation; existing visual-editing attributes now retain nested child section paths. Standard Sanity drag handles, duplicate/remove actions, screenshot selection, and Content/Style tabs remain available. This uses Sanity’s editor and editing capabilities; it is not a pixel-for-pixel recreation of HubSpot’s editor.

Thirteen service modules extended the service library to 24 module types (now 37 including project/industry modules). Each has a real screenshot. Child padding and scoped CSS target a parent-and-child instance identity so one nested section does not style another parent’s copy. First-child spacing is normalized to zero unless explicitly set. Service inquiry forms use **Forms** and the existing private submission handler, including per-form recipients. Shared project cards fetch the selected project and allow page-specific descriptions.

The 404 page is dark with generous top padding. The non-homepage header spacer now has explicit desktop/mobile heights; it previously had an unstyled class name. Production route checks cover the three service pages and missing page/blog routes. A signed-in Studio session is still required for end-to-end verification of editing and publishing through the actual editor.

## Editor simplification and heading inspection

The module-label field and extra Page modules instructions have been removed. The insertion library has **Homepage & shared**, **Service overview**, and **Service inner** groups; shared service layouts appear in both relevant groups. The standard editor actions remain available.

Every section receives a stable `section-<key>` anchor. Nested anchors include their parent’s key so copies in different parents remain distinct. **Style → Section link** shows the generated page/fragment link with a Copy link button; no editable anchor value is needed. Renaming or reordering a section leaves its fragment unchanged. Older named anchors remain as invisible compatibility targets, including the existing navigation links. The retired anchor field is hidden to preserve those legacy links; removed module-label metadata can be cleaned with `node scripts/migrate-mg2a-module-editor.mjs`.

Append `?show_heading_tags=true` to a public page URL to display red `[H1]`–`[H6]` labels beside every heading. Normal URLs display none. The client helper also labels headings added after navigation and removes its labels when the option is disabled; it does not change CMS content or stored headings.

## Projects, industries and survey requests

**Projects** remains a dedicated content type. Each project owns its URL slug, shared card image/copy, display order, SEO fields and Page Builder. New projects start with a photo hero, story and related-project grid; the hero inherits the project’s title/image unless explicitly overridden. Publishing a project adds its detail URL and its overview card automatically. The `/projects` page contains a simple hero and a dynamic project grid. The Bradley Commons detail page follows its supplied HTML, including facts, numbers, story/sidebar, plans and related projects. The other existing projects have editable starter detail layouts built from their existing approved descriptions.

**Industries** are standard **Pages** with **Page category → Industry**, a listing title/description and display order. `/industries` queries published industry pages automatically. Municipalities follows the supplied industry HTML; the remaining eight migrated industry pages start with a simple hero and reusable inquiry section, ready for client-specific content. Homepage industry references now target these page records. The retired industry schema/sidebar entry is removed; original Content Lake records remain archived as legacy data without deleting them.

New module groups include **Projects**, **Industries**, and **Forms**. The library now has 37 modules and screenshot previews. Modules retain automatic section links, stable names/headings and independent styling. `node scripts/seed-mg2a-expansion.mjs` creates missing pages/forms and fills only missing project fields; it preserves existing page-builder content and migrates homepage industry references. It saves a temporary backup before migrating.

**Order a Survey** is a modular page using its supplied three-group form. Its JSON form is editable under **Forms → Survey request**, including group labels, fields/options, confirmation text and notification recipients. `group` organizes fields into labeled fieldsets. Optional document fields use type `file` and `multiple: true`. PDF, JPEG, PNG and TIFF files are accepted, up to three files and 3 MB total. Client and server validate the limit; the server also checks file signatures. Submissions and document chunks commit together under authenticated-only `submissions.*` IDs. Documents never enter public Sanity file/image assets. Authenticated editors download them from **Form Submissions → Documents**. The Client Access link uses the existing global URL and remains inactive when blank.

`node scripts/check-mg2a-expansion.mjs` verifies dynamic publishing and multipart/private storage using temporary non-personal fixtures, with notifications disabled and cleanup in a finally block. It checks that anonymous API users cannot read the response or document chunks and that downloaded chunks reconstruct the original bytes. No live email is sent. A signed-in Studio session is still required to exercise the actual editor download button. Enable project/page revalidation webhook events for production caches; project types are included in sitemap revalidation.

## About, Team, Careers and job pages (2026-11-10)

About and Careers follow their supplied HTML layouts using Tailwind modules. New library groups are **About & Team** and **Careers & Jobs**. All eleven new modules have screenshot previews, Content/Style controls, stable section links, desktop/mobile padding and scoped CSS. Existing page-builder conventions remain unchanged.

**Team** is a document type with a name, slug, role, portrait, biography, optional contact details, display order, SEO and flexible page builder. URLs are `/about/{slug}` per the user’s request. Published Team records populate About automatically. Eight starter records reflect the handoff’s grid; bracketed names, titles and biographies need client content.

**Open Positions** retains existing records and adds slugs, introductions, rich-text job descriptions, SEO and a flexible page builder. URLs are `/careers/{slug}`. Publishing an open position adds it to the Careers overview and homepage Careers block. Closing it removes it from those lists and sitemap, displays a closed message on its detail page and refuses new applications server-side. Careers itself has no form. Its graduate CTA leads to the current openings.

The reusable **Job application** Form selects **Submission type → Job application**. Notification recipients live on that Form. Applications require a published open position that references that form; the server records the verified position title. Resume fields use `"accept": "resume"` in the JSON definition to allow PDF, DOC or DOCX. Other document fields retain PDF/image formats. The same private submission/chunk storage applies to resumes; no public Sanity assets are created. The limit remains three documents / 3 MB total. The starter application requires one resume. Email notifications contain responses; resume downloads remain in authenticated Form Submissions.

`seed-mg2a-company.mjs` backs up current records and creates missing pages, starter Team records and the application Form. It fills only missing job editor fields, preserves draft/published state and updates legacy job links to canonical detail URLs. The normal MG2A seed includes this migration. New pages inherit index-enabled defaults; Site Settings retains the global noindex switch.

Team and jobs are integrated with Presentation, View Page, Open in Editor, sitemap and revalidation tags. Publishing webhooks must include `mg2a_team` and `mg2a_job`, in addition to the existing page/project/form types. Signed webhook and private application storage checks are in `scripts/check-mg2a-company.mjs`; these use disposable synthetic records with email disabled and remove them afterward.

The fixed-header spacer and document background are navy, preventing a light strip while the header shrinks over light pages. Industry/project detail heroes include their linked parent breadcrumb, including starter pages that use the simple Page hero. Industry listing cards contain only a heading and optional description; they have no arrows and use natural card heights.

The current missing-route count and content-completion tasks are tracked in [mg2a-remaining-pages.md](./mg2a-remaining-pages.md). Refresh it with `node scripts/report-mg2a-pages.mjs` after building additional pages.

Shared form select fields now use a searchable combobox built with Radix Popover and cmdk (the shadcn composition). The form still stores the JSON option values, supports `isMulti`, keeps the previous first-option default and restores defaults after a successful submission. Search, arrow keys, Enter, Escape, outside-click dismissal and selected indicators are supported. File inputs use the handoff’s dashed container and blue native file-picker button, retaining filename display and private upload behavior.
