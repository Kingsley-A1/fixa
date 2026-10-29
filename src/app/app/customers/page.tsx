import Link from "next/link";
import { requireWorkspace } from "@/lib/auth";
import { db } from "@/lib/db";
import { Plus, UsersRound, ArrowRight } from "lucide-react";
export default async function Customers({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { business } = await requireWorkspace();
  const q = (await searchParams).q?.trim().slice(0, 100) || "";
  const customers = await db.customer.findMany({
    where: {
      businessId: business.id,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } },
            ],
          }
        : {}),
    },
    take: 100,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { devices: true, jobs: true } } },
  });
  return (
    <main id="main-content" className="workspace fade-in">
      <div className="page-head">
        <div className="intro">
          <span className="eyebrow">RELATIONSHIPS</span>
          <h1>Customers</h1>
          <p>One customer record. Every visit connected.</p>
        </div>
        <Link href="/app/customers/new" className="btn primary">
          <Plus size={17} /> Add customer
        </Link>
      </div>
      <form className="searchbar" style={{ marginBottom: 18 }}>
        <UsersRound size={17} />
        <input name="q" placeholder="Search name or phone…" defaultValue={q} />
      </form>
      <section className="panel">
        {customers.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Devices</th>
                  <th>Jobs</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.name}</strong>
                    </td>
                    <td>{c.phone}</td>
                    <td>{c._count.devices}</td>
                    <td>{c._count.jobs}</td>
                    <td>{c.createdAt.toLocaleDateString("en-NG")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <span className="empty-icon">
              <UsersRound size={25} />
            </span>
            <h3>{q ? "No matching customers" : "No customers yet"}</h3>
            <p>
              {q
                ? "Try a different search."
                : "Register your first customer to begin tracking repair work."}
            </p>
            <Link href="/app/customers/new" className="btn primary">
              Add customer <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
