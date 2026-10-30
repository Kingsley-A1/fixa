"use client";
import {useState} from "react";
import {CLASS_BRANDS,DEVICE_CLASSES,PRODUCT_SUGGESTIONS} from "@/lib/device-catalog";
export function DeviceIdentityFields(){
 const [category,setCategory]=useState<string>("Phone");
 const [brand,setBrand]=useState<string>("");
 const brands=CLASS_BRANDS[category]||CLASS_BRANDS.Other;
 return <div className="device-identity">
   <label className="field"><span>Device class *</span><select required name="category" value={category} onChange={e=>{setCategory(e.target.value);setBrand("");}}>{DEVICE_CLASSES.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
   <div className="form-grid">
     <label className="field"><span>Manufacturer / brand *</span><input name="brand" list="fixa-brand-list" value={brand} onChange={e=>setBrand(e.target.value)} placeholder="Choose or enter brand" maxLength={80} required/><datalist id="fixa-brand-list">{brands.map(x=><option key={x} value={x}/>)}</datalist></label>
     <label className="field"><span>Product name *</span><input name="model" list="fixa-product-list" maxLength={120} placeholder={category==="Phone"?"e.g. Galaxy A55":"Exact product name"} required/><datalist id="fixa-product-list">{(PRODUCT_SUGGESTIONS[brand]||[]).map(x=><option key={x} value={x}/>)}</datalist></label>
   </div>
   <label className="field"><span>Manufacturer model code (optional)</span><input name="modelNumber" maxLength={100} placeholder="e.g. SM-A556E, A2338, 7440"/></label>
   <p className="form-hint">Suggestions speed up entry; always record the exact device shown by the manufacturer.</p>
 </div>;
}
