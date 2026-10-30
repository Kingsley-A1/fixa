import Link from "next/link";
import {FixaWordmark} from "@/components/fixa-wordmark";

/** Public informational and discovery pages only. Do not mount in the root layout. */
export function PublicFooter(){
 return <footer className="site-footer fixa-public-footer">
  <div className="fixa-footer-identity">
   <FixaWordmark/>
   <p>Repair businesses, better managed.</p>
  </div>
  <nav aria-label="Fixa information and legal">
   <Link href="/about">About</Link>
   <Link href="/faq">FAQ</Link>
   <Link href="/terms">Terms</Link>
   <Link href="/privacy">Privacy</Link>
   <Link href="/support">Support</Link>
  </nav>
  <span>© {new Date().getFullYear()} Bespoke Technologies</span>
 </footer>;
}
