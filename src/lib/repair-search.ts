import type { Prisma } from "@prisma/client";

/** Phone search tolerates local Nigerian and E.164 forms without mutating existing rows. */
export function phoneSearchTerms(query:string):string[]{
 const q=query.trim().slice(0,100);
 const digits=q.replace(/\D/g,"");
 const parts=new Set<string>([q]);
 if(!digits || !/^[+\d\s()-]+$/.test(q)) return [...parts].filter(Boolean);
 parts.add(digits);
 if(digits.startsWith("234")&&digits.length>=10){parts.add("0"+digits.slice(3));parts.add(digits.slice(3));}
 else if(digits.startsWith("0")&&digits.length>=4){parts.add("+234"+digits.slice(1));parts.add("234"+digits.slice(1));parts.add(digits.slice(1));}
 else if(digits.length>=8){parts.add("+234"+digits);parts.add("0"+digits);}
 return [...parts].filter(Boolean).slice(0,7);
}
export function customerFilter(q:string):Prisma.CustomerWhereInput {
 if(!q.trim()) return {};
 const terms=phoneSearchTerms(q);
 return {OR:[{name:{contains:q,mode:"insensitive"}},...terms.map(v=>({phone:{contains:v}}))]};
}
export function deviceFilter(q:string):Prisma.DeviceWhereInput {
 if(!q.trim())return {};
 const terms=phoneSearchTerms(q);
 return {OR:[
  {code:{contains:q,mode:"insensitive"}},{brand:{contains:q,mode:"insensitive"}},{model:{contains:q,mode:"insensitive"}},
  {serialNumber:{contains:q,mode:"insensitive"}},{imei:{contains:q}},
  {customer:{OR:[{name:{contains:q,mode:"insensitive"}},...terms.map(v=>({phone:{contains:v}}))]}}
 ]};
}
export function jobFilter(q:string):Prisma.RepairJobWhereInput {
 if(!q.trim())return {};
 const terms=phoneSearchTerms(q);
 return {OR:[
  {code:{contains:q,mode:"insensitive"}},{issue:{contains:q,mode:"insensitive"}},
  {customer:{OR:[{name:{contains:q,mode:"insensitive"}},...terms.map(v=>({phone:{contains:v}}))]}},
  {device:{OR:[{code:{contains:q,mode:"insensitive"}},{brand:{contains:q,mode:"insensitive"}},{model:{contains:q,mode:"insensitive"}},{serialNumber:{contains:q,mode:"insensitive"}},{imei:{contains:q}}]}}
 ]};
}
