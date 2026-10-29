import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://fixa.bespoketech.com.ng"),
  title: {
    default: "Fixa — Repair businesses, better managed.",
    template: "%s · Fixa",
  },
  description: "Manage customers, devices and repair jobs in one calm, organized workspace. Fixa is built for independent repair businesses in Nigeria.",
  applicationName: "Fixa",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Fixa",
    url: "https://fixa.bespoketech.com.ng",
    title: "Fixa — Repair businesses, better managed.",
    description: "Great at repairs. Now, great at running them. One beautiful workspace for customers, devices, and repair jobs.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Fixa repair management workspace" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fixa — Repair businesses, better managed.",
    description: "Great at repairs. Now, great at running them.",
    images: ["/opengraph-image"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
