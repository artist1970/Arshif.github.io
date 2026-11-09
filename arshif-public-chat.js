/* ARSHIF local public educational conversation. No storage, no network, no privileged archive access. */
(()=>{"use strict";const form=document.getElementById("arshif-chat-form"),input=document.getElementById("arshif-question"),output=document.getElementById("arshif-answer");if(!form||!input||!output)return;
const topics=[

["primary","A primary source was produced within the context being studied. It can be valuable without being impartial or complete."],
["secondary","A secondary source interprets earlier evidence. Evaluate the quality and diversity of its citations, rather than assuming its conclusions are automatic facts."],
["source","A trustworthy source can be identified, dated, placed in context, and compared against independent evidence. Ask who created it, for whom, and why."],
["citation","Record the author, title, date, publication or collection, stable identifier and specific passage whenever available. Never invent a citation."],
["catalog","A catalogue describes material so it can be discovered again. Begin with title, creator, date, subject and provenance."],
["archive","An archive preserves records with their provenance, context and access restrictions. Public access does not imply access to every protected collection."],
["histor","Historical inquiry compares evidence across time and acknowledges gaps. A confident tale is not necessarily a reliable history."],
["book","Books may offer facts, interpretations, stories, or speculation. Start by asking what kind of work it is and what evidence supports its claims."],
["poetry","Poetry invites attentive reading: consider image, rhythm, speaker, occasion and possible interpretations. Eiren can also help with literary craft."],
["translation","A careful translation preserves meaning and acknowledges ambiguity. Pierre is the specialist for French and multilingual language learning."],
["provenance","Provenance means the documented origin and custody of a source. It helps us know what an object is—and what remains uncertain."],
["preserv","Preservation includes readable formats, verified copies, responsible permissions and a durable description of the original."],
["research","Frame a narrow question, identify reliable sources, record what they actually say, and distinguish evidence from inference."],
["hello","Welcome to the librarian's desk. Would you care to explore a historical source, learn research methods, or browse the public tools?"]
];
function reply(v){const q=String(v||"").toLowerCase().trim().slice(0,700);if(!q)return "Offer a brief question and we shall begin.";if(/password|token|private key|student record|confidential file/.test(q))return "Please keep confidential information out of this public desk. We can discuss general research methods without it.";
const hit=topics.find(([topic])=>q.includes(topic));return hit?hit[1]:"An interesting inquiry. First tell me the subject, the time period and the kind of source you seek. We can decide what evidence would answer it without pretending to have searched private collections.";}
form.addEventListener("submit",e=>{e.preventDefault();output.textContent=reply(input.value);input.focus();});document.getElementById("arshif-clear")?.addEventListener("click",()=>{input.value="";output.textContent="A fresh page. What shall we discover next?";input.focus();});})();
