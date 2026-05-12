/**
 * analytics.js — EDS Analytics module for ca-hsbc
 *
 * Replicates all dataLayer events observed on
 * https://www.canarahsbclife.com/blog/life-insurance
 *
 * Events implemented:
 *   - Landed                      — page load (fires once, immediately)
 *   - buttonClick                 — Load More, Popular Search, Category filter, Nav CTAs,
 *                                   ClosePopUp, form CTA buttons
 *   - LogoClick                   — header and footer logo
 *   - hamburgerMenuClick          — hamburger menu open/close
 *   - enter_search_autosuggestions — search result suggestion click
 *   - blog_card_click             — article card click (blog listing cards)
 *   - ExitPopUpOpen               — exit intent popup shown
 *   - lead_form_start             — first interaction with lead form
 *   - lead_form_submit            — successful lead form submission
 *
 * GTM container GTM-WTFT6D3F is already loaded via delayed.js.
 * This module fires events into window.dataLayer directly.
 *
 * Usage: imported by scripts.js and called from
 * individual block decorators as needed.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getClientId() {
  const ga = document.cookie.split(';').map((c) => c.trim()).find((c) => c.startsWith('_ga='));
  if (!ga) return '';
  const parts = ga.replace('_ga=', '').split('.');
  return parts.length >= 4 ? `${parts[2]}.${parts[3]}` : '';
}

function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key) || '';
}

/** Derive PageCategory from URL path — matches source logic */
function getPageCategory(href = window.location.href) {
  try {
    const path = new URL(href).pathname.replace(/^\//, '');
    const parts = path.split('/');
    if (!parts[0] || parts[0] === '') return 'homepage';
    return parts[0];
  } catch {
    return 'homepage';
  }
}

/** Derive PageName from URL — last path segment */
function getPageName(href = window.location.href) {
  try {
    const { pathname } = new URL(href);
    const lastSlash = pathname.lastIndexOf('/');
    const start = lastSlash + 1;
    if (start >= pathname.length) return 'homepage';
    return pathname.substring(start);
  } catch {
    return 'homepage';
  }
}

/** Derive PageSubCategory — second path segment after first */
function getPageSubCategory(href = window.location.href) {
  try {
    const path = new URL(href).pathname.replace(/^\//, '');
    const parts = path.split('/');
    if (parts.length > 2 && parts[2]) return parts[2];
    if (parts.length > 1 && parts[1]) return parts[1];
    return '';
  } catch {
    return '';
  }
}

/** Derive PageType from URL and page meta */
function getPageType() {
  const url = window.location.href;
  const metaTemplate = document.querySelector("meta[name='template']");

  if (metaTemplate) {
    if (metaTemplate.content === 'chli-blog-page-template') return 'Blog Detail Page';
    if (metaTemplate.content === 'chli-clp-template') return 'Campaign';
  }

  if (url.includes('blog')) {
    const path = new URL(url).pathname.replace(/^\//, '').split('/');
    if (path.length >= 3 && path[2]) return 'Blog Detail Page';
    return 'Blog Listing Page';
  }
  if (url.includes('tools-and-calculators')) return 'Calculators';
  if (url.includes('404')) return '404';
  if (url.includes('funds-navs')) return 'Funds-Nav';
  if (url.includes('garv')) return 'Garv';
  if (url.includes('contact-us')) return 'Contact Us';
  if (url.includes('about-us')) return 'About Us';

  const pathParts = new URL(url).pathname.replace(/^\//, '').split('/');
  if (!pathParts[0]) return 'Home';

  return 'Other Pages';
}

/** UserType: repeat if clientID localStorage is set */
function getUserType() {
  try {
    return localStorage.getItem('clientID') ? 'repeat' : 'new';
  } catch {
    return 'new';
  }
}

// ---------------------------------------------------------------------------
// Core dataLayer push — matches the source createDataLayer() signature exactly
// ---------------------------------------------------------------------------
function push(event, overrides = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    Age: '',
    AnnualIncome: '',
    ArticleName: '',
    BlogCategory: '',
    BlogPublishDate: '',
    ButtonName: '',
    PageSection: '',
    ClientID: getClientId(),
    DOB: '',
    EmailID: '',
    MobileNumber: '',
    userMob: '',
    userEmailId: '',
    mobile_hash: '',
    emailId_hash: '',
    gclid: getQueryParam('gclid'),
    Gender: '',
    Name: '',
    PageCategory: getPageCategory(),
    PageName: getPageName(),
    PageSubCategory: getPageSubCategory(),
    PageType: getPageType(),
    PinCode: '',
    City: '',
    PlanOption: '',
    ProductCategory: '',
    ProductName: '',
    Question: '',
    Source: 'In House',
    UserType: getUserType(),
    SearchTerm: '',
    BannerType: '',
    PageURL: window.location.href,
    LeadID: '',
    leadFormType: '',
    VideoTitle: '',
    VideoProgress: '',
    BannerName: '',
    cityName: '',
    ...overrides,
  });
}

// ---------------------------------------------------------------------------
// Event: Landed — fires on page load
// ---------------------------------------------------------------------------
export function trackLanded() {
  push('Landed');
}

// ---------------------------------------------------------------------------
// Event: buttonClick — generic CTA / button interaction
// ---------------------------------------------------------------------------
export function trackButtonClick(buttonName, pageSection = '') {
  push('buttonClick', { ButtonName: buttonName, PageSection: pageSection });
}

// ---------------------------------------------------------------------------
// Event: LogoClick
// ---------------------------------------------------------------------------
export function trackLogoClick(section = 'Header_Logo') {
  push('LogoClick', { ButtonName: 'LogoClick', PageSection: section });
}

// ---------------------------------------------------------------------------
// Event: hamburgerMenuClick — hamburger menu open/close
// ---------------------------------------------------------------------------
export function trackHamburgerMenuClick() {
  push('hamburgerMenuClick', {
    ButtonName: 'Hamburger Menu',
    PageSection: 'Hamburger Menu',
  });
}

// ---------------------------------------------------------------------------
// Event: ExitPopUpOpen — exit intent popup shown
// ---------------------------------------------------------------------------
export function trackExitPopUpOpen({ productName = '', productCategory = '' } = {}) {
  push('ExitPopUpOpen', {
    ButtonName: 'ExitPopUpOpen',
    PageSection: 'Form_ExitPopup',
    ProductName: productName,
    ProductCategory: productCategory,
  });
}

// ---------------------------------------------------------------------------
// Event: ClosePopUp (fired as buttonClick with ButtonName=ClosePopUp)
// ---------------------------------------------------------------------------
export function trackClosePopUp() {
  push('buttonClick', {
    ButtonName: 'ClosePopUp',
    PageSection: 'Form_ClosePopup',
  });
}

// ---------------------------------------------------------------------------
// Event: enter_search_autosuggestions — when user clicks a search suggestion
// ---------------------------------------------------------------------------
export function trackSearchSuggestionClick(searchTerm, pageSection = 'Header Search') {
  push('enter_search_autosuggestions', { SearchTerm: searchTerm, PageSection: pageSection });
}

// ---------------------------------------------------------------------------
// Event: blog_card_click — article card click on listing page
// ---------------------------------------------------------------------------
export function trackBlogCardClick(articleName, blogCategory = '', blogPublishDate = '') {
  push('buttonClick', {
    ButtonName: articleName,
    PageSection: 'Blog Listing',
    ArticleName: articleName,
    BlogCategory: blogCategory,
    BlogPublishDate: blogPublishDate,
  });
}

// ---------------------------------------------------------------------------
// Event: lead_form_start — first input interaction in lead form
// ---------------------------------------------------------------------------
export function trackLeadFormStart(leadFormType = 'blog-lead-form') {
  push('lead_form_start', { leadFormType, PageSection: 'Lead Form' });
}

// ---------------------------------------------------------------------------
// Event: lead_form_submit — successful submission
// ---------------------------------------------------------------------------
export function trackLeadFormSubmit({
  name = '',
  email = '',
  mobile = '',
  leadId = '',
  productName = '',
  productCategory = '',
} = {}) {
  push('lead_form_submit', {
    Name: name,
    EmailID: email ? btoa(email) : '',
    MobileNumber: mobile ? btoa(mobile) : '',
    mobile_hash: mobile ? btoa(mobile) : '',
    emailId_hash: email ? btoa(email) : '',
    LeadID: leadId,
    ProductName: productName,
    ProductCategory: productCategory,
    leadFormType: 'blog-lead-form',
    PageSection: 'Lead Form',
  });
}

// ---------------------------------------------------------------------------
// Auto-wiring helpers
// ---------------------------------------------------------------------------

/** Wire Popular Searches block */
function wirePopularSearches() {
  document.querySelectorAll('.popular-searches-links a, .popular-searches a').forEach((link) => {
    if (link.dataset.analyticsWired) return;
    link.dataset.analyticsWired = '1';
    link.addEventListener('click', () => {
      trackButtonClick(link.textContent.trim(), 'Popular Search');
    });
  });
}

/** Wire Load More button (blog-cards block) */
function wireLoadMore() {
  document.querySelectorAll('.blog-cards-loadmore-btn, .blog-cards .load-more-btn').forEach((btn) => {
    if (btn.dataset.analyticsWired) return;
    btn.dataset.analyticsWired = '1';
    btn.addEventListener('click', () => {
      const h1 = document.querySelector('h1, .default-content-wrapper h2');
      trackButtonClick('Load More', h1 ? h1.textContent.trim() : 'Blog Listing');
    });
  });
}

/** Wire Category Links block */
function wireCategoryLinks() {
  document.querySelectorAll('.category-links-content a, .category-links a').forEach((link) => {
    if (link.dataset.analyticsWired) return;
    link.dataset.analyticsWired = '1';
    link.addEventListener('click', () => {
      trackButtonClick(link.textContent.trim(), 'Category Filter');
    });
  });
}

/** Wire Blog Search — suggestion clicks and search submit */
function wireBlogSearch() {
  const container = document.querySelector('.blog-search');
  if (!container) return;

  // Re-wire dynamically rendered suggestions
  new MutationObserver(() => {
    container.querySelectorAll('[class*=suggestion] a, [class*=result] a, [class*=autocomplete] a').forEach((link) => {
      if (link.dataset.analyticsWired) return;
      link.dataset.analyticsWired = '1';
      link.addEventListener('click', () => {
        trackSearchSuggestionClick(link.textContent.trim(), 'Blog Search');
      });
    });
  }).observe(container, { childList: true, subtree: true });

  // Search input (blog-search uses #blog-search-input)
  const input = container.querySelector('#blog-search-input, input[type="text"], input[type="search"]');
  const submitBtn = container.querySelector('.blog-search-submit, button[type="submit"]');

  // Submit button click
  if (submitBtn && !submitBtn.dataset.analyticsWired) {
    submitBtn.dataset.analyticsWired = '1';
    submitBtn.addEventListener('click', () => {
      trackButtonClick(input?.value?.trim() || 'Search', 'Blog Search');
    });
  }

  // Enter key in search input
  if (input && !input.dataset.analyticsKeyWired) {
    input.dataset.analyticsKeyWired = '1';
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        trackButtonClick(input.value.trim() || 'Search', 'Blog Search');
      }
    });
  }
}

