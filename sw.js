/* Offline support. Bump VERSION whenever you change files so devices pick up the update. */
const VERSION="wifi-qr-card-v1";
const CORE=["./", "index.html", "manifest.webmanifest", "assets/qrcode.js", "assets/logo.png", "assets/logo-mark.png", "assets/favicon-64.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 const mine=u.origin===location.origin&&!u.pathname.startsWith("/api/"),font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);if(!mine&&!font)return;
 e.respondWith(caches.open(VERSION).then(async c=>{const hit=await c.match(r,{ignoreSearch:mine});
  const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque"))c.put(r,res.clone());return res}).catch(()=>hit);return hit||net}))});
