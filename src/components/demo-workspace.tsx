"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ClipboardList,
  LayoutDashboard,
  Plus,
  Search,
  Smartphone,
  UsersRound,
  Wrench,
  X,
  RotateCcw,
  CircleCheck,
  Clock3,
} from "lucide-react";
import {
  DemoJob,
  DemoStatus,
  jobMatches,
  jobSummary,
  sampleJobs,
  statuses,
} from "@/lib/demo";
const storageKey = "fixa-demo-v1";
const money = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
const statusClass = (s: string) => s.toLowerCase().replaceAll(" ", "_");
export function DemoWorkspace() {
  const [jobs, setJobs] = useState<DemoJob[]>(sampleJobs);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("Overview");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [modal, setModal] = useState<"new" | DemoJob | null>(null);
  const [notice, setNotice] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (
        Array.isArray(saved) &&
        saved.length <= 500 &&
        saved.every(
          (j) =>
            j &&
            typeof j.id === "string" &&
            typeof j.customer === "string" &&
            typeof j.device === "string" &&
            typeof j.issue === "string" &&
            typeof j.estimate === "number" &&
            Number.isFinite(j.estimate) &&
            j.estimate >= 0 &&
            typeof j.date === "string" &&
            !Number.isNaN(Date.parse(j.date)) &&
            statuses.includes(j.status),
        )
      )
        setJobs(saved);
    } catch {
      /* Use sample data if browser storage is unavailable. */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem(storageKey, JSON.stringify(jobs));
      } catch {
        /* The demo also works without persistent storage. */
      }
  }, [jobs, loaded]);
  useEffect(() => {
    if (modal) {
      lastFocus.current = document.activeElement as HTMLElement;
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
      lastFocus.current?.focus();
    }
  }, [modal]);
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timeout);
  }, [notice]);
  const summary = jobSummary(jobs);
  const filtered = jobs.filter((j) => jobMatches(j, query, status));
  const navigate = (next: string) => {
    setTab(next);
    setQuery("");
    setStatus("All statuses");
  };
  function createJob(fd: FormData) {
    const customer = String(fd.get("customer") || "").trim(),
      device = String(fd.get("device") || "").trim(),
      issue = String(fd.get("issue") || "").trim();
    const estimate = Number(fd.get("estimate"));
    if (
      customer.length < 2 ||
      device.length < 2 ||
      issue.length < 5 ||
      !Number.isFinite(estimate) ||
      estimate < 0 ||
      estimate > 1000000000
    )
      return;
    setJobs((prev) => [
      {
        id: "FX-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
        customer,
        device,
        issue,
        status: "Received",
        estimate,
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setModal(null);
    navigate("Repair jobs");
    setNotice("Repair job created in your demo workspace.");
  }
  function updateJob(fd: FormData) {
    if (!modal || modal === "new") return;
    const next = String(fd.get("status")) as DemoStatus;
    if (!statuses.includes(next)) return;
    setJobs((prev) =>
      prev.map((j) => (j.id === modal.id ? { ...j, status: next } : j)),
    );
    setModal(null);
    setNotice("Repair status updated.");
  }
  return (
    <div className="demo-app">
      <aside className="demo-sidebar">
        <Link className="site-logo" href="/">
          <span className="site-mark">
            <Wrench size={21} />
          </span>
          fixa<span>.</span>
        </Link>
        <div className="demo-shop">
          <span className="demo-avatar">R</span>
          <div>
            <strong>Repair Studio</strong>
            <small>Sample business workspace</small>
          </div>
        </div>
        <span className="section-kicker">WORKSPACE</span>
        <nav aria-label="Demo workspace">
          {[
            { name: "Overview", icon: LayoutDashboard },
            { name: "Repair jobs", icon: ClipboardList },
            { name: "Customers", icon: UsersRound },
            { name: "Devices", icon: Smartphone },
          ].map((n) => (
            <button
              key={n.name}
              className={tab === n.name ? "selected" : ""}
              aria-current={tab === n.name ? "page" : undefined}
              onClick={() => navigate(n.name)}
            >
              <n.icon size={18} />
              {n.name}
              {n.name === "Repair jobs" && <span>{jobs.length}</span>}
            </button>
          ))}
        </nav>
        <div className="demo-sidebar-bottom">
          <div>
            <span className="online-dot" /> A calmer way to work.
          </div>
          <Link href="/">
            <ArrowLeft size={15} /> Back to Fixa
          </Link>
        </div>
      </aside>
      <div className="demo-main">
        <header className="demo-topbar">
          <div>
            <span className="muted">Workspace</span>
            <span>/</span>
            <strong>{tab}</strong>
          </div>
          <Link href="/" className="mobile-demo-logo site-logo">
            fixa.
          </Link>
          <div>
            <span className="demo-label">INTERACTIVE DEMO</span>
            <span className="demo-avatar">YO</span>
          </div>
        </header>
        <div className="demo-banner">
          <p>
            <strong>Make yourself at home.</strong> This is a sample workspace.
            Changes stay in this browser. Use fictional details.
          </p>
          <button
            onClick={() => {
              setJobs(sampleJobs);
              navigate("Overview");
              setNotice("Demo reset to the original sample data.");
            }}
          >
            <RotateCcw size={13} /> Reset demo
          </button>
        </div>
        <main id="main-content" className="demo-content">
          <div className="demo-page-head">
            <div>
              <span className="section-kicker">LET’S KEEP THINGS MOVING</span>
              <h1>{tab === "Overview" ? "A clearer day starts here." : tab}</h1>
              <p>
                {tab === "Overview"
                  ? "A little overview of everything on your workbench."
                  : tab === "Repair jobs"
                    ? "From check-in to collection. Every repair accounted for."
                    : tab === "Customers"
                      ? "The people behind every repair."
                      : "Every device, with a story of its own."}
              </p>
            </div>
            <button className="site-button" onClick={() => setModal("new")}>
              <Plus size={17} /> New repair job
            </button>
          </div>
          {tab === "Overview" && (
            <section className="demo-stats" aria-label="Workspace statistics">
              {[
                {
                  label: "Total repair jobs",
                  value: summary.total,
                  icon: ClipboardList,
                  foot: "All jobs in your workspace",
                },
                {
                  label: "Active repairs",
                  value: summary.active,
                  icon: Clock3,
                  foot: "Currently on the workbench",
                },
                {
                  label: "Ready to collect",
                  value: summary.ready,
                  icon: CircleCheck,
                  foot: "Ready for a happy reunion",
                },
                {
                  label: "Customers",
                  value: summary.customers,
                  icon: UsersRound,
                  foot: "People you keep connected",
                },
              ].map((s) => (
                <article key={s.label}>
                  <span>
                    {s.label}
                    <s.icon size={18} />
                  </span>
                  <strong>{String(s.value).padStart(2, "0")}</strong>
                  <small>{s.foot}</small>
                </article>
              ))}
            </section>
          )}
          <section className="demo-panel">
            <div className="demo-panel-head">
              <div>
                <h2>
                  {tab === "Overview"
                    ? "On the workbench"
                    : tab === "Repair jobs"
                      ? "All repair jobs"
                      : tab === "Customers"
                        ? "Customer directory"
                        : "Device register"}
                </h2>
                <p>
                  {tab === "Overview"
                    ? "The latest from your repair studio."
                    : `${filtered.length} matching repair${filtered.length === 1 ? "" : "s"} in this workspace`}
                </p>
              </div>
              {tab === "Overview" && (
                <button
                  className="secondary-link"
                  onClick={() => navigate("Repair jobs")}
                >
                  View all jobs <ArrowUpRight size={16} />
                </button>
              )}
            </div>
            <div className="demo-filters">
              <label className="demo-search">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    tab === "Customers"
                      ? "Search customers…"
                      : tab === "Devices"
                        ? "Search devices…"
                        : "Search jobs, customers, or devices…"
                  }
                  aria-label="Search workspace"
                />
              </label>
              {!["Customers", "Devices"].includes(tab) && (
                <select
                  aria-label="Filter by status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>All statuses</option>
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="table-wrap">
              <table className="demo-table">
                <thead>
                  <tr>
                    {(tab === "Customers"
                      ? [
                          "Customer",
                          "Devices",
                          "Repair jobs",
                          "Estimated value",
                        ]
                      : tab === "Devices"
                        ? [
                            "Device",
                            "Customer",
                            "Latest issue",
                            "Status",
                            "Job",
                          ]
                        : [
                            "Repair job",
                            "Customer & device",
                            "Status",
                            "Estimate",
                            "Received",
                            "",
                          ]
                    ).map((h, i) => (
                      <th key={i} scope="col">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tab === "Customers"
                    ? Array.from(new Set(filtered.map((j) => j.customer))).map(
                        (c) => {
                          const matches = jobs.filter((j) => j.customer === c);
                          return (
                            <tr key={c}>
                              <td>
                                <strong>{c}</strong>
                              </td>
                              <td>
                                {new Set(matches.map((j) => j.device)).size}
                              </td>
                              <td>{matches.length}</td>
                              <td>
                                {money(
                                  matches.reduce(
                                    (sum, j) => sum + j.estimate,
                                    0,
                                  ),
                                )}
                              </td>
                            </tr>
                          );
                        },
                      )
                    : tab === "Devices"
                      ? Array.from(
                          new Set(
                            filtered.map((j) => j.device + "|" + j.customer),
                          ),
                        ).map((key) => {
                          const j = filtered.find(
                            (j) => j.device + "|" + j.customer === key,
                          )!;
                          return (
                            <tr key={key}>
                              <td>
                                <strong>{j.device}</strong>
                              </td>
                              <td>{j.customer}</td>
                              <td>{j.issue}</td>
                              <td>
                                <span
                                  className={"pill " + statusClass(j.status)}
                                >
                                  {j.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="demo-job-link"
                                  onClick={() => setModal(j)}
                                >
                                  {j.id}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      : filtered.map((j) => (
                          <tr key={j.id}>
                            <td>
                              <button
                                className="demo-job-link"
                                onClick={() => setModal(j)}
                              >
                                {j.id}
                              </button>
                              <small>{j.issue}</small>
                            </td>
                            <td>
                              <strong>{j.customer}</strong>
                              <small>{j.device}</small>
                            </td>
                            <td>
                              <span className={"pill " + statusClass(j.status)}>
                                {j.status}
                              </span>
                            </td>
                            <td className="money-cell">{money(j.estimate)}</td>
                            <td>
                              {new Date(
                                j.date + "T12:00:00Z",
                              ).toLocaleDateString("en-NG", {
                                day: "numeric",
                                month: "short",
                              })}
                            </td>
                            <td>
                              <button
                                className="demo-open"
                                aria-label={"Open job " + j.id}
                                onClick={() => setModal(j)}
                              >
                                <ArrowUpRight size={17} />
                              </button>
                            </td>
                          </tr>
                        ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="empty">
                <Search size={26} />
                <h3>No matches found</h3>
                <p>Try another search or clear your filters.</p>
                <button
                  className="secondary-link"
                  onClick={() => {
                    setQuery("");
                    setStatus("All statuses");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
            <div className="demo-table-footer">
              <span>
                <span className="online-dot" /> {jobs.length} sample repair jobs
              </span>
              <span>Every detail. In its place.</span>
            </div>
          </section>
          <p className="demo-footnote">
            A Bespoke Technologies product · Built for the businesses that keep
            things working.
          </p>
        </main>
      </div>
      <nav className="demo-mobile-nav" aria-label="Mobile workspace">
        {["Overview", "Repair jobs", "Customers", "Devices"].map((t) => (
          <button
            key={t}
            className={tab === t ? "selected" : ""}
            onClick={() => navigate(t)}
          >
            {t}
          </button>
        ))}
      </nav>
      <dialog
        ref={dialogRef}
        className="demo-dialog"
        onCancel={() => setModal(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModal(null);
        }}
        aria-labelledby="dialog-title"
      >
        <div className="dialog-head">
          <div>
            <span className="section-kicker">REPAIR STUDIO</span>
            <h2 id="dialog-title">
              {modal === "new" ? "Check in a repair" : modal?.id}
            </h2>
          </div>
          <button
            aria-label="Close dialog"
            className="demo-open"
            onClick={() => setModal(null)}
          >
            <X size={20} />
          </button>
        </div>
        {modal === "new" ? (
          <form action={createJob} className="form-stack">
            <p className="muted">Try creating a job with fictional details.</p>
            <label className="field">
              <span>Customer name *</span>
              <input
                name="customer"
                required
                minLength={2}
                maxLength={120}
                placeholder="e.g. Alex Okoro"
              />
            </label>
            <label className="field">
              <span>Device *</span>
              <input
                name="device"
                required
                minLength={2}
                maxLength={120}
                placeholder="e.g. iPhone 14"
              />
            </label>
            <label className="field">
              <span>What needs fixing? *</span>
              <textarea
                name="issue"
                required
                minLength={5}
                maxLength={1000}
                rows={3}
                placeholder="Describe the issue…"
              />
            </label>
            <label className="field">
              <span>Estimated amount (₦)</span>
              <input
                name="estimate"
                type="number"
                min="0"
                max="1000000000"
                step="0.01"
                defaultValue="0"
                required
              />
            </label>
            <button className="site-button">
              <Plus size={17} /> Create repair job
            </button>
          </form>
        ) : (
          modal && (
            <form action={updateJob} className="form-stack">
              <div className="dialog-details">
                <div>
                  <span>Customer</span>
                  <strong>{modal.customer}</strong>
                </div>
                <div>
                  <span>Device</span>
                  <strong>{modal.device}</strong>
                </div>
                <div>
                  <span>Issue</span>
                  <strong>{modal.issue}</strong>
                </div>
                <div>
                  <span>Estimated amount</span>
                  <strong>{money(modal.estimate)}</strong>
                </div>
              </div>
              <label className="field">
                <span>Repair status</span>
                <select
                  name="status"
                  defaultValue={modal.status}
                  disabled={
                    modal.status === "Collected" || modal.status === "Cancelled"
                  }
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              {!["Collected", "Cancelled"].includes(modal.status) ? (
                <button className="site-button">
                  <Check size={17} /> Save status
                </button>
              ) : (
                <p className="muted">This repair is closed.</p>
              )}
              <p className="form-hint">
                Demo updates are saved only in this browser.
              </p>
            </form>
          )
        )}
      </dialog>
      <div className="demo-toast" role="status" aria-live="polite">
        {notice && (
          <span>
            <CircleCheck size={18} />
            {notice}
          </span>
        )}
      </div>
    </div>
  );
}
