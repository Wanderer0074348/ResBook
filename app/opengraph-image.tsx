import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
          color: "#0a0a0a",
          background:
            "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 45%, #d1d5db 100%)",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2, textTransform: "uppercase" }}>ResBook</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 18,
            }}
          >
            <span>AI Tools &</span>
            <span>Workflow Directory</span>
          </div>
          <div style={{ fontSize: 28, opacity: 0.8 }}>
            Curated reviews, actionable workflows, and practical recommendations.
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ border: "2px solid #0a0a0a", padding: "8px 14px", fontSize: 22 }}>
            tools
          </div>
          <div style={{ border: "2px solid #0a0a0a", padding: "8px 14px", fontSize: 22 }}>
            workflows
          </div>
          <div style={{ border: "2px solid #0a0a0a", padding: "8px 14px", fontSize: 22 }}>
            markdown-first
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
