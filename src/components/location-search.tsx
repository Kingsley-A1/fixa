"use client";
import {useState} from "react";import {MapPin,LocateFixed,LoaderCircle} from "lucide-react";
// Coarse city approximation only, not an address lookup or authoritative distance ranking.
const cities=[
 {name:"Calabar",lat:4.9589,lon:8.3269},{name:"Lagos",lat:6.5244,lon:3.3792},
 {name:"Abuja",lat:9.0765,lon:7.3986},{name:"Port Harcourt",lat:4.8156,lon:7.0498},
 {name:"Ibadan",lat:7.3775,lon:3.947},{name:"Enugu",lat:6.4584,lon:7.5464},
 {name:"Benin City",lat:6.335,lon:5.6037},{name:"Aba",lat:5.1167,lon:7.3667},
 {name:"Kano",lat:12.0022,lon:8.592},{name:"Uyo",lat:5.0377,lon:7.9128}
];
export function LocationSearch({initialCity="",initialQuery=""}:{initialCity?:string;initialQuery?:string}){
 const [city,setCity]=useState(initialCity),[query,setQuery]=useState(initialQuery),[message,setMessage]=useState(""),[locating,setLocating]=useState(false);
 function locate(){
  if(!navigator.geolocation){setMessage("Location is unavailable. Enter a city instead.");return;}
  setLocating(true);setMessage("");
  navigator.geolocation.getCurrentPosition(pos=>{
   const rad=Math.PI/180,{latitude:a,longitude:b}=pos.coords;
   const ranked=cities.map(c=>({city:c.name,dist:Math.acos(Math.min(1,Math.max(-1,Math.sin(a*rad)*Math.sin(c.lat*rad)+Math.cos(a*rad)*Math.cos(c.lat*rad)*Math.cos((b-c.lon)*rad))))})).sort((a,b)=>a.dist-b.dist);
   setCity(ranked[0].city);setMessage("Suggested nearest listed city: "+ranked[0].city+". You can change it.");
   setLocating(false);
  },()=>{setLocating(false);setMessage("Location access was not granted. Search by city instead.");},{enableHighAccuracy:false,timeout:7000,maximumAge:300000});
 }
 return <form action="/find" method="get" className="find-form">
  <label className="field"><span>Repair skill or device</span><input name="q" value={query} onChange={e=>setQuery(e.target.value)} placeholder="iPhone, battery, laptop repair…"/></label>
  <label className="field"><span>City or area</span><span className="find-city-field"><MapPin size={18}/><input name="city" value={city} onChange={e=>setCity(e.target.value)} placeholder="e.g. Calabar"/></span></label>
  <button className="btn primary" type="submit">Find technicians</button>
  <button className="btn" type="button" onClick={locate} disabled={locating}>{locating?<LoaderCircle size={16} className="spin"/>:<LocateFixed size={16}/>} Use my location</button>
  {message&&<p aria-live="polite" className="muted" style={{gridColumn:"1 / -1"}}>{message}</p>}
 </form>;
}
