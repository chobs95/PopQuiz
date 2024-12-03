(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function s(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=s(e);fetch(e.href,t)}})();console.log("attempting get...",chrome.storage.local.get("highlights"));document.addEventListener("DOMContentLoaded",async function(){try{const n=(await chrome.storage.local.get(["highlights"])).highlights||[];i(n),l(n),d()}catch(o){console.error("Error fetching Highlighted text: ",o)}});async function i(o){const n=document.getElementById("placeholderText");if(o.length>0){n.remove();const s=document.getElementById("highlightContainer");o.forEach((r,e)=>{const t=document.createElement("div"),c=r.length>30?r.slice(0,30)+"...":r;t.className="entry",t.textContent=`${e+1}: ${c}`,removeButton=document.createElement("button"),removeButton.textContent="X",removeButton.className="removeButton",t.appendChild(removeButton),removeButton.addEventListener("click",()=>a(e,t)),s.appendChild(t)}),s.className="scrollBox"}else console.log("cool")}function l(o){if(o.length>0){container=document.getElementById("questionContainer");const n=document.createElement("button");n.textContent="Generate Question",n.className="questionButton",n.addEventListener("click",()=>u(o)),container.appendChild(n)}else console.log("noquestions")}function a(o,n){chrome.storage.local.get(["highlights"],s=>{const r=s.highlights||[];r.splice(o,1),chrome.storage.local.set({highlights:r}),n.remove()})}async function u(o){document.getElementById("scrollBoxContainer").remove();const s=document.getElementById("questionContainer");document.getElementById("titleMessage").textContent="Do you remember the answer?",s.remove(),console.log("here are the highlights : ",o);const r=o[Math.floor(Math.random()*o.length)];console.log(r);const e=await generateQuestionFromGemini(r),t=document.getElementById("innerContainer");e.textContent=`here is your question ${e}`,t.appendChild(e)}async function d(){const o=await fetch("https://eiqkz9d912.execute-api.eu-west-2.amazonaws.com/");console.log(o)}
