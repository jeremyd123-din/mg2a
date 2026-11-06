# MG2A homepage development

The November 5 developer handoff is the visual specification. It supersedes the earlier theme plan: home defaults dark, other pages light; header and footer stay navy; visitors do not see a theme toggle. Page theme, orange accent and flip-card blue are CMS settings. No website deployment has been performed.

## Editor workflow

- Open `/studio`, then **Homepage**, or edit a page under **Pages**.
- Choose **Flexible Page Builder**. Add MG2A sections, edit content and drag to reorder. There is no Show section toggle; remove a section from the flexible builder when it is not needed. Only implemented layouts are exposed; structured service/project/industry templates belong to the next phase.
- Use **Global Header & Footer** to edit navigation, buttons, branding, office selection, and the inquiry recipient. Edit **Offices** to change a phone or address everywhere it is referenced.
- **Service Categories**, **Projects** and **Industries** are shared records selected by homepage blocks. These are card content records in this phase, not complete destination pages.
- **Editor** in Studio enables authenticated draft preview and section overlays. Public requests use published content; publishing requires the Sanity revalidation webhook for immediate production cache updates.
- `/blocks` previews the MG2A section library.
- `npm run seed:mg2a` uploads supplied media and creates missing records. It preserves existing CMS edits. `MG2A_HANDOFF_DIR` can override the asset source directory. `lib/mg2a/assets.json` records public asset references so inserted sections can start with valid media.

The initial content is seeded into the configured `production` dataset. Both site and homepage indexing are disabled during development. Review and enable indexing at launch.

## Client information still required

- **Final inquiry destination:** currently `parasbokhari@gmail.com` for development, editable in Global Header & Footer → Inquiries.
- **G2X Client Access URL:** currently blank. Header/footer links remain hidden until supplied.
- **Verified sending domain/address:** the endpoint uses `MG2A_INQUIRY_FROM` or the existing Janoova sender `MG2A Inquiries <forms@janoova.com>`. Confirm sender verification and delivery in Resend before launch.
- Real statistics, approved testimonial and actual open positions. The supplied placeholders are restored in the existing homepage draft and developer section-library preview only; the published homepage retains no placeholder facts. Schema validation prevents publishing bracketed placeholders. The Why MG2A block now includes its original statistics and testimonial fields, and the Careers block includes the original positions array.
- High-resolution project images and MG2A drone footage. The supplied stock video and low-resolution images are uploaded to Sanity for development.
- Resolve combined preliminary/final stormwater launch-page grouping before creating service pages. The homepage card currently preserves the four offerings from the supplied homepage; it does not seed dedicated service-page URLs.

## Delivery and remaining launch work

The homepage inquiry endpoint validates fixed fields, resolves its recipient from server-side CMS configuration, uses Resend and returns delivery failures. It does not store inquiries in the publicly readable Sanity dataset. Test one real inquiry after confirming the sender; automated checks must not send unsolicited email. Production abuse protection/rate limiting should be configured with the hosting/email setup.

Only global shell and homepage are implemented. Navigation points to planned canonical URLs; their destination pages are part of later development. Header and footer links can be edited in Sanity. Do not treat this development seed as a launch-ready website.

Configure Sanity CORS for localhost and deployed origins, and a signed webhook pointing to `/api/revalidate` with `{ "_type": _type, "_id": _id }`. Include page, mg2a_settings, mg2a_project, mg2a_serviceCategory, mg2a_industry and mg2a_office. Set the server-only `SANITY_REVALIDATE_SECRET`; the older `NEXT_PUBLIC_SANITY_HOOK` remains a compatibility fallback. All homepage reference types have cache tags. Enable preview using the existing Studio Presentation integration.

## Verification completed

- Production build passed.
- Full schema (including the code-input plugin) compiled without schema errors.
- All 11 MG2A section types have matching renderers and are available in the insertion menu; the homepage uses 10 sections, with Metrics available when verified figures are supplied.
- Checked desktop rendering, 390px mobile overflow, menu opening/Escape dismissal, hero pause/play state and completed shared card lists.
- Form checks used stubbed delivery: required fields, email/header validation, field lengths, origin checks, honeypot, server-owned recipient, and delivery failure. Live email delivery remains untested.
- Studio loads its login screen without browser errors. A signed-in editor session is still required to verify editing, drag/drop and publishing in the actual Studio UI. Production webhook delivery is not yet configured or verified.


## Tailwind and per-section editing update

All MG2A header, footer, section, form and UI styles now use literal Tailwind utilities, including responsive and interaction states. The former numbered generated CSS rules have been removed. Shared brand/theme variables remain in `styles/mg2a/tokens.css`; `styles/mg2a/index.css` only imports tokens and applies Tailwind base utilities. The inherited generic Janoova components are unchanged.

Every MG2A section has **Content** and **Style** tabs. Style includes optional top/bottom padding in pixels for desktop and mobile (at 980px and below), plus the library's `scoped_css` code field. Blank padding values retain the supplied design. Styles are compiled under that section's unique `data-mg2a-block` selector; editing one instance cannot target a sibling instance using ordinary nested selectors. Hero padding targets its copy container and Careers padding targets its inner content container, preserving their full-width media/backgrounds. Custom CSS may use nested selectors and media queries, for example `h2 { max-width: 650px; }`.

The hero uses **Button one** and **Button two**, each with Title and Link, and one **Trust statement** string. Editors can use `<strong>` or `<b>` in that string. Rendering discards attributes and executable tags, and removes Sanity preview annotations before parsing. The migration preserves existing published and draft values while retiring the fragmented fields and section toggles. Drafts remain drafts.

The header/footer use the exact inline logo artwork from the supplied homepage, and service icons use its seven exact SVG drawings. Comparison of the original and the developer previews at 1280px desktop and 390px phone widths measured identical heights for all ten homepage sections with the same content. The draft placeholders still need client replacement before publication. Client Access remains hidden as requested until its URL is supplied.
