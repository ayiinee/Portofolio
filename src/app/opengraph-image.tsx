import { ImageResponse } from "next/og";

export const alt =
  "Qurrotul A'ini — From code to cloud. DevOps, cloud infrastructure, and backend engineering.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "64px 80px",
        background:
          "linear-gradient(160deg, #f7f9fc 15%, #d7e8f6 70%, #a5c9ea)",
        color: "#17213a",
      }}
    >
      <div style={{ display: "flex", fontSize: 32 }}>Qurrotul A’ini</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", fontSize: 88, letterSpacing: -5 }}>
          From code to cloud.
        </div>
        <div style={{ display: "flex", fontSize: 27, color: "#465571" }}>
          DevOps · Cloud Infrastructure · Backend Engineering
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 20, color: "#465571" }}>
        Beautifully presented work, backed by real engineering.
      </div>
    </div>,
    size,
  );
}
