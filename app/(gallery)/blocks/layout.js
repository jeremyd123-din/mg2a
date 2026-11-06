import "@/app/(frontend)/globals.css";
import "@/styles/mg2a/index.css";
export const metadata = {
  title: "MG2A Section Library",
  robots: { index: false, follow: false },
};
export default function GalleryLayout({ children }) {
  return (
    <html
      className="scroll-pt-[84px] scroll-smooth motion-reduce:scroll-auto"
      lang="en"
      data-theme="dark"
      data-orange="orange"
      data-flip="new"
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
