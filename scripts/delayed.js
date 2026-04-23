/**
 * delayed.js — Performance-optimised third-party integrations.
 *
 * This file is imported ~3 s after page load (scripts.js → loadDelayed).
 * Scripts are further tiered so heavy SDKs never compete with each other
 * or with the browser's own post-load work.
 *
 * Loading strategy
 * ────────────────
 * Tier 1 (idle callback, no extra delay)
 *   GTM — tag container; needed by ad/analytics pixels
 *   GA4 + Google Ads + Floodlight — lightweight gtag configs
 *   Meta Pixel — standard marketing pixel
 *   Microsoft Clarity — lightweight snippet
 *   Adobe Launch — required tag management
 *
 * Tier 2 (idle callback + 2 s extra delay)
 *   Bing UET — heavier ad SDK
 *   Netcore SmartTech — marketing automation SDK
 *
 * Tier 3 (idle callback + 4 s extra delay)
 *   Hotjar — session recording; most CPU-intensive, load last
 *
 * All scripts use async loading. requestIdleCallback (with a 2 s timeout
 * fallback) ensures they only execute when the main thread is free.
 */

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Append an async <script> to <head>.
 * @param {string} src
 * @param {Object} [attrs] — extra attributes, e.g. { defer: '' }
 */
function loadScript(src, attrs = {}) {
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

/**
 * Schedule work during browser idle time.
 * Falls back to setTimeout when rIC is unavailable (e.g. Safari < 16).
 * @param {Function} fn
 * @param {number} [timeout=2000] — deadline before forced execution (ms)
 */
function onIdle(fn, timeout = 2000) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(fn, { timeout });
  } else {
    setTimeout(fn, timeout);
  }
}

/**
 * Schedule work at idle time after an additional delay.
 * @param {Function} fn
 * @param {number} delay — extra ms to wait before scheduling idle callback
 */
function onIdleAfter(fn, delay) {
  setTimeout(() => onIdle(fn), delay);
}

// ---------------------------------------------------------------------------
// Tier 1 — fire at first idle slot (no extra delay beyond the 3 s from loadDelayed)
// ---------------------------------------------------------------------------
onIdle(() => {
  // ── 1. Google Tag Manager (GTM-5G46XDD) ──────────────────────────────────
  // Inline snippet + noscript fallback. GTM must be first so its tags fire.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  loadScript('https://www.googletagmanager.com/gtm.js?id=GTM-5G46XDD');

  // noscript fallback (harmless in JS context; browsers ignore <noscript> here)
  const ns = document.createElement('noscript');
  ns.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5G46XDD" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
  document.body.prepend(ns);

  // ── 2–4. GA4 + Google Ads + Floodlight (single gtag.js library) ──────────
  // eslint-disable-next-line prefer-rest-params
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-51XFB89N2W');   // GA4
  gtag('config', 'AW-701979898');   // Google Ads
  gtag('config', 'AW-823498124');   // Google Ads
  gtag('config', 'AW-761894235');   // Google Ads
  gtag('config', 'DC-15253010');    // Floodlight / DV360
  loadScript('https://www.googletagmanager.com/gtag/js?id=G-51XFB89N2W');

  // ── 5. Meta (Facebook) Pixel — 447481009564934 ───────────────────────────
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
  (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init','447481009564934');
  window.fbq('track','PageView');
  /* eslint-enable */

  // ── 6. Microsoft Clarity — 3xk6k0dj9y ────────────────────────────────────
  /* eslint-disable */
  (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window,document,'clarity','script','3xk6k0dj9y');
  /* eslint-enable */

  // ── 10. Adobe Launch — 0585812b25b8/c7a388058a71 ─────────────────────────
  loadScript('https://assets.adobedtm.com/0585812b25b8/c7a388058a71/launch-cd2dbe81961b.min.js');
});

// ---------------------------------------------------------------------------
// Tier 2 — idle callback after an additional 2 s
// ---------------------------------------------------------------------------
onIdleAfter(() => {
  // ── 7. Microsoft Advertising / Bing UET — 17437402 ───────────────────────
  /* eslint-disable */
  (function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[];
  f=function(){var o={ti:'17437402',enableAutoSpaTracking:true};o.q=w[u];
  w[u]=new UET(o);w[u].push('pageLoad')};n=d.createElement(t);n.src=r;n.async=1;
  n.onload=n.onreadystatechange=function(){var s=this.readyState;
  s&&s!=='loaded'&&s!=='complete'||(f(),n.onload=n.onreadystatechange=null)};
  i=d.getElementsByTagName(t)[0];i.parentNode.insertBefore(n,i);
  })(window,document,'script','https://bat.bing.com/bat.js','uetq');
  /* eslint-enable */

  // ── 9. Netcore SmartTech ─────────────────────────────────────────────────
  // Client key: ADGMOT35CHFLVDHBJNIG50K968KCH9AE37ADIBJU4V7HKR4G6JVG
  loadScript('https://cdnt.netcoresmartech.com/smartechclient.js');
}, 2000);

// ---------------------------------------------------------------------------
// Tier 3 — idle callback after an additional 4 s (Hotjar is CPU-heavy)
// ---------------------------------------------------------------------------
onIdleAfter(() => {
  // ── 8. Hotjar — 1132371 ───────────────────────────────────────────────────
  /* eslint-disable */
  (function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
  h._hjSettings={hjid:1132371,hjsv:6};a=o.getElementsByTagName('head')[0];
  r=o.createElement('script');r.async=1;
  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  /* eslint-enable */
}, 4000);
