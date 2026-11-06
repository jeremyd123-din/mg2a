// Launch inventory transcribed from the supplied sitemap. Deferred services are intentionally absent.
const links = (entries) =>
  entries.map(([label, href], index) => ({
    _key: "link-" + index,
    _type: "mg2a_link",
    label,
    href,
  }));
const category = (key, label, entries = []) => ({
  _key: key,
  _type: "navigationGroup",
  label,
  href: "/services/" + key,
  links: links(
    entries.map(([label, slug]) => [label, `/services/${key}/${slug}`]),
  ),
});
export const serviceGroups = [
  category("survey", "Survey", [
    ["Boundary Survey", "boundary-survey"],
    ["ALTA Survey", "alta-survey"],
    ["Topographic Survey", "topographic-survey"],
  ]),
  category("design", "Design", [
    ["Site Plans", "site-plans"],
    ["Engineering Plans", "engineering-plans"],
    ["Plats of Subdivision", "plats-of-subdivision"],
  ]),
  category("water-resources", "Water Resources", [
    ["Stormwater Management Plans", "stormwater-management-plans"],
    ["Floodplain Analysis", "floodplain-analysis"],
  ]),
  category("permitting", "Permitting", [
    ["CLOMR and LOMR Applications", "clomr-lomr-applications"],
    ["NPDES Permitting and Inspections", "npdes-permitting-inspections"],
  ]),
  category("construction", "Construction", [
    ["Construction Staking", "construction-staking"],
  ]),
  category("documentation", "Documentation", [
    ["Flood Elevation Certification", "flood-elevation-certification"],
  ]),
  category("cost-estimation", "Cost Estimation"),
];
export const industryLinks = links([
  ["Municipalities", "/industries/municipalities"],
  ["Manufacturing", "/industries/manufacturing"],
  ["Commercial Chains", "/industries/commercial-chains"],
  ["Local Businesses", "/industries/local-businesses"],
  ["National and Regional Builders", "/industries/national-builders"],
  ["Local Builders", "/industries/local-builders"],
  ["Commercial Real Estate", "/industries/commercial-real-estate"],
  ["Residential Real Estate", "/industries/residential-real-estate"],
  ["Attorneys", "/industries/attorneys"],
]);
export const primaryNavigation = [
  {
    _key: "services",
    _type: "mg2a_link",
    label: "Services",
    href: "/services",
    groups: serviceGroups,
  },
  {
    _key: "industries",
    _type: "mg2a_link",
    label: "Industries",
    href: "/industries",
    groups: [
      {
        _key: "industries",
        _type: "navigationGroup",
        label: "Industries",
        href: "/industries",
        links: industryLinks,
      },
    ],
  },
  ...links([
    ["Projects", "/projects"],
    ["About", "/about"],
    ["Careers", "/careers"],
  ]).map((link, index) => ({ ...link, _key: "primary-" + index })),
];
export const projectRoutes = links([
  ["Bradley Commons", "/projects/bradley-commons"],
  ["Bourbonnais Parkway Business Park", "/projects/bourbonnais-parkway"],
  ["The Courtyards at Cobblestone", "/projects/courtyards-cobblestone"],
  [
    "Local Road Improvements and Street Maintenance",
    "/projects/local-road-improvements",
  ],
  ["Sewer CMOM Programs", "/projects/sewer-cmom-programs"],
  ["Making Information Work", "/projects/making-information-work"],
]);
export const countyRoutes = links([
  ["Kankakee County", "/locations/kankakee-county"],
  ["Will County", "/locations/will-county"],
]);
export const launchRoutes = [
  ...links([
    ["Home", "/"],
    ["Services", "/services"],
    ["Industries", "/industries"],
    ["Projects", "/projects"],
    ["About", "/about"],
    ["Careers", "/careers"],
    ["Developer’s Journal", "/blog"],
    ["Service Areas", "/locations"],
    ["Order a Survey", "/order-a-survey"],
    ["Contact", "/contact"],
    ["Privacy Policy", "/privacy-policy"],
  ]),
  ...serviceGroups.flatMap((group) => [
    { label: group.label, href: group.href },
    ...group.links,
  ]),
  ...industryLinks,
  ...projectRoutes,
  ...countyRoutes,
];
export const dynamicRoutePatterns = [
  "/about/team/[slug]",
  "/careers/[slug]",
  "/blog/[slug]",
];
export const systemRoutes = [
  "/404",
  "/thank-you/project-inquiry",
  "/thank-you/survey-request",
  "/thank-you/job-application",
];