/** Wire Blog Cards — article card clicks */
function wireBlogCards() {
  document.querySelectorAll('.blog-cards-card-link, .blog-cards a[href*="/blog/"]').forEach((link) => {
    if (link.dataset.analyticsWired) return;
    link.dataset.analyticsWired = '1';
    link.addEventListener('click', () => {
      const card = link.closest('.blog-cards-card') || link.closest('li') || link.parentElement;
      const title = card?.querySelector('h3, h2, .blog-cards-card-title')?.textContent?.trim()
        || link.getAttribute('title')
        || link.textContent.trim();
      const category = card?.querySelector('.blog-cards-card-tag, [class*=category], [class*=tag]')?.textContent?.trim() || '';
      const date = card?.querySelector('.blog-cards-meta-item span, time, [class*=date]')?.textContent?.trim() || '';
      trackBlogCardClick(title, category, date);
    });
  });
}

/** Wire Header logo and footer logo */
function wireHeaderLogo() {
  // Listen for custom event dispatched by header.js
  document.addEventListener('header:logo-click', (e) => {
    const section = e?.detail?.section || 'Header_Logo';
    trackLogoClick(section);
  });

  // Fallback: wire directly if already in DOM
  const headerEl = document.querySelector('header');
  if (!headerEl) return;
  const logoLink = headerEl.querySelector('a[href="/"], a.logo, .header__logo a, .logo a');
  if (logoLink && !logoLink.dataset.analyticsWired) {
    logoLink.dataset.analyticsWired = '1';
    logoLink.addEventListener('click', () => trackLogoClick('Header_Logo'));
  }
}

