import test from "node:test";
import assert from "node:assert/strict";
import {phoneSearchTerms,customerFilter,deviceFilter,jobFilter} from "../src/lib/repair-search.ts";
import {mayTransition,NEXT_JOB_STATUSES} from "../src/lib/job-workflow.ts";
test("local Nigerian number finds international representation",()=>{
 const terms=phoneSearchTerms("08088071657");
 assert.ok(terms.includes("+2348088071657"));
 assert.ok(terms.includes("2348088071657"));
});
test("international Nigerian number finds local representation",()=>{
 const terms=phoneSearchTerms("+2348088071657");
 assert.ok(terms.includes("08088071657"));
});
test("customer search includes names and phone variants",()=>{
 const out=JSON.stringify(customerFilter("08088071657"));
 assert.ok(out.includes("name"));assert.ok(out.includes("+2348088071657"));
});
test("device search includes owner contact and permanent device ID",()=>{
 const out=JSON.stringify(deviceFilter("08088071657"));
 assert.ok(out.includes("customer"));assert.ok(out.includes("code"));
});
test("repair job search includes customer phone and device identifiers",()=>{
 const out=JSON.stringify(jobFilter("08088071657"));
 for(const field of ["phone","serialNumber","imei","customer","device","code"])assert.ok(out.includes(field),field);
});
test("no search input produces no filter",()=>assert.deepEqual(jobFilter(""),{}));

test("collection requires a ready repair",()=>{assert.equal(mayTransition("READY","COLLECTED"),true);assert.equal(mayTransition("RECEIVED","COLLECTED"),false);assert.equal(mayTransition("CANCELLED","COLLECTED"),false);});
test("terminal repair statuses never advance",()=>{assert.deepEqual(NEXT_JOB_STATUSES.COLLECTED,[]);assert.deepEqual(NEXT_JOB_STATUSES.CANCELLED,[]);});

import {cleanWebpBytes} from "../src/lib/image-policy.ts";
function fakeWebp(chunks){
 const size=12+chunks.reduce((n,[,bytes])=>n+8+bytes.length+(bytes.length%2),0);
 const out=Buffer.alloc(size);out.write("RIFF",0);out.writeUInt32LE(size-8,4);out.write("WEBP",8);
 let p=12;for(const [id,bytes] of chunks){out.write(id,p);out.writeUInt32LE(bytes.length,p+4);Buffer.from(bytes).copy(out,p+8);p+=8+bytes.length+(bytes.length%2);}return out;
}
test("metadata-free WebP repair photo passes format guard",()=>{
 assert.equal(cleanWebpBytes(fakeWebp([["VP8 ",[0,0,0,0]]])),true);
});
test("private image guard rejects EXIF metadata and animated frames",()=>{
 assert.equal(cleanWebpBytes(fakeWebp([["VP8 ",[0,0,0,0]],["EXIF",[1,2]]])),false);
 assert.equal(cleanWebpBytes(fakeWebp([["ANIM",[0,0]],["VP8 ",[0,0,0,0]]])),false);
});
test("private image guard rejects malformed container size",()=>{
 const img=fakeWebp([["VP8 ",[0,0,0,0]]]);img.writeUInt32LE(99,4);assert.equal(cleanWebpBytes(img),false);
});
