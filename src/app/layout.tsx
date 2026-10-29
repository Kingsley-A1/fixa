import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:{default:"Fixa — Repair businesses, better managed.",template:"%s · Fixa"},description:"One clean workspace for repair customers, devices and jobs."};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
