import type {Metadata} from "next";
import Link from "next/link";
import {PublicInfoLayout} from "@/components/public-info-layout";

export const metadata:Metadata={title:"Privacy Policy",description:"How Fixa handles account details, repair records, location preferences, technician listings, reviews and portfolio photographs.",alternates:{canonical:"/privacy"}};

export default function PrivacyPage(){
 return <PublicInfoLayout eyebrow="PRIVACY · HANDLED WITH CARE" title="Privacy Policy" intro="Your information matters. Here's what Fixa uses, why it is needed, and how you can ask questions or exercise your rights.">
 <article className="fixa-policy">
  <p className="fixa-policy-opening">Fixa is operated by <strong>Bespoke Technologies</strong>. This policy explains our handling of personal information when you use Fixa&apos;s website, private repair workspace, technician listings, reviews and related account features. We aim to process information fairly, securely and only for legitimate purposes in line with applicable Nigerian data protection law.</p>
  <section><h2>1. Information we handle</h2>
   <p><strong>Account information:</strong> names, email addresses, password credentials in protected hashed form where used, Google sign-in identifiers, account verification and business membership records.</p>
   <p><strong>Repair records:</strong> customer contact details, device class and identifiers, reported faults, repair stages, notes, ticket references and handover information entered by repair businesses. Some records may be personal or confidential.</p>
   <p><strong>Technician discovery:</strong> published professional names, permitted business contact details, service areas, claimed specialties, approved work photographs and reviews. Review invitation records may be associated with a completed service job.</p>
   <p><strong>Technical information:</strong> essential authentication cookies and operational records needed to secure, troubleshoot and maintain the service.</p>
  </section>
  <section><h2>2. Why we use it</h2>
   <p>We use information to create and secure accounts, provide private repair management, support technician discovery, conduct contact and profile checks, deliver account emails, moderate content, investigate complaints, prevent misuse and comply with legal obligations.</p>
   <p>Depending on the activity, processing may be based on providing the service, legitimate interests balanced against individual rights, legal obligations, or consent where required. We do not use a customer&apos;s repair history as a public profile or publish customer identifying details simply because a business recorded a job.</p>
  </section>
  <section><h2>3. Repair businesses and customer information</h2>
   <p>Independent repair businesses enter and manage their own customer and job records. They must have an appropriate reason to collect the information, tell customers how it is used and restrict access to authorised people.</p>
   <p>Fixa provides the software and technical safeguards for these records. We also handle platform-level account, security, listing and review information for our own operational responsibilities. A customer&apos;s request about the accuracy of a repair record may need to be addressed with the business that entered it.</p>
  </section>
  <section><h2>4. Public listings, work and reviews</h2>
   <p>Only profile details approved for publication should appear in technician search results. Public visitors may see a technician&apos;s chosen professional identity, service area, published contact details, specialties, approved work samples and published reviews.</p>
   <p>Repair photographs require appropriate customer permission and review before publication. Review text may be moderated to protect privacy and address abuse; legitimate negative experiences should not be suppressed solely for being critical. Never submit private customer records in public content.</p>
  </section>
  <section><h2>5. Google sign-in and email</h2>
   <p>If you use Google sign-in, Google provides an account identifier, name, email address and verified-email status needed to authenticate you. Fixa does not request access to your Gmail inbox, Google Drive or contacts for this purpose. You can use email/password login where that option is supported.</p>
   <p>We use transactional email for account confirmation, security and profile-review notices. These messages may be delivered through a specialist email provider acting on our instructions.</p>
  </section>
  <section><h2>6. Location</h2>
   <p>You may enter a city or area manually when looking for technicians. If you choose <strong>Use my location</strong>, your browser will ask for permission. You can deny access and continue searching manually. The location feature uses your coordinates to suggest a nearby city; precise visitor coordinates are not intended to be stored as a personal location history by that feature.</p>
   <p>Technicians separately choose the public service area they want customers to see. Do not publish a private home address unless you have deliberately chosen to disclose it as a business location.</p>
  </section>
  <section><h2>7. Cookies and security</h2>
   <p>Fixa uses necessary browser cookies for sign-in sessions and temporary authentication flows. These help keep accounts signed in and protect requests. We use access controls, private storage for work photographs before approval and other reasonable technical safeguards, but no internet service can guarantee absolute security.</p>
  </section>
  <section><h2>8. Service providers and sharing</h2>
   <p>We use technology partners to host the application, store service data and approved/private media, process Google authentication and send transactional emails. These partners may process limited information needed to deliver those services under their own applicable terms and safeguards.</p>
   <p>Information may be shared with the repair business managing a customer&apos;s job, a person whom the customer deliberately contacts, or competent authorities where lawfully required. We do not sell personal data to advertisers. Some service providers may process information outside Nigeria; applicable safeguards and legal requirements must be respected.</p>
  </section>
  <section><h2>9. How long we keep information</h2>
   <p>We keep information while reasonably necessary to provide the requested service, maintain accurate repair records, secure accounts, resolve complaints and meet applicable obligations. The appropriate period depends on the type of information, why it was collected and whether an account, job or legal issue remains active.</p>
   <p>Requests to remove an account, public profile, photograph or other information may be subject to legal, security, recordkeeping or dispute-resolution requirements. We will explain relevant restrictions when handling a request.</p>
  </section>
  <section><h2>10. Your privacy rights</h2>
   <p>Under applicable law, including the Nigeria Data Protection Act 2023, you may have rights to receive information about our processing, access your information, request correction or deletion, object to or restrict certain uses, request portability where applicable, and withdraw consent for consent-based uses. Legal limits and exceptions may apply.</p>
   <p>To make a request or report a privacy concern, contact us through <Link href="/support">Fixa Support</Link>. Please provide only the details needed to identify the issue; we may need to confirm your identity before changing or disclosing protected records. You may also complain to the <a href="https://ndpc.gov.ng/" target="_blank" rel="noopener noreferrer">Nigeria Data Protection Commission</a>.</p>
  </section>
  <section><h2>11. Policy changes and contact</h2>
   <p>We may update this policy as Fixa develops or our legal obligations change. The updated date is shown above, and material changes will be communicated where appropriate. Questions about our practices can be directed to <Link href="/support">Support</Link>.</p>
  </section>
 </article>
 </PublicInfoLayout>;
}
