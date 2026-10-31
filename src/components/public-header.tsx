import Link from "next/link";
import {ArrowUpRight,Menu} from "lucide-react";
import {FixaWordmark} from "@/components/fixa-wordmark";

type HeaderMode="home"|"info"|"discovery"|"profile";
type NavItem={href:string;label:string};
const info:NavItem[]=[{href:"/",label:"Home"},{href:"/about",label:"About"},{href:"/faq",label:"FAQ"},{href:"/support",label:"Support"}];
export function PublicHeader({mode="info",discoveryOpen=false}:{mode?:HeaderMode;discoveryOpen?:boolean}){
 const items:NavItem[]=mode==="home"?
  [...(discoveryOpen?[{href:"/find",label:"Find technicians"}]:[]),
   {href:"/#features",label:"Why Fixa"},{href:"/#workflow",label:"How it works"},{href:"/demo",label:"Explore the workspace"}]:
  mode==="discovery"?
  [{href:"/",label:"Home"},{href:"/about",label:"About Fixa"},{href:"/demo",label:"Workspace demo"},{href:"/faq",label:"FAQ"}]:
  mode==="profile"?
  [{href:"/find",label:"Find technicians"},{href:"/about",label:"About Fixa"},{href:"/faq",label:"FAQ"},{href:"/support",label:"Support"}]:
  info;
 return <header className="site-header fixa-public-header">
  <FixaWordmark/>
  <nav className="fixa-header-desktop" aria-label="Main navigation">
   {items.map(item=><Link key={item.href} href={item.href}>{item.label}</Link>)}
  </nav>
  <div className="fixa-header-actions">
   <Link href="/login" className="login-link fixa-header-signin">Sign in <ArrowUpRight size={16} aria-hidden="true"/></Link>
   <details className="fixa-mobile-menu">
    <summary className="fixa-menu-toggle" aria-label="Open navigation"><Menu size={20} strokeWidth={1.8} aria-hidden="true"/></summary>
    <div className="fixa-menu-popover">
     <nav aria-label="Compact navigation">
      {items.map(item=><Link key={item.href} href={item.href}>{item.label}</Link>)}
     </nav>
    </div>
   </details>
  </div>
 </header>;
}
