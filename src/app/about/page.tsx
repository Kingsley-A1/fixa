import type {Metadata} from "next";
import Link from "next/link";
import {ArrowUpRight,ClipboardList,MapPin,ShieldCheck} from "lucide-react";
import {PublicInfoLayout} from "@/components/public-info-layout";

export const metadata:Metadata={
 title:"About Fixa",
 description:"Fixa helps repair professionals manage jobs and helps customers make informed decisions when finding repair services. Built by Bespoke Technologies.",
 alternates:{canonical:"/about"}
};

export default function AboutPage(){
 return <PublicInfoLayout kind="support" page="about" eyebrow="ABOUT FIXA" title="Good repairs deserve better systems." intro="Fixa brings order to repair work and helps people discover repair professionals with clearer information.">
  <div className="fixa-about">
   <section className="fixa-about-lead">
    <h2>Made for the work behind every repair.</h2>
    <p>A repair is more than a device on a workbench. There is a customer waiting, a problem to understand, progress to communicate and a handover to get right. Fixa exists to make that process easier to manage and easier to follow.</p>
   </section>
   <section className="fixa-about-pillars" aria-label="What Fixa is built to do">
    <article>
     <ClipboardList size={23} strokeWidth={1.7} aria-hidden="true"/>
     <h3>Keep the work organised.</h3>
     <p>Bring customers, devices, repair jobs and service progress into one dependable workspace.</p>
    </article>
    <article>
     <MapPin size={23} strokeWidth={1.7} aria-hidden="true"/>
     <h3>Make discovery easier.</h3>
     <p>As public discovery becomes available, help people find repair professionals by location and the work they handle.</p>
    </article>
    <article>
     <ShieldCheck size={23} strokeWidth={1.7} aria-hidden="true"/>
     <h3>Let evidence build trust.</h3>
     <p>Clear professional profiles, appropriately checked information, genuine feedback and work shared with permission.</p>
    </article>
   </section>
   <section className="fixa-about-principle">
    <p className="section-kicker">OUR APPROACH</p>
    <h2>Useful first. Trustworthy throughout.</h2>
    <p>We believe capable technicians should be easier to discover, and customers should have better information before handing over their devices. Fixa does not guarantee that every listed technician will deliver a particular outcome. Contact and location checks do not amount to certification of technical skill.</p>
   </section>
   <section className="fixa-about-built">
    <h2>Built by Bespoke Technologies.</h2>
    <p>Fixa is a product of <a href="https://bespoketech.com.ng" target="_blank" rel="noopener noreferrer">Bespoke Technologies</a>, developed with a focus on practical technology, thoughtful design and long-term reliability.</p>
    <div className="fixa-about-actions">
     <Link className="fixa-support-primary" href="/demo">Explore the workspace <ArrowUpRight size={17} aria-hidden="true"/></Link>
     <Link className="fixa-about-text-link" href="/faq">Questions about Fixa? <ArrowUpRight size={16} aria-hidden="true"/></Link>
    </div>
   </section>
  </div>
 </PublicInfoLayout>;
}
