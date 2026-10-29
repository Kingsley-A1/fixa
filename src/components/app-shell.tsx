"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UsersRound,
  Smartphone,
  ClipboardList,
  Plus,
  LogOut,
  Wrench,
} from "lucide-react";
import { logout } from "@/app/actions";
const nav = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/jobs", label: "Repair jobs", icon: ClipboardList },
  { href: "/app/customers", label: "Customers", icon: UsersRound },
  { href: "/app/devices", label: "Devices", icon: Smartphone },
];
export function Logo() {
  return (
    <Link className="brand" href="/">
      <span className="mark">
        <Wrench size={18} strokeWidth={2.5} />
      </span>
      fixa<span className="brand-dot">.</span>
    </Link>
  );
}
export function AppShell({
  children,
  businessName,
  userName,
}: {
  children: React.ReactNode;
  businessName: string;
  userName: string;
}) {
  const path = usePathname();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <p className="sidebar-label eyebrow">Workspace</p>
        <nav className="side-nav">
          {nav.map((n) => {
            const Icon = n.icon;
            const active =
              n.href === "/app" ? path === "/app" : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={"nav-link " + (active ? "active" : "")}
              >
                <Icon size={18} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="side-bottom">
          <div className="business-label">
            <span className="avatar">
              {businessName.charAt(0).toUpperCase()}
            </span>
            <div>
              <strong style={{ fontSize: 12 }}>{businessName}</strong>
              <p className="muted" style={{ fontSize: 11 }}>
                Business workspace
              </p>
            </div>
          </div>
          <form action={logout} style={{ marginTop: 18 }}>
            <button
              className="nav-link"
              style={{ width: "100%", border: 0, background: "none" }}
            >
              <LogOut size={17} /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="mobile-header">
            <Logo />
          </div>
          <div className="breadcrumb muted" style={{ fontSize: 12 }}>
            Workspace <span style={{ padding: "0 9px" }}>/</span>{" "}
            <strong style={{ color: "#2c3540" }}>
              {path === "/app"
                ? "Overview"
                : path.split("/").filter(Boolean).slice(1).join(" / ")}
            </strong>
          </div>
          <div className="top-right">
            <span className="muted" style={{ fontSize: 12 }}>
              Hi, {userName.split(" ")[0]}
            </span>
            <span className="avatar">{userName.charAt(0).toUpperCase()}</span>
          </div>
        </header>
        {children}
      </div>
      <nav className="mobile-nav">
        {nav.map((n) => {
          const Icon = n.icon;
          return (
            <Link
              className={
                (n.href === "/app" ? path === "/app" : path.startsWith(n.href))
                  ? "active"
                  : ""
              }
              key={n.href}
              href={n.href}
            >
              <Icon size={21} />
              {n.label}
            </Link>
          );
        })}
        <Link href="/app/jobs/new">
          <Plus size={22} />
          New job
        </Link>
      </nav>
    </div>
  );
}
