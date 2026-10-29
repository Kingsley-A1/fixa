"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="empty" style={{ minHeight: "80dvh" }}>
      <h1>Something interrupted your workspace.</h1>
      <p>Please try again. If the problem continues, return to the homepage.</p>
      <button className="site-button" onClick={reset}>
        Try again
      </button>
      <Link href="/">Back to Fixa</Link>
    </main>
  );
}
