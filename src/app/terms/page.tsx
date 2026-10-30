import type {Metadata} from "next";
import Link from "next/link";
import {PublicInfoLayout} from "@/components/public-info-layout";

export const metadata:Metadata={title:"Terms of Service",description:"Understand the terms for using Fixa's repair-management workspace, technician directory and service reviews.",alternates:{canonical:"/terms"}};

export default function TermsPage(){
 return <PublicInfoLayout eyebrow="LEGAL · THE GROUND RULES" title="Terms of Service" intro="Clear expectations for technicians, repair businesses and people using Fixa to find repair services.">
 <article className="fixa-policy">
  <p className="fixa-policy-opening">Fixa is a product operated by <strong>Bespoke Technologies</strong> (“Fixa”, “we”, “us”). These terms explain how you may use our platform. By creating an account or using the services, you agree to these terms, subject to any rights you have under applicable law. Please read our <Link href="/privacy">Privacy Policy</Link> as well.</p>
  <section id="services"><h2>1. What Fixa provides</h2>
   <p>Fixa offers repair-business management tools and, where available, a directory for discovering repair professionals. Repair businesses can record customers, devices, service jobs and status updates. Technicians may create professional profiles and submit work examples. Visitors may browse published profiles and feedback without registering.</p>
   <p><strong>Fixa is not the repair service provider.</strong> Unless expressly stated otherwise, listed technicians and repair businesses are independent from Bespoke Technologies. They decide which jobs to accept, what to charge and how to carry out repairs.</p>
  </section>
  <section id="accounts"><h2>2. Accounts and access</h2>
   <p>Provide accurate account and business details, protect your sign-in credentials and keep access limited to authorised people. You are responsible for activity performed using your account, except where applicable law provides otherwise. Report suspected misuse through <Link href="/support">Support</Link>.</p>
   <p>Where you manage a business workspace, ensure that only permitted staff can access customer and repair records. Do not access another business&apos;s information without authorisation.</p>
  </section>
  <section id="repair"><h2>3. Repairs and customer arrangements</h2>
   <p>Technicians and customers should agree directly on diagnosis, scope, estimated costs, replacement parts, timing, handover conditions and any warranty or return arrangement. A Fixa service record or QR-linked ticket does not, by itself, establish payment, a warranty or a guarantee of successful repair.</p>
   <p>We do not independently inspect every repair, and verification of contact details or business location is not certification of technical competence. Customers should make their own informed decisions. We do not waive obligations that applicable consumer protection laws impose on service providers or on Fixa itself.</p>
  </section>
  <section id="listings"><h2>4. Technician listings and verification</h2>
   <p>Profiles may be subject to contact, location and business-representation checks before publication. Different checks have different meanings. You must not describe yourself as officially certified, endorsed or skills-verified by Fixa unless that specific assessment has actually been completed and Fixa has authorised the claim.</p>
   <p>Fixa may reject, temporarily hide or suspend listings where necessary for safety, accuracy, legal compliance or platform integrity, with appropriate review processes.</p>
  </section>
  <section id="reviews"><h2>5. Reviews and portfolio work</h2>
   <p>Reviews must reflect genuine customer experiences. Do not submit fabricated, coerced, purchased or misleading feedback. A service-linked review confirms an association with a recorded job; it does not guarantee the repair outcome.</p>
   <p>Technicians may share photographs or descriptions of completed work only when they have the necessary rights and customer permission. Do not disclose IMEIs, serial numbers, addresses, private screens, customer identities or other confidential information. Uploaded work may be reviewed before it appears publicly, and may be removed if permission is withdrawn or a legitimate concern is raised.</p>
   <p>By submitting material, you confirm you have authority to do so and give Fixa permission to host and display it only as needed to provide the relevant feature. You retain ownership of your original content, subject to third-party rights.</p>
  </section>
  <section id="prohibited"><h2>6. Unacceptable use</h2>
   <p>Do not impersonate others, publish someone else&apos;s private information, misrepresent your skills, attempt to bypass verification, interfere with platform security, upload malicious content, scrape private records or use Fixa for fraudulent or unlawful activity.</p>
   <p>We may restrict access or remove content where reasonably necessary to protect users and the service. You may contact <Link href="/support">Support</Link> to question a moderation decision.</p>
  </section>
  <section id="availability"><h2>7. Availability, fees and changes</h2>
   <p>Features can change as Fixa develops, and some may be limited to particular locations or users. We aim for a dependable service but cannot promise uninterrupted availability. Any new paid feature will be clearly identified before you choose to use it; existing free usage does not authorise surprise charges.</p>
  </section>
  <section id="responsibility"><h2>8. Responsibilities and limitations</h2>
   <p>Technicians remain responsible for their workmanship, communications and their own commitments to customers. Fixa is responsible for how it operates its platform and handles information within its control. We do not promise that every profile, review or work sample is complete, accurate or independently verified.</p>
   <p>Nothing here excludes liability or legal rights that cannot lawfully be excluded under Nigerian law. Where a platform issue arises, contact us with enough information to investigate without sending unnecessary private customer records.</p>
  </section>
  <section id="governing"><h2>9. Applicable law</h2>
   <p>These terms are intended to be interpreted in accordance with the laws of the Federal Republic of Nigeria, while preserving mandatory consumer, privacy and other legal protections that apply to a user.</p>
  </section>
  <section id="updates"><h2>10. Changes and contact</h2>
   <p>We may update these terms as the service evolves. Material changes will be communicated through appropriate channels where required. Continued use after an effective change may be subject to applicable notification and consent requirements.</p>
   <p>Questions or complaints? Visit <Link href="/support">Fixa Support</Link>. For information about personal data and your rights, read our <Link href="/privacy">Privacy Policy</Link>.</p>
  </section>
 </article>
 </PublicInfoLayout>;
}
