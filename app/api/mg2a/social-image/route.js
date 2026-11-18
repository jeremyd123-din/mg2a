import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

export async function GET(request) {
  const title =
    (new URL(request.url).searchParams.get("title") || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 140) || "M Gingerich Gereaux & Associates";
  const logo = await readFile(
    new URL("../../../../public/mg2a/mg2a-logo-white.svg", import.meta.url),
  );

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "76px 88px",
        background: "linear-gradient(140deg, #0b1822 44%, #183547 100%)",
        color: "#f1efea",
        borderBottom: "12px solid #d0441a",
      }}
    >
      <img
        src={"data:image/svg+xml;base64," + logo.toString("base64")}
        alt="MG2A"
          width={172}
          height={72}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
          gap: 24,
        }}
      >
        <div style={{ width: 76, height: 5, background: "#f27a50" }} />
        <div
          style={{
            fontSize: title.length > 85 ? 60 : 76,
            lineHeight: 1.08,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            textWrap: "balance",
            overflowWrap: "break-word",
            lineClamp: 4,
          }}
        >
          {title}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=604800",
      },
    },
  );
}
