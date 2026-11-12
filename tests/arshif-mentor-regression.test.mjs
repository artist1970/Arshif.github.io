import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const html=read("index.html"),script=read("arshif-conversation-v1.js"),federation=read("creative-spark-mentor-qa-v1.js"),css=read("styles/arshif-mentor-v1.css");
const qa=JSON.parse(read("knowledge/public-navigation-qa.v1.json"));
test("the public orientation source is bounded and source-labelled",()=>{
 assert.equal(qa.schema,"arshif-public-navigation-qa-v1");
 assert.equal(qa.records.length,24);
 assert.equal(new Set(qa.records.map(x=>x.id)).size,24);
 assert.equal(new Set(qa.records.map(x=>x.question.toLowerCase())).size,24);
 assert.ok(qa.records.every(x=>x.status==="public-navigation-seed"&&x.sourceClass==="public-archive-and-core-policy-summary"&&x.answer.length<1800));
 assert.doesNotMatch(JSON.stringify(qa),/privateTranscript|accessToken|studentRecord|vaultPassphrase/);
});
test("safe browser-local conversation has no private network or persistent transcript",()=>{
 new vm.Script(script);
 assert.match(script,/credentials:"same-origin"/);
 assert.match(script,/if\(sensitive\.test\(raw\)\)/);
 assert.match(script,/if\(crisis\.test\(raw\)\)/);
 assert.match(script,/From|credited to/);
 assert.doesNotMatch(script,/indexedDB|XMLHttpRequest|sessionStorage|document\.cookie|innerHTML/);
 assert.match(script,/clear\.addEventListener\("click"/);
});
test("source fidelity distinguishes provenance from interpretation",()=>{
 const lookup=qa.records.find(x=>x.topic==="preservation");
 const conflict=qa.records.find(x=>x.topic==="chronology");
 assert.match(lookup.answer,/original unchanged/);
 assert.match(conflict.answer,/Do not silently reconcile/);
 assert.match(qa.records.find(x=>x.topic==="arshif-auren").answer,/Auren specializes/);
});
test("public-only cross mentor knowledge is distinct and attributed",()=>{
 assert.match(federation,/arshif:"ARSHIF"/);
 assert.match(script,/sourceName/);
 assert.ok(html.indexOf("creative-spark-mentor-qa-v1.js")<html.indexOf("arshif-conversation-v1.js"));
 assert.match(script,/not a citation to a recovered private record/);
});
test("Voice On/Off is opt-in and stores only voice settings",()=>{
 assert.match(script,/vnv\.public\.voice\.autoplay\.arshif\.v1/);
 assert.match(script,/autoRead\?"Voice On":"Voice Off"/);
 assert.match(script,/if\(narrate&&autoRead&&who!=="You"\)speak\(text\)/);
 assert.match(script,/Listen to this reply/);
 assert.match(script,/window\.speechSynthesis\?\.cancel\(\)/);
 assert.doesNotMatch(script,/localStorage\.setItem\([^,]+,\s*(?:q|text|answer|message)\)/);
});
test("VNV/KA public front door keeps the live archive separate",()=>{
 assert.match(html,/https:\/\/vervenveda\.com\/Arshif\.github\.io\//);
 assert.match(html,/https:\/\/artist1970\.github\.io\/Auren\.github\.io\//);
 assert.match(html,/vnv-333-ticker\.js/);
 assert.match(html,/vnv-header-autopopulate\.js/);
 assert.match(html,/vnv-ecosystem-toolbar\.js/);
 assert.match(html,/class="anchor"/);
 assert.match(css,/\.anchor\{position:sticky/);
 assert.match(css,/--radius:7px/);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.doesNotMatch(html,/ARSHIFCore\.html|core_private\.json/);
});
