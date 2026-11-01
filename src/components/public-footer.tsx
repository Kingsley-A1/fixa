import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import {FixaWordmark} from "@/components/fixa-wordmark";

/** Only public marketing, information and discovery pages. Never mount in the private workspace. */
export function PublicFooter(){
 const directoryOpen=process.env.ENABLE_DISCOVERY==="true";
 return <footer className="site-footer fixa-public-footer">
  <div className="fixa-footer-identity">
   <FixaWordmark/>
   <p>Better repair choices. Clearer repair work.</p>
  </div>
  <Link href="/demo" className="fixa-footer-demo">Explore the live demo <ArrowUpRight size={16} aria-hidden="true"/></Link>
  <nav aria-label="Fixa information and legal">
   {directoryOpen&&<Link href="/find">Find technicians</Link>}
   <Link href="/for-technicians">For technicians</Link>
   <Link href="/about">About</Link>
   <Link href="/faq">FAQ</Link>
   <Link href="/terms">Terms</Link>
   <Link href="/privacy">Privacy</Link>
   <Link href="/support">Support</Link>
  </nav>
  <span>© {new Date().getFullYear()} Bespoke Technologies</span>
 </footer>;
}
