/**
 * analytics.js — EDS Analytics module for ca-hsbc
 *
 * Replicates all dataLayer events observed on
 * https://www.canarahsbclife.com/blog/life-insurance
 *
 * Events implemented:
 *   - Landed            — page load (fires once, immediately)
 *   - buttonClick       — Load More button, Popular Search links, Nav CTA clicks, Category filter
 *   - LogoClick         — header and footer logo
 *   - enter_search_autosuggestions — search result suggestion click
 *   - blog_card_click   — article card click (blog listing cards)
 *   - lead_form_start   — first interaction with lead form
 *   - lead_form_submit  — successful lead form submission
 *
 * GTM container GTM-5G46XDD is already loaded via delayed.js.
 * This module fires events into window.dataLayer directly.
 *
 * Usage: imported by scripts/analytics.js and called from
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
  const path = new URL(href).pathname.replace(/^\//, '');
  const parts = path.split('/');
  // /blog/life-insurance → "blog"
  if (parts[0] === 'blog') return parts[0];
  if (parts[0]) return parts[0];
  return 'Home';
}

/** Derive PageName from URL — second path segment, or first if no sub-path */
function getPageName(href = window.location.href) {
  const path = new URL(href).pathname.replace(/^\//, '');
  const parts = path.split('/');
  if (parts[0] === 'blog' && parts[1]) return parts[1]; // blog/life-insurance → life-insurance
  return parts[parts.length - 1] || 'home';
}

/** Derive PageSubCategory — third segment */
function getPageSubCategory(href = window.location.href) {
  const path = new URL(href).pathname.replace(/^\//, '');
  const parts = path.split('/');
  return parts.length > 2 ? parts[2] : '';
}

/** Derive PageType from page structure */
function getPageType() {
  const path = window.location.pathname;
  const parts = path.replace(/^\//, '').split('/');
  if (parts[0] === 'blog') {
    if (parts.length >= 3 && parts[2]) return 'Blog Detail Page';
    return 'Blog Listing Page';
  }
  return 'Content Page';
}

/** UserType: repeat if clientID localStorage is set */
function getUserType() {
  try {
    return localStorage.getItem('clientID') ? 'repeat' : 'new';
  } catch (e) {
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
export function trackLeadFormSubmit({ name = '', email = '', mobile = '', leadId = '', productName = '', productCategory = '' } = {}) {
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
// Auto-wiring: attach event listeners to block elements
// ---------------------------------------------------------------------------

/** Wire Popular Searches block */
function wirePopularSearches() {
  document.querySelectorAll('.popular-searches a').forEach((link) => {
    link.addEventListener('click', () => {
      trackButtonClick(link.textContent.trim(), 'Popular Search');
    });
  });
}

/** Wire Load More buttons (blog-cards block) */
function wireLoadMore() {
  document.querySelectorAll('.blog-cards .load-more-btn, .blog-cards button').forEach((btn) => {
    if (btn.textContent.trim().toLowerCase().includes('load') || btn.dataset.action === 'load-more') {
      btn.addEventListener('click', () => {
        const h1 = document.querySelector('h1, .default-content-wrapper h2');
        trackButtonClick('Load More', h1 ? h1.textContent.trim() : '');
      });
    }
  });
}

/** Wire Category Links block */
function wireCategoryLinks() {
  document.querySelectorAll('.category-links a').forEach((link) => {
    link.addEventListener('click', () => {
      trackButtonClick(link.textContent.trim(), 'Category Filter');
    });
  });
}

/** Wire Blog Search — suggestion clicks */
function wireBlogSearch() {
  // Re-wire when suggestions are rendered (they're dynamic)
  const container = document.querySelector('.blog-search');
  if (!container) return;

  const observer = new MutationObserver(() => {
    container.querySelectorAll('[class*=suggestion] a, [class*=result] a, [class*=autocomplete] a').forEach((link) => {
      if (link.dataset.analyticsWired) return;
      link.dataset.analyticsWired = '1';
      link.addEventListener('click', () => {
        trackSearchSuggestionClick(link.textContent.trim(), 'Blog Search');
      });
    });
  });
  observer.observe(container, { childList: true, subtree: true });

  // Search form submit
  const form = container.querySelector('form');
  const input = container.querySelector('input');
  if (form) {
    form.addEventListener('submit', (e) => {
      trackButtonClick(input?.value?.trim() || 'Search', 'Blog Search');
    });
  }
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        trackButtonClick(input.value.trim() || 'Search', 'Blog Search');
      }
    });
  }
}

/** Wire Blog Cards — article card clicks */
function wireBlogCards() {
  document.querySelectorAll('.blog-cards .blog-card-link, .blog-cards a[href*="/blog/"]').forEach((link) => {
    link.addEventListener('click', () => {
      const card = link.closest('[class*=card]') || link.closest('li') || link.parentElement;
      const title = card?.querySelector('h2, h3, [class*=title], [class*=heading]')?.textContent?.trim()
        || link.textContent.trim();
      const category = card?.querySelector('[class*=category], [class*=tag]')?.textContent?.trim() || '';
      const date = card?.querySelector('time, [class*=date]')?.textContent?.trim() || '';
      trackBlogCardClick(title, category, date);
    });
  });
}

/** Wire Header logo */
function wireHeaderLogo() {
  const headerLogo = document.querySelector('header a[href="/"], header .logo a, header img[class*=logo]')?.closest('a');
  if (headerLogo) {
    headerLogo.addEventListener('click', () => trackLogoClick('Header_Logo'));
  }
}

/** Wire Footer logo */
function wireFooterLogo() {
  const footerLogo = document.querySelector('footer a[href="/"], footer .logo a, footer img[class*=logo]')?.closest('a');
  if (footerLogo) {
    footerLogo.addEventListener('click', () => trackLogoClick('Footer_Logo'));
  }
}

/** Wire Lead Form interactions */
function wireLeadForm() {
  const form = document.querySelector('.lead-form .lf-form');
  if (!form) return;

  let started = false;
  form.addEventListener('input', () => {
    if (!started) {
      started = true;
      const config = {};
      form.querySelectorAll('input[type=hidden]').forEach((i) => { config[i.name] = i.value; });
      trackLeadFormStart('blog-lead-form');
    }
  }, { passive: true });

  // Submission is tracked from lead-form.js via a custom event dispatched on success
  document.addEventListener('lead-form:submitted', (e) => {
    const { name, email, mobile, leadId, productName, productCategory } = e.detail || {};
    trackLeadFormSubmit({ name, email, mobile, leadId, productName, productCategory });
  });
}

// ---------------------------------------------------------------------------
// init — called from scripts/analytics.js after DOM is ready
// ---------------------------------------------------------------------------
export function initAnalytics() {
  // Fire Landed immediately
  trackLanded();

  // Wire all block-level tracking
  // Run after blocks are decorated (use requestAnimationFrame to yield)
  requestAnimationFrame(() => {
    wirePopularSearches();
    wireLoadMore();
    wireCategoryLinks();
    wireBlogSearch();
    wireBlogCards();
    wireHeaderLogo();
    wireFooterLogo();
    wireLeadForm();

    // Re-wire after dynamic content loads (e.g. load-more appending cards)
    const main = document.querySelector('main');
    if (main) {
      const mo = new MutationObserver(() => {
        wireBlogCards();
        wireLoadMore();
        wirePopularSearches();
      });
      mo.observe(main, { childList: true, subtree: true });
    }
  });
}
