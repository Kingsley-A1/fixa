import type {ReactNode} from "react";
import {PublicHeader} from "@/components/public-header";
import {PublicFooter} from "@/components/public-footer";

export const policyUpdated="30 October 2026";
type InfoPage="about"|"faq"|"support"|"policy";

export function PublicInfoLayout({eyebrow,title,intro,children,kind="policy",page}:{eyebrow:string;title:string;intro:string;children:ReactNode;kind?:"policy"|"support";page?:InfoPage}){
 const actualPage=page||(kind==="policy"?"policy":"support");
 return <div className={"marketing fixa-info-site fixa-info-page--"+actualPage}>
  <PublicHeader mode="info"/>
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
