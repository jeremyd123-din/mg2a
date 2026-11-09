import { Suspense } from "react";
import HeadingTags from "@/components/wrappers/HeadingTags";
import { pageIdentity } from "@/lib/mg2a/scopedStyles";
import "./globals.css";
import "@/styles/mg2a/index.css";
import { headers } from "next/headers";
import { GoogleTagManager } from "@next/third-parties/google";
import {
  getSiteSettings,
  getMG2ASettings,
  getPageBySlug,
} from "@/sanity/utils/queries";
import MG2AHeader from "@/components/mg2a/layout/MG2AHeader";
import MG2AFooter from "@/components/mg2a/layout/MG2AFooter";
import VisualEditingControls from "@/components/wrappers/VisualEditingControls";
import { settings as defaults, offices } from "@/lib/mg2a/defaults";
import { stegaClean } from "next-sanity";

// The public shell reads headers and draft-preview cookies on every request.
// Empty generateStaticParams lists must not turn CMS routes into static fallbacks.
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    ),
    ...(settings?.disable_indexing
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}
export default async function RootLayout({ children }) {
  const pathname = (await headers()).get("x-pathname") || "/";
  const slug = pathname === "/" ? "index" : pathname.replace(/^\/|\/$/g, "");
  const [globalSettings, legacySettings, page] = await Promise.all([
    getMG2ASettings(),
    getSiteSettings(),
    getPageBySlug(slug),
  ]);
  const settings = globalSettings || { ...defaults, offices };
  const theme =
    stegaClean(page?.default_theme) || (pathname === "/" ? "dark" : "light");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: settings.organization,
    alternateName: "MG2A",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    areaServed: ["Illinois", "Indiana"],
    address: (settings.offices || []).filter(Boolean).map((office) => ({
      "@type": "PostalAddress",
      streetAddress: office.street,
      addressLocality: office.city,
      addressCountry: "US",
    })),
  };
  return (
    <html
      className="scroll-pt-[84px] scroll-smooth motion-reduce:scroll-auto"
      lang="en"
      data-theme={theme}
      data-orange={stegaClean(settings.orange) || "orange"}
      data-flip={stegaClean(settings.flip) || "new"}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {legacySettings?.gtm_id && (
          <GoogleTagManager gtmId={stegaClean(legacySettings.gtm_id)} />
        )}
        <MG2AHeader settings={settings} overlay={pathname === "/"} />
        <main
          id="main-content"
          data-mg2a-page={page ? pageIdentity(page) : undefined}
        >
          {pathname !== "/" && (
            <div
              className="h-[125px] [@media(max-width:980px)]:h-[84px]"
              aria-hidden="true"
            />
          )}
          {children}
        </main>
        <MG2AFooter settings={settings} />
        <VisualEditingControls />
        <Suspense fallback={null}>
          <HeadingTags />
        </Suspense>
      </body>
    </html>
  );
}
