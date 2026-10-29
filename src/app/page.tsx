import Link from "next/link";
import { FixaWordmark } from "@/components/fixa-wordmark";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Smartphone,
  ClipboardList,
  UsersRound,
  QrCode,
  ShieldCheck,
  ChevronRight,
  CircleCheck,
  Laptop,
  Headphones,
} from "lucide-react";
const repairs = [
  {
    name: "iPhone 13 Pro",
    issue: "Screen replacement",
    customer: "Amaka Okafor",
    status: "In progress",
    color: "blue",
    icon: Smartphone,
  },
  {
    name: "MacBook Air M2",
    issue: "Battery replacement",
    customer: "David Adeyemi",
    status: "Ready to collect",
    color: "green",
    icon: Laptop,
  },
  {
    name: "Samsung Galaxy S23",
    issue: "Charging port repair",
    customer: "Tolu Bakare",
    status: "Diagnosing",
    color: "amber",
    icon: Smartphone,
  },
];
export default function Home() {
  return (
    <div className="marketing">
      <header className="site-header">
        <FixaWordmark />
        <nav aria-label="Main navigation">
          <a href="#features">Why Fixa</a>
          <a href="#workflow">How it works</a>
          <Link href="/demo">
            Explore the workspace <ArrowUpRight size={14} />
          </Link>
        </nav>
        <Link href="/login" className="login-link">
          Sign in <ArrowUpRight size={16} />
        </Link>
      </header>
      <main id="main-content">
        <section className="hero">
          <div className="hero-copy">
            <div className="release-tag">
              <span /> A little less admin. A lot more repair.
            </div>
            <h1>
              Great at repairs.
              <br />
              Now, great at
              <br />
              <em>running them.</em>
            </h1>
            <p>
              Your customers, devices, and repair jobs. Finally together in one
              calm, organized workspace.
            </p>
            <div className="hero-actions">
              <Link className="site-button" href="/demo">
                Explore the live demo <ArrowUpRight size={18} />
              </Link>
              <a className="secondary-link" href="#workflow">
                See how it works <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-note">
              <ShieldCheck size={15} /> Built for independent repair businesses
              in Nigeria.
            </div>
          </div>
          <div className="hero-product">
            <div className="product-window">
              <div className="window-top">
                <span className="mini-wordmark">fixa<span>.</span></span>
                <span>YOUR BUSINESS, AT A GLANCE</span>
                <span className="window-dots">•••</span>
              </div>
              <div className="window-body">
                <div className="window-greeting">
                  <div>
                    <span className="tiny-label">THURSDAY, 29 OCTOBER</span>
                    <h2>A clearer day starts here.</h2>
                    <p>Let’s keep those repairs moving.</p>
                  </div>
                  <span className="shop-avatar">AO</span>
                </div>
                <div className="preview-stats">
                  <div>
                    <span>
                      Active repairs <ClipboardList size={14} />
                    </span>
                    <strong>
                      24<small>in your care</small>
                    </strong>
                  </div>
                  <div>
                    <span>
                      Ready for pickup <CircleCheck size={14} />
                    </span>
                    <strong>
                      08<small className="green-text">Good to go ↗</small>
                    </strong>
                  </div>
                </div>
                <div className="preview-table-title">
                  <strong>On the workbench</strong>
                  <span>
                    View all <ArrowUpRight size={12} />
                  </span>
                </div>
                {repairs.map((r) => (
                  <div className="preview-repair" key={r.name}>
                    <span className="device-icon">
                      <r.icon size={20} />
                    </span>
                    <div>
                      <strong>{r.name}</strong>
                      <p>{r.issue}</p>
                    </div>
                    <span className={"status-chip " + r.color}>{r.status}</span>
                  </div>
                ))}
                <div className="preview-bottom">
                  <span>
                    <span className="online-dot" /> Everything in its place.
                  </span>
                  <span>Sample workspace</span>
                </div>
              </div>
            </div>
            <div className="floating-ticket">
              <span className="ticket-check">
                <Check size={19} />
              </span>
              <div>
                <strong>Repair done. Customer updated.</strong>
                <p>One less thing on your mind.</p>
              </div>
              <QrCode size={30} />
            </div>
            <div className="product-caption">
              <span>01 /</span> LESS CHAOS. MORE CLARITY.
            </div>
          </div>
        </section>
        <section
          className="trust-strip"
          aria-label="Supported repair businesses"
        >
          <p>
            For the people who
            <br />
            <strong>keep things working.</strong>
          </p>
          <span>
            <Smartphone size={21} /> Phone repairs
          </span>
          <span>
            <Laptop size={23} /> Computer repairs
          </span>
          <span>
            <Headphones size={23} /> Electronics repairs
          </span>
          <div className="made-for">
            <span>DESIGNED WITH PURPOSE</span>Built for your everyday.
          </div>
        </section>
        <section id="features" className="features-section">
          <div className="section-intro">
            <div>
              <span className="section-kicker">
                A WORKSPACE THAT WORKS FOR YOU
              </span>
              <h2>
                Your work is hands-on.
                <br />
                Your admin shouldn’t be.
              </h2>
            </div>
            <p>
              From the first “can you fix this?” to the final pickup. Keep every
              detail close, and every job moving.
            </p>
          </div>
          <div className="feature-grid">
            {[
              {
                n: "01",
                icon: ClipboardList,
                title: "Every repair, in order.",
                copy: "Track jobs from check-in to collection. Know what needs attention without digging through a notebook.",
              },
              {
                n: "02",
                icon: UsersRound,
                title: "People, not just tickets.",
                copy: "Keep customer details and device history together. Give familiar service, even on your busiest day.",
              },
              {
                n: "03",
                icon: QrCode,
                title: "Clarity they can take home.",
                copy: "Share a digital service ticket with a QR link. Your customers can check repair status without another call.",
              },
            ].map((f) => (
              <article key={f.n}>
                <div className="feature-top">
                  <f.icon size={25} strokeWidth={1.5} />
                  <span>{f.n}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.copy}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="workflow" className="workflow-section">
          <div>
            <span className="section-kicker">
              A SIMPLE ROUTINE. A BETTER DAY.
            </span>
            <h2>
              From dropped off
              <br />
              to <em>sorted out.</em>
            </h2>
            <Link href="/demo" className="secondary-link">
              Take a look inside <ArrowUpRight size={18} />
            </Link>
          </div>
          <ol>
            {[
              {
                title: "Check it in",
                copy: "Add the customer, their device, and what needs fixing.",
              },
              {
                title: "Keep it moving",
                copy: "Record the estimate, track progress, and stay on top of due dates.",
              },
              {
                title: "Send it home",
                copy: "Mark it ready, share the service ticket, and record collection.",
              },
            ].map((s, i) => (
              <li key={s.title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.copy}</p>
                </div>
                <ChevronRight size={18} />
              </li>
            ))}
          </ol>
        </section>
        <section className="closing-section">
          <span className="section-kicker">MAKE ROOM FOR BETTER WORK</span>
          <h2>
            A little more order.
            <br />A lot more possibility.
          </h2>
          <p>Meet a calmer way to manage your repair business.</p>
          <Link className="site-button" href="/demo">
            Try the interactive demo <ArrowUpRight size={18} />
          </Link>
          <small>No sign-up needed. Sample data only.</small>
        </section>
      </main>
      <footer className="site-footer">
        <FixaWordmark />
        <p>Repair businesses, better managed.</p>
        <span>© {new Date().getFullYear()} Bespoke Technologies</span>
        <a
          href="https://github.com/Kingsley-A1/fixa"
          target="_blank"
          rel="noreferrer"
        >
          Built in the open <ArrowUpRight size={14} />
        </a>
      </footer>
    </div>
  );
}
