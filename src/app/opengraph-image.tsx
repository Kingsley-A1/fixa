import { ImageResponse } from "next/og";

export const alt = "Fixa — Great at repairs. Now, great at running them.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

const green = "#203e32";
const sage = "#7c9468";
const muted = "#6c7b75";

function Metric({ label, value, color = green }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 12, padding: "18px 16px", border: "1px solid #e2e8df", borderRadius: 14, backgroundColor: "#ffffff" }}>
      <span style={{ color: muted, fontSize: 14 }}>{label}</span>
      <span style={{ color, fontSize: 36, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", overflow: "hidden", backgroundColor: "#fcfdf9", fontFamily: "Arial, sans-serif", color: green }}>
      <div style={{ display: "flex", position: "absolute", width: 520, height: 520, borderRadius: 520, backgroundColor: "#eff3e9", right: -95, top: -200, opacity: 0.85 }} />
      <div style={{ display: "flex", width: "51%", flexDirection: "column", padding: "49px 20px 37px 62px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 54, fontWeight: 800, letterSpacing: -4 }}>
          fixa<span style={{ color: sage }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 69 }}>
          <span style={{ fontSize: 55, fontWeight: 750, letterSpacing: -2.7 }}>Great at repairs.</span>
          <span style={{ fontSize: 55, fontWeight: 750, letterSpacing: -2.7 }}>Now, great at</span>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 63, fontStyle: "italic", color: sage, letterSpacing: -2 }}>running them.</span>
        </div>
        <div style={{ display: "flex", color: muted, fontSize: 22, lineHeight: 1.45, maxWidth: 490, marginTop: 20 }}>
          Your customers, devices, and repair jobs. Finally together in one calm, organized workspace.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 15, marginTop: "auto", color: green, fontSize: 19 }}>
          <span style={{ display: "flex", width: 42, height: 3, backgroundColor: sage, borderRadius: 3 }} />
          fixa.bespoketech.com.ng
        </div>
      </div>
      <div style={{ display: "flex", width: "49%", padding: "98px 42px 56px 0", alignItems: "center", position: "relative" }}>
        <div style={{ display: "flex", backgroundColor: "#f1f5ed", borderRadius: 26, padding: 22, width: "100%", transform: "rotate(-2deg)", boxShadow: "0 10px 38px rgba(20,43,32,0.05)" }}>
          <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "22px 21px 20px", backgroundColor: "#ffffff", border: "1px solid #dfe6da", borderRadius: 16, boxShadow: "0 18px 42px rgba(20,43,32,0.09)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, borderBottom: "1px solid #eef0ec" }}>
              <div style={{ display: "flex", fontSize: 29, fontWeight: 800, letterSpacing: -2.2 }}>fixa<span style={{ color: sage }}>.</span></div>
              <div style={{ display: "flex", gap: 18, fontSize: 12, color: muted }}><span>Repairs</span><span>Customers</span><span>Devices</span></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", paddingTop: 21, gap: 6 }}>
              <span style={{ fontSize: 12, letterSpacing: 1.3, color: sage }}>YOUR WORKSPACE</span>
              <span style={{ fontSize: 27, fontWeight: 750, letterSpacing: -0.7 }}>A clearer day starts here.</span>
              <span style={{ fontSize: 14, color: muted }}>Let&apos;s keep those repairs moving.</span>
            </div>
            <div style={{ display: "flex", gap: 11, marginTop: 23 }}>
              <Metric label="Active repairs" value="24" />
              <Metric label="Ready for pickup" value="08" color="#426c4c" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, marginBottom: 8, alignItems: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>On the workbench</span>
              <span style={{ color: sage, fontSize: 12 }}>View all →</span>
            </div>
            {[
              ["iPhone 13 Pro", "Screen replacement", "In progress", "#e8f0fc", "#3b67a1"],
              ["MacBook Air M2", "Battery replacement", "Ready to collect", "#e7f2e7", "#4b7952"],
              ["Samsung Galaxy S23", "Charging port repair", "Diagnosing", "#fff3d9", "#9f7428"],
            ].map(([device, issue, status, bg, fg]) => (
              <div key={device} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, borderTop: "1px solid #edf0ea", padding: "14px 0" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{device}</span>
                  <span style={{ fontSize: 12, color: muted }}>{issue}</span>
                </div>
                <span style={{ padding: "8px 9px", backgroundColor: bg, color: fg, borderRadius: 8, fontSize: 10 }}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
