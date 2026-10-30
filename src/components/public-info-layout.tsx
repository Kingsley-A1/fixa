import type {ReactNode} from "react";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import {FixaWordmark} from "@/components/fixa-wordmark";
import {PublicFooter} from "@/components/public-footer";

export const policyUpdated="30 October 2026";

export function PublicInfoLayout({eyebrow,title,intro,children,kind="policy"}:{eyebrow:string;title:string;intro:string;children:ReactNode;kind?:"policy"|"support"}){
 return <div className="marketing fixa-info-site">
  <header className="site-header fixa-info-header">
   <FixaWordmark/>
   <nav aria-label="Information pages"><Link href="/">Home</Link><Link href="/support">Support</Link></nav>
   <Link className="login-link" href="/login">Sign in <ArrowUpRight size={16}/></Link>
  </header>
  <main id="main-content" className="fixa-info-main">
   <div className="fixa-info-intro">
    <p className="section-kicker">{eyebrow}</p>
    <h1>{title}</h1>
    <p className="fixa-info-lead">{intro}</p>
    {kind==="policy"&&<p className="fixa-info-updated">Last updated: {policyUpdated}</p>}
   </div>
   <div className="fixa-info-content">{children}</div>
  </main>
  <PublicFooter/>
 </div>;
}
