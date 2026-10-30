import {ImageResponse} from "next/og";

/** Minimal square treatment of the existing fixa. wordmark, never a new symbol. */
export function pwaIcon(size:number,maskable=false){
 return new ImageResponse(
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",backgroundColor:"#fcfdf9"}}>
   <div style={{
     display:"flex",alignItems:"baseline",justifyContent:"center",
     fontFamily:"Arial, Helvetica, sans-serif",fontWeight:800,
     fontSize:Math.round(size*(maskable ? 0.245 : 0.275)),
     letterSpacing:-Math.round(size*.012),
     color:"#203e32",lineHeight:1
   }}>
    fixa<span style={{color:"#7d9a60"}}>.</span>
   </div>
  </div>,
  {width:size,height:size}
 );
}
