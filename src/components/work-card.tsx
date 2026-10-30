import Image from "next/image";
import Link from "next/link";
export function WorkCard({id,title,description,href}:{id:string;title:string;description?:string|null;href?:string}){
 const content=<><div className="work-card-cover"><Image unoptimized src={"/api/work/media/"+id} width={640} height={760} alt={title} loading="lazy"/></div><div className="work-card-caption"><h3>{title}</h3>{description&&<p>{description}</p>}</div></>;
 return href?<Link href={href} className="work-card">{content}</Link>:<article className="work-card">{content}</article>;
}
