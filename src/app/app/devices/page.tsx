import Link from "next/link";
import { requireWorkspace } from "@/lib/auth";
import { db } from "@/lib/db";
import { deviceFilter } from "@/lib/repair-search";
import { Plus, Smartphone, ArrowRight } from "lucide-react";
export default async function Devices({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { business } = await requireWorkspace();
  const q = (await searchParams).q?.trim().slice(0, 100) || "";
  const devices = await db.device.findMany({
    where: {
      businessId: business.id,
      ...deviceFilter(q),
    },
    take: 100,
    orderBy: { createdAt: "desc" },
    include: { customer: true, _count: { select: { jobs: true } } },
  });
  return (
    <main id="main-content" className="workspace fade-in">
      <div className="page-head">
        <div className="intro">
          <span className="eyebrow">DEVICE REGISTRY</span>
          <h1>Devices</h1>
          <p>Every device has an identity and a repair history.</p>
        </div>
        <Link href="/app/devices/new" className="btn primary">
          <Plus size={17} /> Register device
        </Link>
      </div>
      <form className="searchbar" style={{ marginBottom: 18 }}>
        <Smartphone size={17} />
        <input
          name="q"
          placeholder="Name, phone, device, code or IMEI…"
          defaultValue={q}
        />
      </form>
      <section className="panel">
        {devices.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Device ID</th>
                  <th>Customer</th>
                  <th>Service visits</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <strong>
                        {d.brand} {d.model}
                      </strong>
                    </td>
                    <td>
                      <span className="job-code">{d.code}</span>
                    </td>
                    <td>{d.customer.name}</td>
                    <td>{d._count.jobs}</td>
                    <td>{d.createdAt.toLocaleDateString("en-NG")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <span className="empty-icon">
              <Smartphone size={25} />
            </span>
            <h3>{q ? "No matching devices" : "No devices registered"}</h3>
            <p>
              {q
                ? "Try another identifier."
                : "Give each device a permanent identity for its entire service history."}
            </p>
            <Link href="/app/devices/new" className="btn primary">
              Register device <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
