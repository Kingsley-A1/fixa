import Link from "next/link";

/** One wordmark across the public site, demo, app shell, and service tickets. */
export function FixaWordmark({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="Fixa home"
      className={["site-logo", "fixa-wordmark", className].filter(Boolean).join(" ")}
    >
      fixa<span className="fixa-dot">.</span>
    </Link>
  );
}
