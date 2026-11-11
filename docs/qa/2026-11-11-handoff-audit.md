# MG2A handoff audit — November 11, 2026

Compared all eight supplied HTML templates with their corresponding Next.js pages at matching desktop (1470 × 900) and mobile (390 × 844) viewports. Checked section composition, headings, font loading, card grids, image sizing/cropping, spacing, and horizontal overflow. All eight mobile pages rendered without horizontal overflow. This is a layout audit, rather than a claim of pixel-identical screenshots for CMS content that differs.

| Handoff template | Site route | Corrections / checks |
| --- | --- | --- |
| Homepage | `/` | Card image focus and category color; existing SVG artwork, headings, grids and cover sizing checked. |
| Water resources | `/services/water-resources` | Hero column proportions, process typography, related-project crops, FAQ typography. |
| Stormwater management plan | `/services/water-resources/stormwater-management-plans` | Hero proportions, nested article sections, automatically generated navigation and scroll highlighting. |
| Municipalities | `/industries/municipalities` | Hero photo focus/gradient, trust-strip artwork, typography and support layouts. |
| Bradley Commons | `/projects/bradley-commons` | Related-project heading/link row restored; project crop controls shared across listing cards. |
| About | `/about` | Team eyebrow/heading grouped on the left, CTA on the right; feature grid, client heading, offices and Careers CTA checked. |
| Careers | `/careers` | Hero typography, feature cards, two-column benefits grid and graduate CTA. |
| Order a survey | `/order-a-survey` | Hero and form composition checked; comboboxes, file control, required indicators and submitting state retained. |

Approved differences retained: editable rich-text paragraph styling; standardized section padding controls; requested service-style industry cards and descriptions; parent breadcrumbs; searchable form comboboxes; job application forms on individual jobs; global navigation changes; CMS-driven names, project titles and descriptions. The handoff’s placeholder underlines remain editorial annotations, rather than a new frontend treatment.

Refreshed 47 module screenshots in `public/mg2a/block-previews/`. The unchanged Metrics module is not instantiated in these templates and retains its existing preview. `block-preview-manifest.json` records source routes; when a type has multiple entries, the last entry is the saved variant. Long modules are cropped to their first 1800 pixels for library previews.

## Navigation and submission links

“On this page” is derived from the nested section titles/navigation labels and stable module IDs. Reordering, adding or renaming modules updates the list. The active link follows scrolling and uses `aria-current="location"`; its threshold follows the fixed header. Verified in the production browser: clicking FAQ lands beneath the header and highlights FAQ; scrolling back changes the active link to What’s included.

Submission details use `/studio/form-submissions/submissions.<id>` with a Copy URL button. Tested the actual table/detail components and Sanity router using synthetic local data: opening changes the URL, copying produces that URL, closing returns to the list, browser Back reopens the record, and reload opens the same record. Real private records were not exposed to this fixture. The production Studio route remains noindex/nofollow; the local production test origin reaches Sanity’s origin-registration boundary. A real signed-in production Studio session was not available for this browser check. Existing authenticated storage/search tests passed against Sanity, with test records cleaned up and notifications disabled.

Frontend route links continue using the existing anchors. These currently cause full document navigation. Server rendering and client-side navigation are separate choices: adopting Next.js Link would allow soft navigation without giving up server rendering. No navigation conversion was requested.

## Dependency and production verification

All direct dependencies matched npm’s latest stable releases at the final check, including Next.js 16.4.6, Sanity 6.23.0 and React 19.3.1. Migrated Studio icon imports to the new subpath API. Pinned development Node to 22.23.4 in `.nvmrc`, with a minimum of 22.20.0 for the dependency tree. Scoped compatible overrides patch the Sanity CLI’s pinned YAML/TOML parsers.

Passed `npm run build`, `npm run check:mg2a`, production route checks (14 successful pages and four expected 404s), native router/section-navigation unit checks, and the private upload/search verification (10 files totaling 4 MB). No notification emails were sent. `npm outdated` returned an empty result. Final npm audit: zero high/critical findings; 13 moderate findings remain in transitive CLI and typography dependencies. Do not apply npm’s forced Sanity downgrade as an upgrade fix.

Two missing presentation defaults were populated in Sanity with revision guards and backups: the About Careers CTA eyebrow and Courtyards project-card focus/color. Existing populated editor values were preserved.
