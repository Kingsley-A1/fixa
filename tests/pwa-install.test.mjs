import test from "node:test";
import assert from "node:assert/strict";
import {recordDashboardVisit,eligibleForInstall,INSTALL_MIN_VISIT_GAP_MS,INSTALL_SNOOZE_MS} from "../src/lib/pwa-install-policy.ts";

const NOW=1_800_000_000_000;
function options(history,changes={}){
 return {history,now:NOW,mobile:true,hasRepairJobs:true,installed:false,supported:true,ready:true,...changes};
}
test("first visit never shows install",()=>{
 const h=recordDashboardVisit(undefined,NOW);
 assert.equal(h.visits,1);
 assert.equal(eligibleForInstall(options(h)),false);
});
test("refreshing during same visit cannot manufacture repeat eligibility",()=>{
 const h=recordDashboardVisit(undefined,NOW-1000);
 assert.equal(recordDashboardVisit(h,NOW).visits,1);
});
test("second meaningful visit enables a quiet suggestion",()=>{
 const first=recordDashboardVisit(undefined,NOW-2*INSTALL_MIN_VISIT_GAP_MS);
 const second=recordDashboardVisit(first,NOW);
 assert.equal(second.visits,2);
 assert.equal(eligibleForInstall(options(second)),true);
});
test("never show on desktop, to non-users, before browser capability or inside standalone app",()=>{
 const h=recordDashboardVisit(recordDashboardVisit(undefined,NOW-2*INSTALL_MIN_VISIT_GAP_MS),NOW);
 for(const flags of [{mobile:false},{hasRepairJobs:false},{installed:true},{supported:false},{ready:false}]){
   assert.equal(eligibleForInstall(options(h,flags)),false);
 }
});
test("dismissal prevents repeated prompts for 90 days",()=>{
 const h=recordDashboardVisit(recordDashboardVisit(undefined,NOW-2*INSTALL_MIN_VISIT_GAP_MS),NOW);
 assert.equal(eligibleForInstall(options({...h,quietUntil:NOW+INSTALL_SNOOZE_MS})),false);
});
