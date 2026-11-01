import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./public-layout.css";
import "./customer-home.css";
import {PwaProvider} from "@/components/pwa-provider";
export const viewport:Viewport={themeColor:"#203e32",width:"device-width",initialScale:1};
export const metadata: Metadata = {
  manifest:"/manifest.webmanifest",
  appleWebApp:{capable:true,title:"Fixa",statusBarStyle:"default"},
  metadataBase: new URL("https://fixa.bespoketech.com.ng"),
  title: {
    default: "Fixa — Find repair technicians with more confidence.",
    template: "%s · Fixa",
  },
  description: "Explore local repair technicians by location and specialty. Review available profiles and customer experiences before making contact.",
  applicationName: "Fixa",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Fixa",
    url: "https://fixa.bespoketech.com.ng",
    title: "Fixa — Find repair technicians with more confidence.",
    description: "Make more informed repair decisions. Explore technicians near you, their specialties and available customer feedback.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Fixa repair management workspace" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fixa — Find repair technicians with more confidence.",
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
        <PwaProvider>{children}</PwaProvider>
      </body>
    </html>
  );
}
