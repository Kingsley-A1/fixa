import type {Metadata} from "next";
import Link from "next/link";
import {ArrowUpRight,CheckCircle2,Headphones,Laptop,MapPin,MessageCircle,Search,ShieldCheck,Smartphone,Star,UserRound} from "lucide-react";
import {PublicHeader} from "@/components/public-header";
import {PublicFooter} from "@/components/public-footer";
import {MobileDashboardPreview} from "@/components/mobile-dashboard-preview";

export const metadata:Metadata={
 title:"Find repair technicians with more confidence",
 description:"Explore repair technicians by location and specialty. Understand their services and published customer feedback before choosing who repairs your device.",
 alternates:{canonical:"/"}
};

const choiceSteps=[
 {number:"01",icon:MapPin,title:"Look nearby",text:"Start with your city or area. Location sharing is always your choice."},
 {number:"02",icon:Star,title:"Learn before you choose",text:"Explore specialties, service areas and available customer feedback."},
 {number:"03",icon:MessageCircle,title:"Speak directly",text:"Contact the technician, ask questions and agree on the repair."}
];
const reasons=[
 {icon:Search,title:"Know what they work on",text:"Find technicians by repair specialty, not simply by who is closest."},
 {icon:ShieldCheck,title:"See more of the picture",text:"Read published profile details and feedback before making a decision."},
 {icon:CheckCircle2,title:"Stay in control",text:"You choose who to contact and agree on the work directly with them."}
];
const categories=[
 {icon:Smartphone,title:"Phones",detail:"Screen, charging, software and other phone repairs."},
 {icon:Laptop,title:"Computers",detail:"Laptop and desktop diagnostics and servicing."},
 {icon:Headphones,title:"Other electronics",detail:"Gadgets and electronics, according to each technician's specialties."}
];

export default function Home(){
 const discoveryOpen=process.env.ENABLE_DISCOVERY==="true";
 return <div className="marketing fixa-customer-home">
  <PublicHeader mode="home" discoveryOpen={discoveryOpen}/>
  <main id="main-content">
   <section className="fixa-customer-hero" aria-labelledby="customer-hero-title">
    <div className="fixa-customer-hero-copy">
     <p className="fixa-customer-eyebrow"><span aria-hidden="true"/> BETTER CHOICES. BETTER REPAIR EXPERIENCES.</p>
     <h1 id="customer-hero-title">Find repair help, <em>with more confidence.</em></h1>
     <p className="fixa-customer-lede">{discoveryOpen?
       "Explore repair professionals near you. See what they work on, where they serve and what customers have shared—before handing over your device.":
       "Good repair decisions start with better information. Fixa is building a clearer way to discover and evaluate repair professionals in your area."}</p>
     <p className="fixa-customer-reassurance"><ShieldCheck size={18} strokeWidth={1.7} aria-hidden="true"/> Your device. Your decision.</p>
    </div>
    <aside className="fixa-customer-guide" aria-label="How Fixa helps you choose">
     <div className="fixa-customer-guide-top"><span>THE FIXA APPROACH</span><span>01 / 03</span></div>
     <h2>Know more.<br/>Guess less.</h2>
     <div className="fixa-customer-guide-rows">
      <div><span className="fixa-customer-guide-icon"><MapPin size={20}/></span><div><strong>Where they work</strong><p>Know their service area.</p></div><span>01</span></div>
      <div><span className="fixa-customer-guide-icon"><UserRound size={20}/></span><div><strong>What they repair</strong><p>Look for relevant specialties.</p></div><span>02</span></div>
      <div><span className="fixa-customer-guide-icon"><Star size={20}/></span><div><strong>What people say</strong><p>Read available customer experiences.</p></div><span>03</span></div>
     </div>
     <p className="fixa-customer-guide-note">Information helps you decide. It is not a guarantee of workmanship.</p>
    </aside>
   </section>

   <section className="fixa-customer-reason" aria-labelledby="why-fixa">
    <div className="fixa-customer-section-head">
     <span className="fixa-customer-kicker">WHY FIXA</span>
     <h2 id="why-fixa">A repair shouldn&apos;t begin with a blind guess.</h2>
     <p>People should have clearer information before trusting someone with a phone, computer or other device.</p>
    </div>
    <div className="fixa-customer-reasons">
     {reasons.map(({icon:Icon,title,text})=><article key={title}>
       <Icon size={25} strokeWidth={1.6} aria-hidden="true"/>
       <h3>{title}</h3><p>{text}</p>
      </article>)}
    </div>
   </section>

   <section id="how-it-works" className="fixa-customer-how" aria-labelledby="customer-how-title">
    <div className="fixa-customer-section-head">
     <span className="fixa-customer-kicker">HOW IT WORKS</span>
     <h2 id="customer-how-title">A clearer way to find repair help.</h2>
     <p>A simple path from needing a repair to speaking with someone who may be able to help.</p>
    </div>
    <ol className="fixa-customer-steps">
     {choiceSteps.map(({number,icon:Icon,title,text})=><li key={number}>
       <div className="fixa-customer-step-top"><Icon size={21} strokeWidth={1.65} aria-hidden="true"/><span>{number}</span></div>
       <h3>{title}</h3><p>{text}</p>
      </li>)}
    </ol>
    {discoveryOpen?<Link className="fixa-customer-discover-link" href="/find">Explore available technicians <ArrowUpRight size={17} aria-hidden="true"/></Link>:
    <p className="fixa-customer-availability">Public discovery is being prepared. Technician workspaces remain separate.</p>}
   </section>

   <section className="fixa-customer-categories" aria-labelledby="customer-categories-title">
    <div className="fixa-customer-section-head">
     <span className="fixa-customer-kicker">REPAIR CATEGORIES</span>
     <h2 id="customer-categories-title">For the devices you rely on.</h2>
     <p>Technician availability and specialties differ by location.</p>
    </div>
    <div className="fixa-customer-category-grid">
     {categories.map(({icon:Icon,title,detail})=><article key={title}>
      <Icon size={27} strokeWidth={1.65} aria-hidden="true"/>
      <h3>{title}</h3><p>{detail}</p>
     </article>)}
    </div>
   </section>

   <section className="fixa-technician-teaser" aria-labelledby="technician-teaser-heading">
    <div className="fixa-technician-teaser-copy">
     <span className="fixa-customer-kicker">FOR THE PEOPLE WHO DO THE REPAIRS</span>
     <h2 id="technician-teaser-heading">Great repair work deserves a better workspace.</h2>
     <p>Fixa helps technicians keep customer details, devices and jobs organised—so the work, not the paperwork, stays in focus.</p>
     <Link href="/for-technicians" className="fixa-customer-pill">Explore Fixa for technicians <ArrowUpRight size={17} aria-hidden="true"/></Link>
    </div>
    <div className="fixa-technician-card"><MobileDashboardPreview/></div>
   </section>
  </main>
  <PublicFooter/>
 </div>;
}
