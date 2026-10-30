import type {Metadata} from "next";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import {PublicInfoLayout} from "@/components/public-info-layout";

export const metadata:Metadata={
 title:"Frequently Asked Questions",
 description:"Answers about Fixa's repair workspace, device registration, technician profiles, reviews, Google sign-in and customer privacy.",
 alternates:{canonical:"/faq"}
};
const questions=[
 {q:"What is Fixa?",a:"Fixa helps repair businesses organise customers, devices and repair jobs in one workspace. It is also developing public technician discovery, professional profiles and service-linked reviews where those features are available."},
 {q:"Who is Fixa for?",a:"The repair workspace is built for independent technicians and repair businesses managing phones, laptops and other electronic devices. Public discovery is intended for people looking for suitable repair professionals."},
 {q:"Can I try Fixa before registering?",a:"Yes. The interactive workspace demo uses sample data. It lets you explore the experience without creating an account or submitting real customer information."},
 {q:"What information do I need to register a device?",a:"Start with the device class, then the brand, product name and exact model identifier where available. You can enter the correct model manually if it is not suggested. Add the customer and repair information to manage the job."},
 {q:"Can a customer track a repair?",a:"A repair business can share a customer-facing service ticket link or QR code for the relevant job. That ticket communicates available service status; it is not automatically proof of payment, a warranty or a repair guarantee."},
 {q:"Can I sign in with Google?",a:"Google sign-in is supported when the business has enabled the integration. Existing password users should sign in first and connect Google securely from their account. Google sign-in does not verify repair skills."},
 {q:"Does Fixa publish my customer records?",a:"No. Business repair records are kept separate from public technician profiles. Customers' contact details, device identifiers and private job notes should not appear in public search results or uploaded work."},
 {q:"How will customers find technicians?",a:"When the public directory is available, customers can search by city, area and repair specialty. Location sharing is optional; searching by a manually entered city remains available."},
 {q:"Does a Fixa listing mean the technician is certified?",a:"No. Contact, identity or service-area checks establish different things. They do not automatically prove technical competence. Customers should review available information and agree repair terms directly with the technician."},
 {q:"Can technicians share photographs of finished work?",a:"A technician may add approved work samples linked to their own repair jobs where the portfolio feature is available. Customer permission is required, and identifying or private information must not be published."},
 {q:"How do customer reviews work?",a:"Where enabled, service-linked invitations let customers provide genuine feedback about completed jobs. Reviews may be moderated for privacy and abuse, including critical reviews, and should not be treated as a guarantee of repair outcomes."},
 {q:"How do I report a problem or request help?",a:"Visit Fixa Support for assistance with accounts, listings, reviews, privacy concerns or a workspace problem. For an ongoing repair, contact the repair business responsible for that job."}
];
export default function FaqPage(){
 return <PublicInfoLayout kind="support" eyebrow="HELP · COMMON QUESTIONS" title="Frequently asked questions." intro="The essentials about using Fixa, protecting customer information and understanding how technician discovery works.">
  <div className="fixa-faq">
   <div className="fixa-faq-list">{questions.map(({q,a},index)=><details className="fixa-faq-item" key={q}>
    <summary><span className="fixa-faq-question">{q}</span><span className="fixa-faq-plus" aria-hidden="true">+</span></summary>
    <div className="fixa-faq-answer"><p>{a}</p>{index===11&&<p><Link href="/support">Contact support <ArrowUpRight size={15} aria-hidden="true"/></Link></p>}</div>
   </details>)}</div>
   <section className="fixa-faq-contact"><h2>Still need a hand?</h2><p>Our support team can help with account access, the repair workspace and concerns about published information.</p><Link href="/support" className="fixa-about-text-link">Get support <ArrowUpRight size={17} aria-hidden="true"/></Link></section>
  </div>
 </PublicInfoLayout>;
}
