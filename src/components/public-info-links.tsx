import Link from "next/link";
export function PublicInfoLinks({className=""}:{className?:string}){
 return <nav className={["fixa-policy-links",className].filter(Boolean).join(" ")} aria-label="Legal and support">
  <Link href="/terms">Terms</Link>
  <Link href="/privacy">Privacy</Link>
  <Link href="/support">Support</Link>
 </nav>;
}
