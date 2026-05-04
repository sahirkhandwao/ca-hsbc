import { moveInstrumentation } from '../../scripts/scripts.js';
import CONSTANTS from '../../utils/constants.js';

/**
 * Quick Links Block — EDS vanilla JS
 * Renders a fixed right-side vertical strip (desktop) or bottom sticky bar (mobile)
 * with 5 shortcut links. Hides on downward scroll, shows on upward scroll.
 *
 * Block table structure (authored in UE / doc):
 * | quick-links |
 * | Icon Name | Label | URL | Target |
 * | location  | Locate branch | /customer-service/locate-a-branch | _blank |
 * … (one row per link)
 */

/* Inline SVG icons keyed by the id used in the source sprite */
const ICONS = {
  location: {
    viewBox: '0 0 18 22',
    path: '<path fill="currentColor" d="M15.75 20h-4.637a25 25 0 0 0 2.2-2.227c2.573-2.96 3.937-6.08 3.937-9.023a8.25 8.25 0 1 0-16.5 0c0 2.944 1.36 6.064 3.938 9.023A25 25 0 0 0 6.887 20H2.25a.75.75 0 1 0 0 1.5h13.5a.75.75 0 1 0 0-1.5M2.25 8.75a6.75 6.75 0 0 1 13.5 0c0 5.365-5.2 9.844-6.75 11.063-1.55-1.22-6.75-5.698-6.75-11.063m10.5 0a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0m-6 0a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0"/>',
  },
  'resume-journey': {
    viewBox: '0 0 32 32',
    path: '<path fill="currentColor" d="M26.262 5.399 9.98 2.524A1.5 1.5 0 0 0 8.242 3.74l-3.72 21.125a1.5 1.5 0 0 0 1.217 1.738l16.282 2.875q.131.024.264.023a1.5 1.5 0 0 0 1.474-1.24l3.719-21.125A1.5 1.5 0 0 0 26.262 5.4m.23 1.564-3.718 21.125a.5.5 0 0 1-.579.406L5.913 25.619a.5.5 0 0 1-.405-.579L9.227 3.915a.5.5 0 0 1 .578-.406l16.283 2.875a.5.5 0 0 1 .405.579m-3.474 2.433a.5.5 0 0 1-.579.405L12.064 7.97a.5.5 0 0 1 .174-.985l10.375 1.832a.5.5 0 0 1 .405.58m-.693 3.94a.5.5 0 0 1-.58.404l-10.37-1.831a.5.5 0 0 1 .174-.985l10.375 1.833a.5.5 0 0 1 .401.578m-5.875 3.023a.5.5 0 0 1-.58.405l-5.186-.916a.499.499 0 1 1 .174-.984l5.186.915a.5.5 0 0 1 .401.58z"/>',
  },
  'pay-premium': {
    viewBox: '0 0 32 32',
    path: '<g clip-path="url(#pay-premium_clip)"><path fill="currentColor" d="M28.791 17.633a3.06 3.06 0 0 0-2.655-.53l-5.23 1.203A3.5 3.5 0 0 0 17.5 14h-6.257a3.98 3.98 0 0 0-2.83 1.171L5.587 18H2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h13q.123 0 .242-.03l8-2a1 1 0 0 0 .15-.05l4.858-2.068.055-.024a3.074 3.074 0 0 0 .491-5.195zM2 20h3v5H2zm25.429 1.026-4.75 2.023L14.875 25H7v-5.586l2.829-2.828A1.98 1.98 0 0 1 11.242 16H17.5a1.5 1.5 0 1 1 0 3H14a1 1 0 0 0 0 2h4q.113 0 .224-.025l8.375-1.926.038-.01a1.075 1.075 0 0 1 .788 1.987zM20.5 12q.371 0 .738-.06a4.5 4.5 0 1 0 3.527-5.875A4.5 4.5 0 1 0 20.5 12m7.5-1.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0M20.5 5a2.5 2.5 0 0 1 2.406 1.826 4.5 4.5 0 0 0-1.875 3.117A2.5 2.5 0 1 1 20.5 5"/></g><defs><clipPath id="pay-premium_clip"><path fill="#fff" d="M0 0h32v32H0z"/></clipPath></defs>',
  },
  contact: {
    viewBox: '0 0 19 19',
    path: '<path fill="currentColor" d="M11.275 1.556a.75.75 0 0 1 .92-.53 8.08 8.08 0 0 1 5.78 5.78.751.751 0 0 1-1.182.789.75.75 0 0 1-.268-.402 6.6 6.6 0 0 0-4.718-4.718.75.75 0 0 1-.532-.92m-.218 3.919c1.293.345 2.123 1.175 2.468 2.468a.75.75 0 1 0 1.45-.387c-.48-1.796-1.735-3.05-3.53-3.53a.75.75 0 0 0-.388 1.449m7.682 8.939A5.274 5.274 0 0 1 13.5 19C6.056 19 0 12.944 0 5.5A5.274 5.274 0 0 1 4.586.26a1.5 1.5 0 0 1 1.558.893l1.98 4.42v.011A1.5 1.5 0 0 1 8.005 7l-.053.072L6 9.386c.702 1.427 2.195 2.906 3.64 3.61l2.282-1.941a1.501 1.501 0 0 1 1.492-.184l.013.005 4.416 1.98a1.5 1.5 0 0 1 .896 1.558m-1.489-.188h-.01l-4.407-1.973-2.282 1.941a1 1 0 0 1-.07.053 1.5 1.5 0 0 1-1.476.107c-1.756-.849-3.507-2.586-4.356-4.323a1.5 1.5 0 0 1 .094-1.472 1 1 0 0 1 .053-.072L6.75 6.17 4.781 1.764v-.011A3.77 3.77 0 0 0 1.5 5.5a12.013 12.013 0 0 0 12 12 3.77 3.77 0 0 0 3.75-3.275z"/>',
  },
  calculator: {
    viewBox: '0 0 32 32',
    path: '<path fill="currentColor" d="M22 7.5H10a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V8a.5.5 0 0 0-.5-.5m-.5 6h-11v-5h11zm3.5-10H7A1.5 1.5 0 0 0 5.5 5v22A1.5 1.5 0 0 0 7 28.5h18a1.5 1.5 0 0 0 1.5-1.5V5A1.5 1.5 0 0 0 25 3.5m.5 23.5a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 .5-.5h18a.5.5 0 0 1 .5.5zM12 18.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-10 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>',
  },
};

