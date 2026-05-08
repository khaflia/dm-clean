let t={isOpen:!1,isMinimized:!1,isAnimating:!1,currentView:null,dialogElement:null,iframeElement:null,floatingTabElement:null},a=null;function d(){try{const e=chrome.runtime.getURL(""),r=new URL(e).origin;return r&&r!=="null"?r:e}catch{return"*"}}function h(){return t.isOpen}function g(){var n;if(t.isOpen&&t.isMinimized){c();return}if(t.isOpen){console.log("[Discrub Content] Overlay already open, focusing existing overlay"),(n=t.dialogElement)==null||n.focus();return}console.log("[Discrub Content] Injecting launcher overlay");const e=document.createElement("dialog");e.id="discrub-overlay",e.style.cssText=`
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
  `;const r=document.createElement("iframe");r.id="discrub-iframe",r.src=chrome.runtime.getURL("launcher.html"),r.style.cssText=`
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  `,r.allow="storage-access *; clipboard-write *",e.appendChild(r),e.addEventListener("cancel",i=>{i.preventDefault(),u()}),document.body.appendChild(e),e.showModal(),t.isOpen=!0,t.currentView="launcher",t.dialogElement=e,t.iframeElement=r,console.log("[Discrub Content] Launcher overlay injected")}function l(e){if(!t.iframeElement)return;const r={launcher:chrome.runtime.getURL("launcher.html"),web:chrome.runtime.getURL("index.html"),classic:chrome.runtime.getURL("classic-wrapper.html")};console.log(`[Discrub Content] Switching view to: ${e}`),t.iframeElement.src=r[e],t.currentView=e,e==="classic"&&t.iframeElement.addEventListener("load",function n(){var i,s,o;(i=t.iframeElement)==null||i.removeEventListener("load",n),a&&((o=(s=t.iframeElement)==null?void 0:s.contentWindow)==null||o.postMessage({type:"discrub:token",token:a},d()))})}function u(){var r,n;if(!t.isOpen){console.log("[Discrub Content] No overlay to close");return}console.log("[Discrub Content] Closing fullscreen overlay"),t.isMinimized&&(y(),t.dialogElement&&(t.dialogElement.style.display=""),t.isMinimized=!1);const e=document.getElementById("discrub-floating-button");e&&(e.style.display="flex"),(r=t.dialogElement)==null||r.close(),(n=t.dialogElement)==null||n.remove(),t.isOpen=!1,t.isAnimating=!1,t.currentView=null,t.dialogElement=null,t.iframeElement=null,console.log("[Discrub Content] Fullscreen overlay closed")}function E(){if(!t.isOpen||t.isMinimized||t.isAnimating)return;console.log("[Discrub Content] Minimizing overlay"),t.isAnimating=!0,b();const e=t.dialogElement;e&&(e.style.willChange="transform, opacity",e.style.transformOrigin="bottom right",e.style.animation="discrub-shrink-to-tab 250ms cubic-bezier(0.4, 0, 0.2, 1) forwards",e.addEventListener("animationend",function r(){e.removeEventListener("animationend",r),e.close(),e.style.display="none",e.style.animation="",e.style.transformOrigin="",e.style.willChange="";const n=document.getElementById("discrub-floating-button");n&&(n.style.display="none"),v(),t.isMinimized=!0,t.isAnimating=!1}))}function c(){if(!t.isOpen||!t.isMinimized||t.isAnimating)return;console.log("[Discrub Content] Restoring overlay"),t.isAnimating=!0;const e=t.floatingTabElement;e&&(e.style.willChange="transform, opacity",e.style.animation="discrub-tab-slide-out 200ms cubic-bezier(0.4, 0, 0.2, 1) forwards",e.addEventListener("animationend",function r(){e.removeEventListener("animationend",r),y();const n=t.dialogElement;n?(n.style.willChange="transform, opacity",n.style.display="",n.showModal(),n.style.transformOrigin="bottom right",n.style.animation="discrub-expand-from-tab 250ms cubic-bezier(0.4, 0, 0.2, 1) forwards",n.addEventListener("animationend",function i(){var s,o;n.removeEventListener("animationend",i),n.style.animation="",n.style.transformOrigin="",n.style.willChange="",(o=(s=t.iframeElement)==null?void 0:s.contentWindow)==null||o.postMessage({type:"discrub:restored"},d()),t.isMinimized=!1,t.isAnimating=!1})):(t.isMinimized=!1,t.isAnimating=!1)}))}function b(){if(document.getElementById("discrub-tab-styles"))return;const e=document.createElement("style");e.id="discrub-tab-styles",e.textContent=`
    @keyframes discrub-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes discrub-shrink-to-tab {
      from { opacity: 1; transform: scale(1); }
      to   { opacity: 0; transform: scale(0.3) translateY(20%); }
    }
    @keyframes discrub-expand-from-tab {
      from { opacity: 0; transform: scale(0.3) translateY(20%); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes discrub-tab-slide-in {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }
    @keyframes discrub-tab-slide-out {
      from { transform: translateY(0); opacity: 1; }
      to   { transform: translateY(100%); opacity: 0; }
    }
  `,document.head.appendChild(e)}function v(){b();const e=document.createElement("div");e.id="discrub-floating-tab",e.style.cssText=`
    position: fixed;
    bottom: 0;
    right: 24px;
    min-width: 180px;
    max-width: 280px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 14px;
    cursor: pointer;
    z-index: 99998;
    transition: transform 0.2s ease;
    box-shadow: 0 -2px 12px rgba(102, 126, 234, 0.4);
    user-select: none;
    will-change: transform, opacity;
    animation: discrub-tab-slide-in 250ms cubic-bezier(0.4, 0, 0.2, 1);
  `;const r=document.createElement("img");r.src=chrome.runtime.getURL("discrub.png"),r.alt="Discrub",r.style.cssText=`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    pointer-events: none;
  `,e.appendChild(r);const n=document.createElement("span");n.id="discrub-floating-tab-status",n.textContent="Discrub",n.style.cssText=`
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
  `,e.appendChild(n);const i=document.createElement("span");i.id="discrub-floating-tab-dot",i.style.cssText=`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #43b581;
    display: none;
    flex-shrink: 0;
    animation: discrub-pulse 1.5s ease-in-out infinite;
    pointer-events: none;
  `,e.appendChild(i),e.addEventListener("click",()=>{c()}),e.addEventListener("mouseenter",()=>{e.style.transform="translateY(-3px)"}),e.addEventListener("mouseleave",()=>{e.style.transform="translateY(0)"}),document.body.appendChild(e),t.floatingTabElement=e}function y(){var e;(e=t.floatingTabElement)==null||e.remove(),t.floatingTabElement=null}function x(e){const r=document.getElementById("discrub-floating-tab-status"),n=document.getElementById("discrub-floating-tab-dot");r&&(r.textContent=e.isRunning?e.label:"Discrub"),n&&(n.style.display=e.isRunning?"block":"none")}window.addEventListener("message",e=>{var n,i,s;if(e.source!==((n=t.iframeElement)==null?void 0:n.contentWindow))return;const{type:r}=e.data||{};switch(r){case"discrub:operationStatus":x(e.data.payload);break;case"discrub:checkAuth":{const o=p();a=o,(s=(i=t.iframeElement)==null?void 0:i.contentWindow)==null||s.postMessage({type:"discrub:authStatus",authenticated:!!o,token:o},d());break}case"discrub:launch":{const o=e.data.version;(o==="web"||o==="classic")&&l(o);break}case"discrub:requestAuth":{t.iframeElement&&(t.iframeElement.src=chrome.runtime.getURL("index.html?authOnly=true"),t.currentView="web");break}case"discrub:authenticated":{a=e.data.token,l("launcher");break}case"discrub:switchVersion":{const o=e.data.version;l(o==="web"||o==="classic"?o:"launcher");break}}});function p(){try{let e=localStorage.getItem("token");if(e)return e.replace(/^"|"$/g,"");const r=Object.keys(localStorage);for(const n of r)if(n.includes("token")&&!n.includes("push")){const i=localStorage.getItem(n);if(i&&i.length>50)return console.log(`[Discrub Content] Found token in alternate location: ${n}`),i.replace(/^"|"$/g,"")}return console.warn("[Discrub Content] Discord token not found in localStorage"),null}catch(e){return console.error("[Discrub Content] Failed to retrieve Discord token:",e),null}}function f(){if(document.getElementById("discrub-floating-button"))return;console.log("[Discrub Content] Injecting Discrub button");const e=document.createElement("div");e.id="discrub-floating-button",e.title="Open Discrub";const r=document.createElement("img");r.src=chrome.runtime.getURL("discrub.png"),r.alt="Discrub",r.style.cssText=`
    width: 20px;
    height: 20px;
    pointer-events: none;
    border-radius: 50%;
  `,e.appendChild(r),e.addEventListener("click",()=>{var i;console.log("[Discrub Content] Button clicked"),t.isMinimized?c():h()?(i=t.dialogElement)==null||i.focus():g()}),e.addEventListener("mouseenter",()=>{e.style.opacity="1"}),e.addEventListener("mouseleave",()=>{e.style.opacity="0.8"});function n(i){var o,m;const s=((o=document.querySelector('[aria-label="Inbox"]'))==null?void 0:o.parentElement)||((m=document.querySelector('[aria-label="Help"]'))==null?void 0:m.parentElement);s?(e.style.cssText=`
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.8;
        transition: opacity 150ms ease;
      `,s.style.display="flex",s.style.flexDirection="row-reverse",s.style.alignItems="center",s.style.justifyContent="center",s.appendChild(e),console.log("[Discrub Content] Button injected into Discord toolbar")):i>0?setTimeout(()=>n(i-1),500):(e.style.cssText=`
        position: fixed;
        top: 12px;
        right: 60px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 150ms ease;
        opacity: 0.8;
      `,document.body.appendChild(e),console.log("[Discrub Content] Button injected as fixed fallback (toolbar not found)"))}n(10)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f();chrome.runtime.onMessage.addListener((e,r,n)=>{switch(console.log("[Discrub Content] Received message:",e.action),e.action){case"getToken":{const i=p();a=i;const s=i!==null;return console.log(`[Discrub Content] Token retrieval ${s?"successful":"failed"}`),n({token:i,success:s}),!0}case"injectOverlay":{try{g(),n({success:!0})}catch(i){console.error("[Discrub Content] Failed to inject overlay:",i),n({success:!1,error:i instanceof Error?i.message:"Unknown error"})}return!0}case"closeOverlay":{try{u(),n({success:!0})}catch(i){console.error("[Discrub Content] Failed to close overlay:",i),n({success:!1,error:i instanceof Error?i.message:"Unknown error"})}return!0}case"minimizeOverlay":{try{E(),n({success:!0})}catch(i){console.error("[Discrub Content] Failed to minimize overlay:",i),n({success:!1,error:i instanceof Error?i.message:"Unknown error"})}return!0}case"restoreOverlay":{try{c(),n({success:!0})}catch(i){console.error("[Discrub Content] Failed to restore overlay:",i),n({success:!1,error:i instanceof Error?i.message:"Unknown error"})}return!0}case"isOverlayOpen":return n({isOpen:t.isOpen,isMinimized:t.isMinimized}),!0;case"ping":return n({pong:!0}),!0;default:return e.message==="CLOSE_INJECTED_DIALOG"?(console.log("[Discrub Content] Classic requested close"),u(),n({success:!0}),!0):!1}});console.log("[Discrub Content] Content script initialized on",window.location.href);
