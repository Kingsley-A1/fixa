import { registrationEnabled } from "@/lib/config";
import { WorkspaceUnavailable } from "@/components/workspace-unavailable";
import Link from "next/link";
import { Logo } from "@/components/app-shell";
import { FormShell, Field } from "@/components/forms";
import { register } from "@/app/actions";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { currentUser } from "@/lib/auth";
import { googleConfigured } from "@/lib/google-oauth";
import { GoogleSignIn } from "@/components/google-sign-in";
import { redirect } from "next/navigation";
export default async function Register() {
  if (!registrationEnabled()) return <WorkspaceUnavailable registration />;
  if (await currentUser()) redirect("/app");
  return (
    <main id="main-content" className="auth-layout">
      <section className="auth-left">
        <Logo />
        <div className="auth-content fade-in">
          <p className="eyebrow">GET STARTED</p>
          <h1>
            A better way
            <br />
            to run repairs.
          </h1>
          <p>Start with your account. Your workspace comes next.</p>
          {googleConfigured()&&<div style={{marginTop:24,marginBottom:20}}><GoogleSignIn/><p className="auth-divider">or continue with email</p></div>}
          <FormShell action={register} button="Create account">
            <Field
              name="name"
              label="Full name"
              placeholder="Your name"
              required
            />
            <Field
              name="email"
              label="Work email"
              type="email"
              placeholder="you@business.com"
              required
            />
            <Field
              name="password"
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              required
              minLength={8}
            />
          </FormShell>
          <p className="muted" style={{ marginTop: 22 }}>
            Already registered?{" "}
            <Link className="text-link" href="/login">
              Sign in <ArrowUpRight size={15} />
            </Link>
          </p>
        </div>
        
        <footer>© 2026 Fixa · A <a href="https://bespoketech.com.ng" target="_blank" rel="noopener noreferrer" className="text-link">
          Bespoke Technologies
        </a> product</footer>
      </section>
      <aside className="auth-right">
        <div className="auth-topnote">
          <CheckCircle2 size={19} /> Built for your daily workflow.
        </div>
        <div>
          <h2>
            Organized work.
            <br />
            Happier customers.
            <br />A clearer day.
          </h2>
          <p style={{ marginTop: 18 }}>
            A thoughtful workspace for growing repair businesses.
          </p>
        </div>
        <p>Repair businesses, better managed.</p>
      </aside>
    </main>
  );
}
