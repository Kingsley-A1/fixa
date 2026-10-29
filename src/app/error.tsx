"use client";
import Link from "next/link";
import { useEffect } from "react";
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[fixa] unhandled error in route:", error);
  }, [error]);
  return (
    <main id="main-content" className="empty" style={{ minHeight: "80dvh" }}>
      <h1>Something interrupted your workspace.</h1>
      <p>Please try again. If the problem continues, return to the homepage.</p>
      {(error.digest || process.env.NODE_ENV !== "production") && (
        <p style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>
          {error.digest && <>Reference: {error.digest} </>}
          {process.env.NODE_ENV !== "production" && error.message}
        </p>
      )}
      <button className="site-button" onClick={reset}>
        Try again
      </button>
      <Link href="/">Back to Fixa</Link>
    </main>
  );
}
