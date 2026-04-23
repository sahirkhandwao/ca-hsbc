/**
 * delayed.js — Third-party integrations for Canara HSBC Life Insurance EDS project.
 *
 * Loaded ~3 seconds after page load (see scripts.js: loadDelayed).
 * All integrations mirror those found on www.canarahsbclife.com.
 *
 * Integrations:
 *  1. Google Tag Manager (GTM-5G46XDD) — tag container (already in <head>, noscript fallback here)
 *  2. Google Analytics 4 (G-51XFB89N2W)
 *  3. Google Ads Conversion Tracking (AW-701979898, AW-823498124, AW-761894235)
 *  4. Google Floodlight / Display & Video 360 (DC-15253010)
 *  5. Meta (Facebook) Pixel (447481009564934)
 *  6. Microsoft Clarity (3xk6k0dj9y)
 *  7. Microsoft Advertising / Bing UET (17437402)
 *  8. Hotjar (1132371)
 *  9. Netcore SmartTech (ADGMOT35CHFLVDHBJNIG50K968KCH9AE37ADIBJU4V7HKR4G6JVG)
 * 10. Adobe Launch / Experience Platform Tags
 */

// ---------------------------------------------------------------------------
// Helper: load an external script asynchronously
// ---------------------------------------------------------------------------
function loadScript(src, attrs = {}) {
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

// ---------------------------------------------------------------------------
// Helper: inject raw HTML into <body> (for noscript / pixel iframes)
// ---------------------------------------------------------------------------
function injectHTML(html) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);
}

// ---------------------------------------------------------------------------
// 1. GTM noscript fallback
//    (The JS snippet is already in head.html; this covers no-JS environments)
// ---------------------------------------------------------------------------
injectHTML(`<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5G46XDD"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`);

// ---------------------------------------------------------------------------
// 2 & 3 & 4. Google gtag.js — GA4 + Google Ads + Floodlight
//    Load the gtag library once, then configure each property.
// ---------------------------------------------------------------------------
window.dataLayer = window.dataLayer || [];
// eslint-disable-next-line prefer-rest-params
function gtag() { window.dataLayer.push(arguments); }
window.gtag = gtag;
gtag('js', new Date());

// GA4
gtag('config', 'G-51XFB89N2W');

// Google Ads conversion tracking
gtag('config', 'AW-701979898');
gtag('config', 'AW-823498124');
gtag('config', 'AW-761894235');

// Floodlight / Display & Video 360
gtag('config', 'DC-15253010');

// Load the gtag.js library (uses first property as the gtag ID)
loadScript('https://www.googletagmanager.com/gtag/js?id=G-51XFB89N2W');

// ---------------------------------------------------------------------------
// 5. Meta (Facebook) Pixel — ID: 447481009564934
// ---------------------------------------------------------------------------
/* eslint-disable */
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
window.fbq('init', '447481009564934');
window.fbq('track', 'PageView');
/* eslint-enable */

injectHTML(`<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=447481009564934&ev=PageView&noscript=1"/></noscript>`);

// ---------------------------------------------------------------------------
// 6. Microsoft Clarity — Project ID: 3xk6k0dj9y
// ---------------------------------------------------------------------------
/* eslint-disable */
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","3xk6k0dj9y");
/* eslint-enable */

// ---------------------------------------------------------------------------
// 7. Microsoft Advertising / Bing UET — Tag ID: 17437402
// ---------------------------------------------------------------------------
/* eslint-disable */
(function(w,d,t,r,u){
  var f,n,i;
  w[u]=w[u]||[],f=function(){var o={ti:'17437402',enableAutoSpaTracking:true};
  o.q=w[u],w[u]=new UET(o),w[u].push('pageLoad')};
  n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){
  var s=this.readyState;s&&s!=='loaded'&&s!=='complete'||(f(),n.onload=n.onreadystatechange=null)};
  i=d.getElementsByTagName(t)[0];i.parentNode.insertBefore(n,i)
})(window,document,'script','https://bat.bing.com/bat.js','uetq');
/* eslint-enable */

// ---------------------------------------------------------------------------
// 8. Hotjar — Site ID: 1132371
// ---------------------------------------------------------------------------
/* eslint-disable */
(function(h,o,t,j,a,r){
  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
  h._hjSettings={hjid:1132371,hjsv:6};
  a=o.getElementsByTagName('head')[0];
  r=o.createElement('script');r.async=1;
  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
  a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
/* eslint-enable */

// ---------------------------------------------------------------------------
// 9. Netcore SmartTech — Client Key: ADGMOT35CHFLVDHBJNIG50K968KCH9AE37ADIBJU4V7HKR4G6JVG
//    Loads the main SmartTech client SDK.
// ---------------------------------------------------------------------------
loadScript('https://cdnt.netcoresmartech.com/smartechclient.js');

// ---------------------------------------------------------------------------
// 10. Adobe Launch / Experience Platform Tags
//     Property: 0585812b25b8/c7a388058a71
// ---------------------------------------------------------------------------
loadScript('https://assets.adobedtm.com/0585812b25b8/c7a388058a71/launch-cd2dbe81961b.min.js');
