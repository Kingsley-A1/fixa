import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { FixaWordmark } from "@/components/fixa-wordmark";
export function WorkspaceUnavailable({
  registration = false,
}: {
  registration?: boolean;
}) {
  return (
    <main id="main-content" className="auth-layout">
      <section className="auth-left">
        <FixaWordmark />
        <div className="auth-content">
          <span className="section-kicker">WELCOME TO FIXA</span>
          <h1>
            {registration
              ? "A better workspace is taking shape."
              : "Take a look around."}
          </h1>
          <p>
            {registration
              ? "Public registration is not open yet. Explore the interactive demo to see how Fixa keeps repairs in order."
              : "This deployment is available for a product preview. Business sign-in will be available once the workspace is connected."}
          </p>
          <Link href="/demo" className="site-button">
            Explore the demo <ArrowUpRight size={18} />
          </Link>
          <Link href="/" className="secondary-link" style={{ marginTop: 14 }}>
            Back to Fixa
          </Link>
        </div>
        <footer>
          © {new Date().getFullYear()} Fixa · A Bespoke Technologies product
        </footer>
      </section>
      <aside className="auth-right" style={{ background: "#234b3c" }}>
        <div className="auth-topnote">
          <ShieldCheck size={19} /> Built for the businesses that keep things
          working.
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
