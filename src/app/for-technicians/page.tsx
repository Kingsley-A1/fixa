import type {Metadata} from "next";
import Link from "next/link";
import {ArrowUpRight,ClipboardList,MonitorSmartphone,QrCode,ShieldCheck,UserRound} from "lucide-react";
import {PublicHeader} from "@/components/public-header";
import {PublicFooter} from "@/components/public-footer";
import {MobileDashboardPreview} from "@/components/mobile-dashboard-preview";
import {registrationEnabled} from "@/lib/config";

export const metadata:Metadata={
 title:"For Repair Technicians",
 description:"Run repair jobs, customer records and devices in Fixa's organised technician workspace. Learn how to register and manage repairs.",
 alternates:{canonical:"/for-technicians"}
};
const benefits=[
 {icon:ClipboardList,title:"Every repair, in order",text:"Record a device, follow job progress and see what needs your attention."},
 {icon:UserRound,title:"Customer details in one place",text:"Keep customer and device records connected to the work you're doing."},
 {icon:QrCode,title:"Clear service updates",text:"Share a service ticket and help customers follow their repair status."}
];

export default function ForTechnicians(){
 const open=registrationEnabled();
 return <div className="marketing fixa-technician-page">
  <PublicHeader mode="info"/>
  <main id="main-content">
   <section className="fixa-tech-hero" aria-labelledby="technician-hero-title">
    <div>
     <span className="fixa-customer-kicker">FIXA FOR TECHNICIANS</span>
     <h1 id="technician-hero-title">Great at repairs. <em>Now, great at running them.</em></h1>
     <p>Give your repair business a simpler way to organise customers, devices and jobs. Spend less time chasing notes and more time doing the work.</p>
     <div className="fixa-tech-cta">
      {open?<Link className="fixa-customer-pill" href="/register">Create technician account <ArrowUpRight size={17} aria-hidden="true"/></Link>:
       <span className="fixa-tech-registration-closed"><ShieldCheck size={18} aria-hidden="true"/> New registrations are temporarily closed.</span>}
      <Link href="/login" className="fixa-technician-signin">Already registered? Sign in <ArrowUpRight size={16} aria-hidden="true"/></Link>
     </div>
    </div>
    <div className="fixa-technician-card"><MobileDashboardPreview/></div>
   </section>
   <section className="fixa-tech-benefits" aria-labelledby="technician-benefits-heading">
    <div className="fixa-customer-section-head">
     <span className="fixa-customer-kicker">YOUR DAILY WORKFLOW</span>
     <h2 id="technician-benefits-heading">A practical system for the workbench.</h2>
     <p>No unnecessary steps. Just the information you need to keep repairs moving.</p>
    </div>
    <div className="fixa-tech-benefit-grid">
     {benefits.map(({icon:Icon,title,text})=><article key={title}>
      <Icon size={24} strokeWidth={1.6} aria-hidden="true"/>
      <h3>{title}</h3><p>{text}</p>
     </article>)}
    </div>
   </section>
   <section className="fixa-tech-journey" aria-labelledby="technician-journey-heading">
    <div>
     <span className="fixa-customer-kicker">GETTING STARTED</span>
     <h2 id="technician-journey-heading">Your workspace first. Your professional profile next.</h2>
     <p>Start by creating your account and setting up your repair business. Public technician profiles, where available, have a separate publication and review process.</p>
    </div>
    <ol>
     <li><span>01</span><div><strong>Create your account</strong><p>Register securely with your details.</p></div></li>
     <li><span>02</span><div><strong>Set up your workspace</strong><p>Record customers, devices and repair jobs.</p></div></li>
     <li><span>03</span><div><strong>Build your professional identity</strong><p>Add specialties and service areas, then submit your profile for review when the feature is available.</p></div></li>
    </ol>
   </section>
   <p className="fixa-tech-clarity"><MonitorSmartphone size={18} aria-hidden="true"/> Fixa provides tools and professional discovery; it does not certify repair competence automatically.</p>
  </main>
  <PublicFooter/>
 </div>;
}
