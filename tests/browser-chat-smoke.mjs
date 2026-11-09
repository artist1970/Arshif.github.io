import {chromium} from "playwright";
import assert from "node:assert/strict";
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1365,height:850}});
const page=await context.newPage();
const origin=process.env.MENTOR_TEST_ORIGIN||"http://127.0.0.1:8775";
await page.route("**/*",route=>{const u=new URL(route.request().url());return u.origin===new URL(origin).origin?route.continue():route.abort("blockedbyclient")});
try{
 const res=await page.goto(origin+"/",{waitUntil:"domcontentloaded",timeout:20000});
 assert.equal(res.status(),200);

 await page.locator("#arshif-question").fill("What is a primary source?");
 await page.getByRole("button",{name:/Ask ARSHIF/i}).click();
 const answer=await page.locator("#arshif-answer").innerText();
 assert.ok(answer.length>30);
 assert.match(answer,/primary/i);
 const storage=await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}));
 assert.equal(storage.local,0);assert.equal(storage.session,0);
 await page.getByRole("button",{name:"Clear",exact:true}).click();
 const input=await page.locator("#arshif-question").inputValue();
 assert.equal(input,"");
 console.log("PASS arshif: local public answer, clear, no browser-storage writes");
}finally{await context.close();await browser.close();}
