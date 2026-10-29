import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="empty" style={{ minHeight: "80dvh" }}>
      <span className="section-kicker">404 · NOTHING ON THIS WORKBENCH</span>
      <h1>That page isn’t here.</h1>
      <p>Let’s get you back to something useful.</p>
      <Link href="/" className="site-button">
        Back to Fixa
      </Link>
    </main>
  );
}
