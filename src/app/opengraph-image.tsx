import {ImageResponse} from "next/og";

export const alt="Fixa — Find repair help with more confidence.";
export const size={width:1200,height:630};
export const contentType="image/png";
export const runtime="edge";

const ink="#203e32";
const sage="#718c62";
const muted="#738375";

const benefits=[
 {number:"01",title:"Find local specialties",detail:"Know what technicians work on."},
 {number:"02",title:"Explore their profiles",detail:"See services and available feedback."},
 {number:"03",title:"Make your choice",detail:"Contact a technician directly."}
];

export default function Image(){
 return new ImageResponse(
 <div style={{display:"flex",width:"100%",height:"100%",overflow:"hidden",backgroundColor:"#fcfdf9",fontFamily:"Arial, sans-serif",color:ink,position:"relative"}}>
  <div style={{position:"absolute",right:-220,top:-235,width:730,height:730,backgroundColor:"#f1f5ed",borderRadius:730}}/>
  <div style={{display:"flex",width:"58%",height:"100%",flexDirection:"column",padding:"49px 22px 36px 62px",position:"relative"}}>
   <div style={{display:"flex",alignItems:"baseline",fontSize:55,fontWeight:800,letterSpacing:-4,lineHeight:1}}>
    fixa<span style={{color:sage}}>.</span>
   </div>
   <div style={{display:"flex",flexDirection:"column",marginTop:77}}>
    <span style={{fontSize:15,letterSpacing:2,fontWeight:750,color:sage}}>REPAIR DISCOVERY. WITH MORE CLARITY.</span>
    <span style={{fontSize:60,lineHeight:1.1,letterSpacing:-3,fontWeight:750,marginTop:22}}>Find repair help,</span>
    <span style={{fontSize:56,lineHeight:1.13,letterSpacing:-2,color:sage,fontStyle:"italic",fontFamily:"Georgia,serif",marginTop:5}}>with more confidence.</span>
   </div>
   <div style={{display:"flex",marginTop:25,fontSize:22,lineHeight:1.5,color:muted,maxWidth:590}}>
    Explore nearby technicians, specialties and available customer feedback.
   </div>
   <div style={{display:"flex",alignItems:"center",gap:13,marginTop:"auto",fontSize:18,color:ink}}>
    <span style={{display:"flex",width:37,height:3,backgroundColor:sage,borderRadius:3}}/>
    fixa.bespoketech.com.ng
   </div>
  </div>
  <div style={{display:"flex",alignItems:"center",width:"42%",padding:"83px 44px 65px 18px",position:"relative"}}>
   <div style={{display:"flex",width:"100%",flexDirection:"column",padding:"27px 25px",backgroundColor:"#fff",border:"1px solid #e4ebe2",borderRadius:22,boxShadow:"0 20px 45px rgba(35,75,60,.055)"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
     <span style={{fontSize:17,fontWeight:750}}>Choose with clarity.</span>
     <span style={{fontSize:10,color:"#8e9f8d"}}>FIXA</span>
    </div>
    {benefits.map(item=><div key={item.number} style={{display:"flex",alignItems:"flex-start",gap:15,borderTop:"1px solid #e9eee8",padding:"22px 0"}}>
      <span style={{fontSize:12,color:sage,marginTop:3}}>{item.number}</span>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
       <span style={{fontSize:19,fontWeight:750,color:ink}}>{item.title}</span>
       <span style={{fontSize:13,color:muted,lineHeight:1.5}}>{item.detail}</span>
      </div>
    </div>)}
   </div>
  </div>
 </div>,
 {width:size.width,height:size.height}
 );
}
