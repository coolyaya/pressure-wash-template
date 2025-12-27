import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const title =
    site.seo?.defaultTitle || `${site.businessName} | ${site.city}`;
  const subtitle = site.seo?.defaultDescription || site.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "white",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                border: "2px solid #111827",
              }}
            />
            <div style={{ fontSize: 32, fontWeight: 700, color: "#111827" }}>
              {site.businessName}
            </div>
          </div>

          <div style={{ fontSize: 56, fontWeight: 800, color: "#111827" }}>
            {title}
          </div>

          <div style={{ fontSize: 28, color: "#374151", lineHeight: 1.3 }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ fontSize: 22, color: "#374151" }}>
            {`${site.phone} • ${site.city}`}
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#111827",
              padding: "14px 20px",
              borderRadius: 14,
              border: "2px solid #111827",
            }}
          >
            Free Quotes
          </div>
        </div>
      </div>
    ),
    size
  );
}
