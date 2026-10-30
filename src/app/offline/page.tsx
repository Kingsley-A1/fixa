import type {Metadata} from "next";
import Link from "next/link";
import {WifiOff,RefreshCw} from "lucide-react";
import {FixaWordmark} from "@/components/fixa-wordmark";
export const metadata:Metadata={
 title:"Connection unavailable",
 robots:{index:false,follow:false}
};
export default function OfflinePage(){
 return <main id="main-content" className="fixa-offline">
  <FixaWordmark/>
  <div className="fixa-offline-content">
   <WifiOff size={30} strokeWidth={1.5} aria-hidden="true"/>
   <h1>You're offline.</h1>
   <p>Fixa needs a connection to keep your repair records accurate. Nothing has been changed.</p>
   <Link className="btn primary" href="/app"><RefreshCw size={16} aria-hidden="true"/> Try again</Link>
  </div>
 </main>;
}
