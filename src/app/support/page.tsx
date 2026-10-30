import type {Metadata} from "next";
import Link from "next/link";
import {ArrowUpRight,Mail,MessageCircle,ShieldAlert} from "lucide-react";
import {PublicInfoLayout} from "@/components/public-info-layout";

export const metadata:Metadata={title:"Support",description:"Get help with your Fixa account, technician listing, repair-management workspace, privacy or review concerns.",alternates:{canonical:"/support"}};
const whatsapp="https://wa.me/2348088071657?text=Hello%20Fixa%20Support%2C%20I%20need%20assistance.";

export default function SupportPage(){
 return <PublicInfoLayout kind="support" eyebrow="SUPPORT · WE'RE HERE TO HELP" title="How can we help?" intro="Account questions, repair workspace problems or technician listing concerns — reach the Bespoke Technologies team supporting Fixa.">
  <div className="fixa-support">
   <section className="fixa-support-contact" aria-labelledby="reach-us">
    <h2 id="reach-us">Contact our team</h2>
    <p>Choose the channel that works for you. Include a short description of the problem and, if useful, the relevant Fixa job reference — not private customer records.</p>
    <div className="fixa-support-actions">
     <a className="fixa-support-primary" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={19}/> Chat on WhatsApp <ArrowUpRight size={16}/></a>
     <a className="fixa-support-secondary" href="mailto:fixa@bespoketech.com.ng?subject=Fixa%20Support%20Request"><Mail size={19}/> Email Fixa <ArrowUpRight size={16}/></a>
    </div>
   </section>
   <section className="fixa-support-topics" aria-labelledby="topics">
    <h2 id="topics">What do you need help with?</h2>
    <div className="fixa-support-topic">
      <span>01</span><div><h3>Account and access</h3><p>Sign-in trouble, email verification, Google account linking or business workspace access.</p></div>
    </div>
    <div className="fixa-support-topic">
      <span>02</span><div><h3>Technician profiles and reviews</h3><p>Listing corrections, approval questions, published work, customer feedback or concerns about a technician.</p></div>
    </div>
    <div className="fixa-support-topic">
      <span>03</span><div><h3>Privacy and safety</h3><p>Personal information requests, incorrect published details, impersonation or content that should be reviewed.</p></div>
    </div>
   </section>
   <aside className="fixa-support-note"><ShieldAlert size={20}/><div><strong>Protect customer information.</strong><p>Never share passwords, one-time sign-in links, full device identifiers or customer details in an initial support message. If a repair is in progress, contact the technician or repair business handling that job directly.</p></div></aside>
   <p className="fixa-support-legal">Looking for the rules behind Fixa? Read our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.</p>
  </div>
 </PublicInfoLayout>;
}
