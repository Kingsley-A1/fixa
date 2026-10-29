import Image from "next/image";
import { workspaceConfigured } from "@/lib/config";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { PrintButton } from "@/components/print-button";
import { ShieldCheck } from "lucide-react";
import { FixaWordmark } from "@/components/fixa-wordmark";
export default async function PublicTicket({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  if (!workspaceConfigured()) notFound();
  const { token } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(token)) notFound();
  const job = await db.repairJob.findUnique({
    where: { publicToken: token },
    include: {
      business: { select: { name: true, phone: true } },
      device: { select: { brand: true, model: true } },
    },
  });
  if (!job) notFound();
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? "https://" + process.env.VERCEL_URL
      : "http://localhost:3000");
  const url =
    (base.endsWith("/") ? base.slice(0, -1) : base) +
    "/ticket/" +
    job.publicToken;
  const qr = await QRCode.toDataURL(url, {
    width: 210,
    margin: 2,
    color: { dark: "#182129", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#f5f7f9",
        padding: "36px 16px",
      }}
    >
      <div style={{ maxWidth: 510, margin: "0 auto" }}>
        <div
          className="brand"
          style={{ justifyContent: "center", marginBottom: 30 }}
        >
          <FixaWordmark />
        </div>
        <div className="panel" style={{ padding: 32 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              gap: 15,
            }}
          >
            <div>
              <p className="eyebrow">DIGITAL SERVICE TICKET</p>
              <h1 style={{ fontSize: 26, marginTop: 9 }}>
                {job.business.name}
              </h1>
              <p className="muted" style={{ marginTop: 6 }}>
                Reference · {job.code}
              </p>
            </div>
            <span className={"pill " + job.status.toLowerCase()}>
              {job.status.replaceAll("_", " ").toLowerCase()}
            </span>
          </div>
          <div style={{ borderTop: "1px solid #edf0f2", margin: "25px 0" }} />
          <div className="detail-grid">
            <div className="detail-item">
              <label>Device</label>
              <strong>
                {job.device.brand} {job.device.model}
              </strong>
            </div>
            <div className="detail-item">
              <label>Reported issue</label>
              <strong>{job.issue}</strong>
            </div>
            <div className="detail-item">
              <label>Received</label>
              <strong>
                {job.createdAt.toLocaleDateString("en-NG", {
                  dateStyle: "medium",
                })}
              </strong>
            </div>
            <div className="detail-item">
              <label>Expected completion</label>
              <strong>
                {job.dueDate
                  ? job.dueDate.toLocaleDateString("en-NG", {
                      dateStyle: "medium",
                    })
                  : "To be confirmed"}
              </strong>
            </div>
            <div className="detail-item">
              <label>Estimated amount</label>
              <strong>
                {job.estimatedPrice !== null
                  ? "₦" + Number(job.estimatedPrice).toLocaleString("en-NG")
                  : "Pending quote"}
              </strong>
            </div>
            <div className="detail-item">
              <label>Deposit recorded</label>
              <strong>
                {job.deposit !== null
                  ? "₦" + Number(job.deposit).toLocaleString("en-NG")
                  : "Not recorded"}
              </strong>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              placeItems: "center",
              gap: 10,
              borderTop: "1px solid #edf0f2",
              marginTop: 27,
              paddingTop: 22,
            }}
          >
            <Image
              unoptimized
              src={qr}
              width="164"
              height="164"
              alt="QR code for this service ticket"
            />
            <strong style={{ fontSize: 12 }}>Scan to view this ticket</strong>
            <p className="muted" style={{ fontSize: 11, textAlign: "center" }}>
              Keep this link private. Anyone with it can view these limited
              service details.
            </p>
          </div>
        </div>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            alignItems: "center",
            margin: "20px 0",
            fontSize: 12,
            color: "#75818b",
          }}
        >
          <ShieldCheck size={15} /> This is a service acknowledgment, not proof
          of ownership or payment.
        </p>
        <PrintButton />
        <p
          style={{
            textAlign: "center",
            marginTop: 26,
            fontSize: 11,
            color: "#8b959f",
          }}
        >
          Powered by Fixa · A Bespoke Technologies product
        </p>
      </div>
    </main>
  );
}
