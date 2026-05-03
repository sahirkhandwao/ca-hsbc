/**
 * Blog Cards Block
 *
 * Fetches blog articles from the Canara HSBC blog listing API and renders
 * a paginated 3-column card grid.
 *
 * API endpoint:
 *   https://www.canarahsbclife.com/bin/chli/bloglisting.json?blogName=<blogName>
 *
 * CORS NOTE: This fetch will only succeed when the page is served from
 * canarahsbclife.com (production) or via a configured CORS proxy in local dev.
 * In EDS local dev you may need to use a CORS proxy or browser extension to
 * work around cross-origin restrictions.
 *
 * Block authoring (optional rows in the block table):
 *   Row 1: blogName      — category slug, e.g. "life-insurance" (default)
 *   Row 2: initialCount  — number of cards shown on first paint (default 6)
 */

import CONSTANTS from "../../utils/constants.js";

const API_BASE = CONSTANTS.devDomain + '/bin/chli/bloglisting.json';
const SITE_BASE = CONSTANTS.prodDomain;
const CARDS_PER_LOAD = 6;

/**
 * Converts a DAM asset path to a fully qualified URL.
 * @param {string} path - e.g. /content/dam/chli/images/...
 * @returns {string}
 */
function buildImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${SITE_BASE}${path}`;
}

/**
 * Converts a JCR content path to a public page URL.
 * @param {string} resourcePath - e.g. /content/chli/in/en/blog/...
 * @returns {string}
 */
function buildPageUrl(resourcePath) {
  if (!resourcePath) return '#';
  return resourcePath.replace('/content/chli/in/en', SITE_BASE);
}

/**
 * Formats an ISO date string as "1 Apr '26".
 * @param {string} dateStr - e.g. "2026-04-01"
 * @returns {string}
 */
function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const month = d.toLocaleString('en-GB', { month: 'short' });
    const year = String(d.getFullYear()).slice(2);
    return `${day} ${month} '${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Renders a single blog card as an HTML string.
 * @param {Object} item - Blog data object from the API
 * @returns {string} HTML string for an <li> card element
 */
function renderCard(item) {
  const pageUrl = buildPageUrl(item.resourcePath);
  const imgUrl = buildImageUrl(item.imagePath);
  const dateStr = formatDate(item.date);
  const altText = item.imageAltText || item.title || '';
  const category = item.blogCategory || '';
  const views = item.views || '0';
  const duration = item.duration || '0';
  const title = item.title || '';
  const desc = item.pageDesc || '';

  return `
    <li class="blog-cards-card">
      <a class="blog-cards-card-link" href="${pageUrl}" title="${title}">
        <div class="blog-cards-card-image">
          <img src="${imgUrl}" alt="${altText}" loading="lazy" width="400" height="225" />
          <span class="blog-cards-card-tag">${category}</span>
        </div>
        <div class="blog-cards-card-body">
          <div class="blog-cards-meta">
            <span class="blog-cards-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>${dateStr}</span>
            </span>
            <span class="blog-cards-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>${views} Views</span>
            </span>
            <span class="blog-cards-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>${duration} minute read</span>
            </span>
          </div>
          <h3>${title}</h3>
          <p>${desc}</p>
          <span class="blog-cards-read-more">Read More &#8594;</span>
        </div>
      </a>
    </li>
  `;
}

/**
 * Main block decorator.
 * @param {HTMLElement} block - The block element provided by EDS
 */
export default async function decorate(block) {
  // --- Read optional config from block rows ---
  const rows = [...block.children];
  const blogName = rows[0]?.textContent?.trim() || 'life-insurance';
  const initialCount = parseInt(rows[1]?.textContent?.trim() || '6', 10) || 6;

  // Show loading state while fetching
  block.innerHTML = '<div class="blog-cards-loading">Loading articles...</div>';

  // --- Fetch blog data ---
  let allCards = [];
  try {
    const resp = await fetch(`${API_BASE}?blogName=${encodeURIComponent(blogName)}&lang=en&_cb=${Date.now()}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    allCards = await resp.json();
    if (!Array.isArray(allCards)) throw new Error('Unexpected response format');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[blog-cards] Failed to load articles:', e);
    block.innerHTML = '<div class="blog-cards-error">Unable to load articles. Please try again later.</div>';
    return;
  }

  // --- Build grid ---
  const grid = document.createElement('ul');
  grid.className = 'blog-cards-grid';

  // Track how many cards have been rendered
  let shown = 0;

  /**
   * Appends the next batch of CARDS_PER_LOAD cards to the grid.
   */
  function renderMore() {
    const batch = allCards.slice(shown, shown + CARDS_PER_LOAD);
    batch.forEach((item) => {
      grid.insertAdjacentHTML('beforeend', renderCard(item));
    });
    shown += batch.length;

    // Hide the Load More button when all cards are displayed
    if (shown >= allCards.length) {
      loadMoreWrap.hidden = true; // eslint-disable-line no-use-before-define
    }
  }

  // --- Build Load More button ---
  const loadMoreWrap = document.createElement('div');
  loadMoreWrap.className = 'blog-cards-loadmore-wrap';

  const loadMoreBtn = document.createElement('button');
  loadMoreBtn.type = 'button';
  loadMoreBtn.className = 'blog-cards-loadmore-btn';
  loadMoreBtn.textContent = 'Load More';
  loadMoreBtn.addEventListener('click', renderMore);

  loadMoreWrap.append(loadMoreBtn);

  // --- Initial render ---
  const firstBatch = allCards.slice(0, initialCount);
  firstBatch.forEach((item) => {
    grid.insertAdjacentHTML('beforeend', renderCard(item));
  });
  shown = firstBatch.length;

  // --- Mount into DOM ---
  block.innerHTML = '';
  block.append(grid);

  // Only show Load More if there are more cards beyond the initial batch
  if (shown < allCards.length) {
    block.append(loadMoreWrap);
  }
}
