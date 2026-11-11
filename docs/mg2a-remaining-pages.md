# MG2A remaining pages

Updated 2026-11-11. **25 routes remain to build**: 6 core/system pages, 17 service pages and 2 project pages. Recommended-later sitemap destinations are excluded.

## Core and system pages (6)

- [ ] Service Areas — `/locations`
- [ ] Kankakee County — `/locations/kankakee-county`
- [ ] Will County — `/locations/will-county`
- [ ] project-inquiry — `/thank-you/project-inquiry`
- [ ] survey-request — `/thank-you/survey-request`
- [ ] job-application — `/thank-you/job-application`

## Service pages using the existing modules (17)

- [ ] Survey — `/services/survey`
- [ ] Boundary Survey — `/services/survey/boundary-survey`
- [ ] ALTA Survey — `/services/survey/alta-survey`
- [ ] Topographic Survey — `/services/survey/topographic-survey`
- [ ] Design — `/services/design`
- [ ] Site Plans — `/services/design/site-plans`
- [ ] Engineering Plans — `/services/design/engineering-plans`
- [ ] Plats of Subdivision — `/services/design/plats-of-subdivision`
- [ ] Floodplain Analysis — `/services/water-resources/floodplain-analysis`
- [ ] Permitting — `/services/permitting`
- [ ] CLOMR and LOMR Applications — `/services/permitting/clomr-lomr-applications`
- [ ] NPDES Permitting and Inspections — `/services/permitting/npdes-permitting-inspections`
- [ ] Construction — `/services/construction`
- [ ] Construction Staking — `/services/construction/construction-staking`
- [ ] Documentation — `/services/documentation`
- [ ] Flood Elevation Certification — `/services/documentation/flood-elevation-certification`
- [ ] Cost Estimation — `/services/cost-estimation`

## Project pages using the existing template (2)

- [ ] Sewer CMOM Programs — `/projects/sewer-cmom-programs`
- [ ] Making Information Work — `/projects/making-information-work`

## Built templates and content still needed

About and Careers overview pages are built. Team member pages use `/about/{slug}`; job pages use `/careers/{slug}`. Published records automatically populate their overview. Applications appear only on individual job pages.

The eight industry pages other than Municipalities currently have starter content and need tailored copy/modules. Team biographies, portraits, benefits, company history, job descriptions and bracketed values still need client content. These are content-completion tasks, separate from missing routes.

Project filtering by service category and industry is still outstanding. Blog listing/article and 404 templates exist. Three thank-you routes above remain to be built and connected to the forms; those routes should be noindex.

Run `node scripts/report-mg2a-pages.mjs` after creating pages to refresh this count from published CMS routes.
