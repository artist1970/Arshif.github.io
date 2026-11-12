/* ARSHIF · Public Archivist v1. Local chat, static public source material only. */
(()=>{"use strict";
const $=id=>document.getElementById(id);
const input=$("arshif-message"),log=$("arshif-thread"),status=$("arshif-status"),send=$("arshif-send"),clear=$("arshif-clear");
if(!input||!log||!send||!clear)return;
let records=[],loaded=false,lastTopic="",replyCount=0,voices=[],selected="auto",autoRead=false;
const voicePref="vnv.public.voice.arshif.v1",autoPref="vnv.public.voice.autoplay.arshif.v1";
const norm=s=>String(s||"").normalize("NFKC").toLowerCase().replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();
const omit=new Set(["what","where","when","why","how","which","could","should","would","have","this","that","with","from","about","please","tell","help","want","does","your","there","into","their","more"]);
const words=s=>new Set(norm(s).split(" ").filter(t=>t.length>2&&!omit.has(t)));
const sensitive=/\b(?:password|private key|access token|api key|social security|ssn|credit card|bank account|private transcript|student record|medical record|home address|secret code|login credential)\b/i;
const crisis=/\b(?:suicide|kill myself|end my life|hurt myself|self harm|self-harm|immediate danger|emergency)\b/i;
const sourceLine="Public ARSHIF catalogue and preservation guidance; not a private archive lookup.";
const voiceSelect=$("arshif-voice"),voiceToggle=$("arshif-voice-toggle"),preview=$("arshif-preview"),stop=$("arshif-stop"),voiceStatus=$("arshif-voice-status");
const supported=!!(window.speechSynthesis&&window.SpeechSynthesisUtterance);
try{const v=localStorage.getItem(voicePref);if(v&&v.length<500)selected=v;autoRead=localStorage.getItem(autoPref)==="on";}catch{}
function voiceKey(v){return JSON.stringify([v.voiceURI||"",v.name||"",v.lang||"",!!v.localService]);}
function refreshVoice(){
 if(!supported)return;
 voices=window.speechSynthesis.getVoices()||[];
 voiceSelect.replaceChildren();
 const defaultOption=document.createElement("option");defaultOption.value="auto";defaultOption.textContent="Device default";voiceSelect.append(defaultOption);
 for(const v of voices){const o=document.createElement("option");o.value=voiceKey(v);o.textContent=v.name+" · "+v.lang;voiceSelect.append(o);}
 voiceSelect.value=voices.some(v=>voiceKey(v)===selected)?selected:"auto";
}
function speak(text){
 if(!supported)return;
 try{
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(String(text).slice(0,2600));
  const v=voices.find(x=>voiceKey(x)===voiceSelect.value);
  if(v){u.voice=v;u.lang=v.lang;}else u.lang="en-US";
  u.rate=.9;u.volume=.85;
  u.onend=()=>{voiceStatus.textContent="Playback finished.";};
  u.onerror=()=>{voiceStatus.textContent="Playback unavailable.";};
  window.speechSynthesis.speak(u);voiceStatus.textContent="Reading ARSHIF's reply.";
 }catch{voiceStatus.textContent="Browser speech unavailable.";}
}
function paintToggle(){voiceToggle.textContent=autoRead?"Voice On":"Voice Off";voiceToggle.setAttribute("aria-pressed",String(autoRead));}
paintToggle();
if(supported){refreshVoice();window.speechSynthesis.addEventListener?.("voiceschanged",refreshVoice);}
else{voiceSelect.disabled=true;voiceToggle.disabled=true;preview.disabled=true;stop.disabled=true;voiceStatus.textContent="Speech unavailable in this browser.";}
voiceSelect.addEventListener("change",()=>{selected=voiceSelect.value;try{localStorage.setItem(voicePref,selected);}catch{}});
voiceToggle.addEventListener("click",()=>{if(!supported)return;autoRead=!autoRead;try{localStorage.setItem(autoPref,autoRead?"on":"off");}catch{}if(!autoRead)window.speechSynthesis.cancel();paintToggle();voiceStatus.textContent=autoRead?"New replies will be read aloud.":"Automatic narration is off.";});
preview.addEventListener("click",()=>speak("Welcome to ARSHIF, the living archive of human knowledge."));
stop.addEventListener("click",()=>{window.speechSynthesis?.cancel();voiceStatus.textContent="Audio stopped.";});
function append(who,text,{narrate=false}={}){
 const turn=document.createElement("div");turn.className="arshif-turn "+(who==="You"?"arshif-you":"arshif-mentor");
 const label=document.createElement("strong");label.textContent=who;
 const para=document.createElement("p");para.textContent=text;turn.append(label,para);
 if(who!=="You"){const replay=document.createElement("button");replay.type="button";replay.className="secondary arshif-replay";replay.textContent="Listen to this reply";replay.addEventListener("click",()=>speak(text));turn.append(replay);}
 log.append(turn);log.scrollTop=log.scrollHeight;
 if(narrate&&autoRead&&who!=="You")speak(text);
}
function lookup(q){
 const query=norm(q),tokens=words(query);
 const ranked=records.map(r=>{
  const normalized=norm(r.question),w=words(normalized);
  const common=[...tokens].filter(t=>w.has(t)).length;
  const coverage=common/Math.max(1,tokens.size);
  const score=query===normalized?100:common>=2&&coverage>=.75?50+Math.round(coverage*30):0;
  return {record:r,score};
 }).sort((a,b)=>b.score-a.score);
 if(!ranked.length||ranked[0].score<75)return null;
 if(ranked[1]&&ranked[0].score===ranked[1].score)return null;
 return ranked[0].record;
}
function respond(q){
 const raw=q.trim(),s=norm(raw);
 if(!s)return "You may ask about provenance, archives, source history, a research hall or the public directory.";
 if(sensitive.test(raw))return "Please do not enter private records, credentials or identifying information here. I can explain preservation methods but cannot open your restricted archives.";
 if(crisis.test(raw))return "This public archive guide cannot provide emergency care. If someone is in immediate danger, contact local emergency services or a trusted person nearby.";
 if(["hi","hello","hey","good morning","good evening"].includes(s))return "Welcome. What would you like to preserve, research, classify or trace today?";
 const item=lookup(raw);
 if(item){lastTopic=item.topic;return item.answer+"\n\nSource context: "+sourceLine;}
 if(/^(tell me more|continue|another example|what next|go on)$/.test(s)&&lastTopic)
  return "We were exploring "+lastTopic+". Would you like a source-checking checklist, a related research hall, or guidance on keeping the original and interpretation separate?";
 const academic=/\b(?:poetry|poem|grammar|vocabulary|drawing|painting|literature|study method|music theory|writing)\b/i.test(raw);
 if(academic){
  const ref=window.CreativeSparkMentorQA?.answer(raw,{mentorId:"arshif",scope:"public-archive"});
  if(ref)return "Public specialist reference, credited to "+ref.sourceName+": "+ref.answer+" (Topic: "+ref.topic+".) This is not a citation to a recovered private record.";
 }
 return "I do not have a clearly matched public answer for that. Try asking about the hall directory, primary sources, provenance, archival context, historical documents or research methods. I cannot access private sources here.";
}
async function load(){
 try{
  const r=await fetch("./knowledge/public-navigation-qa.v1.json",{credentials:"same-origin",cache:"no-store"});
  if(!r.ok)throw Error("unavailable");
  const j=await r.json();if(j.schema!=="arshif-public-navigation-qa-v1"||!Array.isArray(j.records)||j.records.length!==24)throw Error("schema");
  const ids=new Set(),qs=new Set();
  for(const item of j.records){
   if(item.status!=="public-navigation-seed"||typeof item.id!=="string"||ids.has(item.id)||typeof item.question!=="string"||qs.has(norm(item.question))||typeof item.answer!=="string"||!item.answer.trim()||item.answer.length>1800)throw Error("record");
   ids.add(item.id);qs.add(norm(item.question));
  }
  records=j.records;loaded=true;status.textContent="24 public orientation answers ready · no private archive access.";
 }catch{status.textContent="Public orientation data unavailable. You can still browse the ARSHIF Archives via the links above.";}
}
function submit(){
 const q=input.value.trim();if(!q||q.length>800)return;
 append("You",q);const answer=respond(q);append("ARSHIF",answer,{narrate:true});replyCount++;input.value="";input.focus();
}
send.addEventListener("click",submit);
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing){e.preventDefault();submit();}});
clear.addEventListener("click",()=>{window.speechSynthesis?.cancel();log.replaceChildren();lastTopic="";replyCount=0;window.CreativeSparkMentorQA?.reset?.({mentorId:"arshif",scope:"public-archive"});append("ARSHIF","A new page begins. What source or subject would you like to explore?");input.value="";input.focus();});
document.querySelectorAll("[data-arshif-question]").forEach(b=>b.addEventListener("click",()=>{input.value=b.dataset.arshifQuestion||"";submit();}));
append("ARSHIF","Welcome to the public ARSHIF reading desk. I can help you discover halls, compare source types and preserve context. I cannot open private archival records.");
load();
})();