function wireFooterLogo() {
  const footerEl = document.querySelector('footer');
  if (!footerEl) return;

  const logoLink = footerEl.querySelector('a[href="/"], a.logo, .footer__logo a, .logo a');
  if (logoLink && !logoLink.dataset.analyticsWired) {
    logoLink.dataset.analyticsWired = '1';
    logoLink.addEventListener('click', () => trackLogoClick('Footer_Logo'));
  }
}

/** Wire Hamburger Menu — header block fires a custom event 'header:hamburger-toggle' */
function wireHamburgerMenu() {
  // Listen for a custom event dispatched by header.js on hamburger open/close
  document.addEventListener('header:hamburger-toggle', () => {
    trackHamburgerMenuClick();
  });

  // Fallback: wire click directly on the hamburger button if already in DOM
  const hamburgerBtn = document.querySelector(
    'header .header__hamburger--button, header [class*=hamburger][class*=button], header [aria-label*=menu]',
  );
  if (hamburgerBtn && !hamburgerBtn.dataset.analyticsWired) {
    hamburgerBtn.dataset.analyticsWired = '1';
    hamburgerBtn.addEventListener('click', () => trackHamburgerMenuClick());
  }
}

/** Wire Exit Popup — listens for custom events AND watches DOM for .exit-popup element */
function wireExitPopup() {
  // Custom events dispatched by an exit-popup block (if present)
  document.addEventListener('exit-popup:open', (e) => {
    const { productName = '', productCategory = '' } = e.detail || {};
    trackExitPopUpOpen({ productName, productCategory });
  });

  document.addEventListener('exit-popup:close', () => {
    trackClosePopUp();
  });

  // Direct DOM wiring — handle .exit-popup if it exists in page HTML
  function wireExitPopupDOM() {
    const closeBtn = document.querySelector('.close__btn, .close__btn-container, [class*=exit-popup] [class*=close]');
    if (closeBtn && !closeBtn.dataset.analyticsWired) {
      closeBtn.dataset.analyticsWired = '1';
      closeBtn.addEventListener('click', () => trackClosePopUp());
    }
  }

  // Try now and re-try when DOM mutates (exit popup may render asynchronously)
  wireExitPopupDOM();
  new MutationObserver(() => wireExitPopupDOM())
    .observe(document.body, { childList: true, subtree: true });
}

