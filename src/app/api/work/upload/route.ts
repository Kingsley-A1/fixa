import {NextRequest,NextResponse} from "next/server";
import {requireWorkspace} from "@/lib/auth";
import {db} from "@/lib/db";
import {uploadPrivateImage} from "@/lib/private-media";
import {revalidatePath} from "next/cache";
export const runtime="nodejs";
export async function POST(request:NextRequest){
 if(process.env.ENABLE_PORTFOLIO!=="true")return NextResponse.json({error:"Portfolio uploads are not available yet."},{status:503});
 const {business,user}=await requireWorkspace();
 const form=await request.formData(),id=String(form.get("sampleId")||"");
 const file=form.get("image");
 if(!/^[0-9a-f-]{36}$/i.test(id)||!(file instanceof File))return NextResponse.json({error:"Choose a valid image."},{status:400});
 if(file.size===0||file.size>2_000_000||!["image/webp","image/jpeg","image/png"].includes(file.type))return NextResponse.json({error:"Upload a JPEG, PNG or WebP under 2 MB."},{status:400});
 const bytes=Buffer.from(await file.arrayBuffer());
 const valid=file.type==="image/webp"&&bytes.toString("ascii",0,4)==="RIFF"&&bytes.toString("ascii",8,12)==="WEBP" ||
   file.type==="image/jpeg"&&bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff ||
   file.type==="image/png"&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 if(!valid)return NextResponse.json({error:"File content isn't a supported image."},{status:400});
 const sample=await db.workSample.findFirst({where:{id,businessId:business.id,profile:{ownerUserId:user.id},status:{in:["DRAFT","REJECTED"]}},include:{images:true}});
 if(!sample)return NextResponse.json({error:"Draft not found."},{status:404});
 if(sample.images.length>=3)return NextResponse.json({error:"Each work sample allows three photos."},{status:400});
 const uploadedToday=await db.workImage.count({where:{sample:{profile:{ownerUserId:user.id}},createdAt:{gte:new Date(Date.now()-86400_000)}}});
 if(uploadedToday>=24)return NextResponse.json({error:"Daily upload limit reached."},{status:429});
 try{
  const position=sample.images.length,blobUrl=await uploadPrivateImage(bytes,file.type as "image/webp"|"image/jpeg"|"image/png");
  await db.workImage.create({data:{sampleId:sample.id,position,contentType:file.type,blobUrl}});
  await db.workSample.update({where:{id:sample.id},data:{status:"DRAFT",publishedAt:null}});
  revalidatePath("/app/profile");
  return NextResponse.json({success:true});
 }catch{return NextResponse.json({error:"Upload failed. Please retry with a smaller photo."},{status:500});}
}
