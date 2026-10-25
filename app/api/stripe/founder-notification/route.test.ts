import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { eligiblePurchase, stripeSignatureValid } from "./validation";

const purchase = {
 id:"evt_test",
 type:"checkout.session.completed",
 data:{object:{id:"cs_live_test",payment_link:"plink_approved",payment_status:"paid",mode:"payment",livemode:true,currency:"gbp",amount_total:900}},
};
describe("founder purchase webhook",()=>{
 it("rejects missing or tampered signatures",()=>{
   const body=JSON.stringify(purchase), t=Math.floor(Date.now()/1000), key="whsec_localtest";
   const hex=createHmac("sha256",key).update(`${t}.${body}`).digest("hex");
   expect(stripeSignatureValid(body,`t=${t},v1=${hex}`,key,t)).toBe(true);
   expect(stripeSignatureValid(body+"x",`t=${t},v1=${hex}`,key,t)).toBe(false);
   expect(stripeSignatureValid(body,`t=${t-1000},v1=${hex}`,key,t)).toBe(false);
 });
 it("requires verified exact payment link and £9 paid checkout",()=>{
   expect(eligiblePurchase(purchase,"plink_approved")).toBe(true);
   expect(eligiblePurchase(purchase,"plink_another")).toBe(false);
   expect(eligiblePurchase({...purchase,data:{object:{...purchase.data.object,amount_total:800}}},"plink_approved")).toBe(false);
   expect(eligiblePurchase({...purchase,data:{object:{...purchase.data.object,payment_status:"unpaid"}}},"plink_approved")).toBe(false);
   expect(eligiblePurchase({...purchase,data:{object:{...purchase.data.object,livemode:false}}},"plink_approved")).toBe(false);
 });
});
