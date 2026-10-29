import { requireWorkspace } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ExternalLink,
  Clock3,
  Smartphone,
  ReceiptText,
  History,
} from "lucide-react";
import { updateStatus } from "@/app/actions";
import { JobStatus } from "@prisma/client";
const statuses: JobStatus[] = [
  "RECEIVED",
  "DIAGNOSING",
  "AWAITING_APPROVAL",
  "IN_PROGRESS",
  "READY",
  "COLLECTED",
  "CANCELLED",
];
export default async function JobDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { business } = await requireWorkspace();
  const { id } = await params;
  const job = await db.repairJob.findFirst({
    where: { id, businessId: business.id },
    include: {
      customer: true,
      device: true,
      events: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!job) notFound();
  return (
    <main id="main-content" className="workspace fade-in">
      <div className="page-head">
        <div className="intro">
          <Link href="/app/jobs" className="text-link">
            <ChevronLeft size={16} /> Repair jobs
          </Link>
          <h1>{job.code}</h1>
          <p>
            Created{" "}
            {job.createdAt.toLocaleString("en-NG", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <a
          className="btn primary"
          href={"/ticket/" + job.publicToken}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ReceiptText size={17} /> Open customer ticket{" "}
          <ExternalLink size={14} />
        </a>
      </div>
      <div className="split">
        <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
          <section className="panel info-box">
            <div className="section-head">
              <h3>Repair overview</h3>
              <span className={"pill " + job.status.toLowerCase()}>
                {job.status.replaceAll("_", " ").toLowerCase()}
              </span>
            </div>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Reported issue</label>
                <strong>{job.issue}</strong>
              </div>
              <div className="detail-item">
                <label>Expected completion</label>
                <strong>
                  {job.dueDate
                    ? job.dueDate.toLocaleDateString("en-NG", {
                        dateStyle: "medium",
                      })
                    : "Not set"}
                </strong>
              </div>
              <div className="detail-item">
                <label>Initial condition</label>
                <strong>{job.condition || "Not recorded"}</strong>
              </div>
              <div className="detail-item">
                <label>Accessories received</label>
                <strong>{job.accessories || "None recorded"}</strong>
              </div>
              <div className="detail-item">
                <label>Estimated charge</label>
                <strong>
                  {job.estimatedPrice !== null
                    ? "₦" + Number(job.estimatedPrice).toLocaleString("en-NG")
                    : "Not yet agreed"}
                </strong>
              </div>
              <div className="detail-item">
                <label>Deposit</label>
                <strong>
                  {job.deposit !== null
                    ? "₦" + Number(job.deposit).toLocaleString("en-NG")
                    : "Not recorded"}
                </strong>
              </div>
            </div>
          </section>
          <section className="panel info-box">
            <div className="section-head">
              <h3>Customer & device</h3>
              <Smartphone size={18} color="#8b96a1" />
            </div>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Customer</label>
                <strong>{job.customer.name}</strong>
              </div>
              <div className="detail-item">
                <label>Phone</label>
                <strong>{job.customer.phone}</strong>
              </div>
              <div className="detail-item">
                <label>Device</label>
                <strong>
                  {job.device.brand} {job.device.model}
                </strong>
              </div>
              <div className="detail-item">
                <label>Permanent Device ID</label>
                <strong>{job.device.code}</strong>
              </div>
            </div>
          </section>
        </div>
        <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
          <section className="panel info-box">
            <h3>Update repair status</h3>
            <p className="muted" style={{ fontSize: 12, margin: "7px 0 17px" }}>
              Keep customers and colleagues informed.
            </p>
            {job.status === "COLLECTED" || job.status === "CANCELLED" ? (
              <p className="pill">{job.status.toLowerCase()} · closed</p>
            ) : (
              <form action={updateStatus} className="form-stack">
                <input type="hidden" name="id" value={job.id} />
                <label className="field">
                  <span>New status</span>
                  <select name="status" defaultValue={job.status}>
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="btn primary" type="submit">
                  Save status
                </button>
              </form>
            )}
          </section>
          <section className="panel info-box">
            <div className="section-head">
              <h3>Activity</h3>
              <History size={18} color="#8b96a1" />
            </div>
            <div style={{ display: "grid", gap: 20 }}>
              {job.events.map((e) => (
                <div
                  key={e.id}
                  style={{ display: "flex", gap: 12, alignItems: "start" }}
                >
                  <Clock3 size={16} color="#8b96a1" />
                  <div>
                    <strong style={{ fontSize: 12 }}>
                      {e.toStatus.replaceAll("_", " ").toLowerCase()}
                    </strong>
                    <p className="muted" style={{ fontSize: 11, marginTop: 3 }}>
                      {e.createdAt.toLocaleString("en-NG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
