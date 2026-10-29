import { workspaceConfigured } from "@/lib/config";
import { WorkspaceUnavailable } from "@/components/workspace-unavailable";
import Link from "next/link";
import { Logo } from "@/components/app-shell";
import { FormShell, Field } from "@/components/forms";
import { login } from "@/app/actions";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Login() {
  if (!workspaceConfigured()) return <WorkspaceUnavailable />;
  if (await currentUser()) redirect("/app");
  return (
    <main id="main-content" className="auth-layout">
      <section className="auth-left">
        <Logo />
        <div className="auth-content fade-in">
          <p className="eyebrow">WELCOME BACK</p>
          <h1>
            Your workspace,
            <br />
            ready when you are.
          </h1>
          <p>Sign in to keep your repairs moving.</p>
          <FormShell action={login} button="Sign in to Fixa">
            <Field
              name="email"
              label="Email address"
              type="email"
              placeholder="you@business.com"
              required
            />
            <Field
              name="password"
              label="Password"
              type="password"
              placeholder="Your password"
              required
            />
          </FormShell>
          <p className="muted" style={{ marginTop: 22 }}>
            New to Fixa?{" "}
            <Link className="text-link" href="/register">
              Create an account <ArrowUpRight size={15} />
            </Link>
          </p>
        </div>
        <footer>© 2026 Fixa · A Bespoke Technologies product</footer>
      </section>
      <aside className="auth-right">
        <div className="auth-topnote">
          <span>
            <ShieldCheck size={17} />
          </span>{" "}
          Built for the businesses that keep things working.
        </div>
        <div>
          <h2>
            Every repair.
            <br />
            Every customer.
            <br />
            Perfectly in order.
          </h2>
          <p style={{ marginTop: 18 }}>
            Less paperwork. More clarity. Better service.
          </p>
        </div>
        <p>Repair businesses, better managed.</p>
      </aside>
    </main>
  );
}
