import Link from "next/link";
import { requireWorkspace } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  ClipboardList,
  Clock3,
  CheckCircle2,
  UsersRound,
} from "lucide-react";
export default async function Dashboard() {
  const { business, user } = await requireWorkspace();
  const b = business.id;
  const [total, active, ready, customers, jobs] = await Promise.all([
    db.repairJob.count({ where: { businessId: b } }),
    db.repairJob.count({
      where: {
        businessId: b,
        status: {
          in: ["RECEIVED", "DIAGNOSING", "AWAITING_APPROVAL", "IN_PROGRESS"],
        },
      },
    }),
    db.repairJob.count({ where: { businessId: b, status: "READY" } }),
    db.customer.count({ where: { businessId: b } }),
    db.repairJob.findMany({
      where: { businessId: b },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { customer: true, device: true },
    }),
  ]);
  const stats = [
    {
      label: "Total repair jobs",
      value: total,
      icon: ClipboardList,
      foot: "Since you started",
    },
    {
      label: "Active repairs",
      value: active,
      icon: Clock3,
      foot: "Currently in progress",
    },
    {
      label: "Ready to collect",
      value: ready,
      icon: CheckCircle2,
      foot: "Awaiting pickup",
    },
    {
      label: "Customers",
      value: customers,
      icon: UsersRound,
      foot: "In your workspace",
    },
  ];
  return (
    <main id="main-content" className="workspace fade-in">
      <div className="page-head">
        <div className="intro">
          <span className="eyebrow">YOUR WORKSPACE</span>
          <h1>Good to see you, {user.name.split(" ")[0]}.</h1>
          <p>Here’s what’s happening in your repair business.</p>
        </div>
        <Link className="btn primary" href="/app/jobs/new">
          <Plus size={17} /> New repair job
        </Link>
      </div>
      <section className="stats">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <article className="stat" key={s.label}>
              <div className="stat-head">
                <span>{s.label}</span>
                <Icon size={18} />
              </div>
              <div className="stat-val">{s.value.toLocaleString()}</div>
              <div className="stat-foot">{s.foot}</div>
            </article>
          );
        })}
      </section>
      <section className="panel">
        <div className="panel-top">
          <div>
            <h3>Recent repair jobs</h3>
            <p>A quick look at your latest service activity.</p>
          </div>
          <Link className="text-link" href="/app/jobs">
            View all <ArrowUpRight size={15} />
          </Link>
        </div>
        {jobs.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Customer</th>
                  <th>Device</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <Link className="job-code" href={"/app/jobs/" + job.id}>
                        {job.code}
                      </Link>
                    </td>
                    <td>
                      <strong>{job.customer.name}</strong>
                    </td>
                    <td>
                      {job.device.brand} {job.device.model}
                    </td>
                    <td>
                      <span className={"pill " + job.status.toLowerCase()}>
                        {job.status.replaceAll("_", " ").toLowerCase()}
                      </span>
                    </td>
                    <td>
                      {job.createdAt.toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <Link
                        href={"/app/jobs/" + job.id}
                        aria-label={"Open " + job.code}
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <span className="empty-icon">
              <ClipboardList size={25} />
            </span>
            <h3>Your first repair starts here.</h3>
            <p>
              Register a customer, add their device, and create your first
              service ticket.
            </p>
            <Link className="btn primary" href="/app/customers/new">
              <Plus size={17} /> Add a customer
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