/** Default links used when no table rows are provided */
const DEFAULT_LINKS = [
  {
    icon: 'location', label: 'Locate branch', href: '/customer-service/locate-a-branch', target: '_blank',
  },
  {
    icon: 'resume-journey', label: 'Resume journey', href: 'https://buyonlineinsurance.canarahsbclife.com/resume-journey', target: '_blank',
  },
  {
    icon: 'pay-premium', label: 'Pay Premium', href: 'https://customer.canarahsbclife.com/PremiumPayment', target: '_blank',
  },
  {
    icon: 'contact', label: 'Contact us', href: '/customer-service/contact-details', target: '_blank',
  },
  {
    icon: 'calculator', label: 'Calculator', href: CONSTANTS.prodDomain + '/tools-and-calculators', target: '_blank',
  },
];

function buildIcon(id) {
  const icon = ICONS[id] || ICONS.calculator;
  return `<svg class="quick-links-icon" aria-hidden="true" viewBox="${icon.viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">${icon.path}</svg>`;
}

function parseLinks(block) {
  const links = [];
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return; // skip header row or empty
    const iconId = cells[0]?.textContent?.trim().toLowerCase() || '';
    const label = cells[1]?.textContent?.trim() || '';
    const href = cells[2]?.textContent?.trim() || '#';
    const target = cells[3]?.textContent?.trim() || '_blank';
    if (iconId && label) {
      links.push({
        icon: iconId, label, href, target, row,
      });
    }
  });
  return links;
}

export default function decorate(block) {
  const links = parseLinks(block);
  const finalLinks = links.length > 0 ? links : DEFAULT_LINKS;
  block.innerHTML = '';

  // Build inner wrapper
  const inner = document.createElement('div');
  inner.className = 'quick-links-inner';

  finalLinks.forEach((link, i) => {
    if (i > 0) {
      const divider = document.createElement('span');
      divider.className = 'quick-links-divider';
      inner.appendChild(divider);
    }

    const a = document.createElement('a');
    a.href = link.href;
    a.target = link.target;
    a.rel = 'noopener noreferrer';
    a.className = 'quick-links-link';
    a.setAttribute('data-link-text', link.label);

    // Apply Universal Editor instrumentation if row exists
    if (link.row) moveInstrumentation(link.row, a);

    a.innerHTML = `
      <div class="quick-links-wrapper">
        ${buildIcon(link.icon)}
        <span class="quick-links-label">${link.label}</span>
      </div>
    `;
    inner.appendChild(a);
  });

  block.appendChild(inner);

  // Scroll-hide behaviour
  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        if (currentY > lastScrollY && currentY > 200) {
          // scrolling down — hide
          inner.classList.add('quick-links-hidden');
        } else {
          // scrolling up — show
          inner.classList.remove('quick-links-hidden');
        }
        lastScrollY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}
