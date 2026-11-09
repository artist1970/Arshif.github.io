import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Script} from "node:vm";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const js=readFileSync(new URL("../arshif-public-chat.js",import.meta.url),"utf8");
test("public chat is present, local, ephemeral and syntax-valid",()=>{
 assert.match(html,/<textarea[^>]*id=/i);
 assert.match(html,/<form[^>]*id=/i);
 assert.match(html,/aria-live="polite"/i);
 assert.ok(html.includes("arshif-public-chat.js"));
 assert.doesNotThrow(()=>new Script(js));
 assert.match(js,/textContent=/);
 assert.doesNotMatch(js,/(?:fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|WebSocket|eval\s*\()/);
});