/** Wire Lead Form interactions */
function wireLeadForm() {
  const form = document.querySelector('.lead-form .lf-form, .lead-form form');
  if (!form || form.dataset.analyticsWired) return;
  form.dataset.analyticsWired = '1';

  let started = false;
  form.addEventListener('input', () => {
    if (!started) {
      started = true;
      trackLeadFormStart('blog-lead-form');
    }
  }, { passive: true });
}

/** Wire lead-form:submitted custom event dispatched by lead-form.js */
function wireLeadFormSubmit() {
  document.addEventListener('lead-form:submitted', (e) => {
    const {
      name = '', email = '', mobile = '',
      leadId = '', productName = '', productCategory = '',
    } = e.detail || {};
    trackLeadFormSubmit({
      name, email, mobile, leadId, productName, productCategory,
    });
  });
}

/** Wire Nav CTA buttons (Get a Quote, Buy Now, etc.) in header */
function wireNavCTAs() {
  const header = document.querySelector('header');
  if (!header) return;

  header.querySelectorAll('a.btn, a.button, a[class*=cta], nav a.primary, .header__cta a').forEach((link) => {
    if (link.dataset.analyticsWired) return;
    link.dataset.analyticsWired = '1';
    link.addEventListener('click', () => {
      trackButtonClick(link.textContent.trim(), 'Header Nav');
    });
  });
}

// ---------------------------------------------------------------------------
// init — called from scripts.js after blocks are decorated
// ---------------------------------------------------------------------------
export function initAnalytics() {
  // Fire Landed immediately
  trackLanded();

  // Wire all event listeners — run after blocks are painted
  requestAnimationFrame(() => {
    wirePopularSearches();
    wireLoadMore();
    wireCategoryLinks();
    wireBlogSearch();
    wireBlogCards();
    wireHeaderLogo();
    wireFooterLogo();
    wireHamburgerMenu();
    wireExitPopup();
    wireLeadForm();
    wireLeadFormSubmit();
    wireNavCTAs();

    // Re-wire after dynamic content loads (load-more appending cards, etc.)
    const main = document.querySelector('main');
    if (main) {
      const mo = new MutationObserver(() => {
        wireBlogCards();
        wireLoadMore();
        wirePopularSearches();
        wireCategoryLinks();
      });
      mo.observe(main, { childList: true, subtree: true });
    }

    // Re-wire header/footer after they load asynchronously
    const headerEl = document.querySelector('header');
    const footerEl = document.querySelector('footer');
    const rewireHeaderFooter = (el) => {
      if (!el) return;
      new MutationObserver(() => {
        wireHeaderLogo();
        wireFooterLogo();
        wireHamburgerMenu();
        wireNavCTAs();
      }).observe(el, { childList: true, subtree: true });
    };
    rewireHeaderFooter(headerEl);
    rewireHeaderFooter(footerEl);
  });
}
