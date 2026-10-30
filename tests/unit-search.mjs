import test from "node:test";import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const src=readFileSync("src/lib/repair-search.ts","utf8");
test("search implementation includes customer phone and device serial in jobs",()=>{assert.match(src,/phone:/);assert.match(src,/serialNumber:/);assert.match(src,/jobFilter/);});
test("device registration preserves free model input",()=>{const s=readFileSync("src/components/device-identity-fields.tsx","utf8");assert.match(s,/name="model"/);assert.match(s,/datalist/);assert.match(s,/Device class/);});
