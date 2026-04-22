import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

export default async function decorate(block) {
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  // Define nav sections
  const brand = document.createElement('div');
  brand.classList.add('nav-brand');
  brand.innerHTML = `
    <a href="/" aria-label="Canara HSBC Life Insurance">
      <img src="/icons/canara-hsbc-life-insurance-logo.svg" alt="Canara HSBC Life Insurance" class="logo">
    </a>
  `;

  const navDropdowns = [
    {
      label: 'Term Insurance',
      href: '/term-insurance',
      layout: 'detail',
      columns: [
        {
          items: [
            {
              icon: 'shield',
              title: '1 Crore Term Insurance',
              badge: 'Rs. 21/day',
              desc: 'Secure your family with a <span class="nav-mega-detail-link-accent">1 Crore</span> term insurance',
              href: '/term-insurance/1-crore',
            },
            {
              icon: 'tax',
              title: 'Term Insurance Tax Benefits',
              desc: 'Double the benefit. Protect your loved ones and save on tax',
              href: '/term-insurance/tax-benefits',
            },
            {
              icon: 'calculator',
              title: 'Term Insurance Calculator',
              desc: 'Know how much life cover you need with our Term calculator',
              href: '/term-insurance/calculator',
            },
          ],
        },
        {
          items: [
            {
              icon: 'smart',
              title: 'iSelect Smart360 Term Plan',
              desc: 'An all-in-one plan offering comprehensive coverage for you',
              href: '/term-insurance/iselect-smart360',
            },
            {
              icon: 'shield',
              title: 'Young Term Plan',
              badge: 'Rs. 1 Cr Life cover at @ Rs. 21/day',
              desc: 'Start Young, Pay Less, Stay Secure with Young Term Plan',
              href: '/term-insurance/young-term-plan',
            },
            {
              icon: 'return',
              title: 'Term Plan with Return Of Premium',
              desc: 'Get your premiums back on surviving the entire policy',
              href: '/term-insurance/return-of-premium',
            },
          ],
        },
        {
          promo: {
            eyebrow: 'Big Protection',
            headline: 'Small Price',
            price: '<span class="nav-promo-amount"><span class="nav-promo-rupee">&#8377;</span>1 Cr</span>',
            subtitle: 'Life Cover @ <span class="nav-promo-strong">&#8377;21<sup>*</sup>/day</span>',
            cta: { label: 'Start Now', href: '/term-insurance/buy-now' },
          },
        },
      ],
    },
    {
      label: 'Investment Plans',
      href: '/investment-plans',
      layout: 'detail',
      columns: [
        {
          items: [
            {
              icon: 'chart',
              title: 'ULIP Plan',
              desc: 'Get life cover and market-linked benefits with ULIP',
              href: '/investment-plans/ulip',
            },
            {
              icon: 'piggy',
              title: 'Savings Plan',
              desc: 'Get life cover + guaranteed benefits with our savings plan',
              href: '/saving-plans',
            },
            {
              icon: 'retirement',
              title: 'Retirement Plan',
              desc: 'Plan for your golden age. Get the financial comfort you need',
              href: '/retirement-plans',
            },
            {
              icon: 'child',
              title: 'Child Insurance Plan',
              desc: '',
              href: '/child-insurance-plans',
            },
          ],
        },
        {
          items: [
            {
              icon: 'smart',
              title: 'Promise4Wealth',
              desc: 'Life cover + Market-linked growth with flexible benefits.',
              href: '/investment-plans/promise4wealth',
            },
            {
              icon: 'chart',
              title: 'Promise4Growth Plus',
              badge: 'Starts @ Rs.2k /month',
              desc: 'Get complete control over your savings & insurance needs.',
              href: '/investment-plans/promise4growth-plus',
            },
            {
              icon: 'piggy',
              title: 'iSelect Guaranteed Future Plus',
              desc: 'Get guaranteed income from 2nd policy year with this plan',
              href: '/investment-plans/iselect-guaranteed-future-plus',
            },
            {
              icon: 'calculator',
              title: 'Investment Calculator',
              desc: '',
              href: '/investment-plans/calculator',
            },
          ],
        },
        {
          promo: {
            variant: 'gold',
            disclaimer: 'IN THIS POLICY, THE INVESTMENT RISK IN INVESTMENT PORTFOLIO IS BORNE BY THE POLICYHOLDER',
            headline: 'BIG DREAMS NEED STRONG FINANCIAL FOUNDATIONS',
            intro: 'Introducing',
            highlight: 'Promise4Wealth',
            subline: 'with BSE 500 Enhanced Value 50 Fund',
            tagline: 'Get Life Cover + Market Linked Returns',
            cta: { label: 'Start Planning Now', href: '/investment-plans/promise4wealth' },
          },
        },
      ],
    },
    {
      label: 'All Plans',
      href: '/all-plans',
      layout: 'grouped',
      columns: [
        {
          sections: [
            {
              icon: 'shield',
              title: 'Term Insurance',
              href: '/term-insurance',
              links: [
                { label: 'Young Term Plan', href: '/term-insurance/young-term-plan', badge: 'Rs. 1 Cr Life cover at @ Rs. 21/day' },
                { label: 'iSelect Smart360 Term Plan', href: '/term-insurance/iselect-smart360' },
                { label: 'Promise2Protect', href: '/term-insurance/promise2protect' },
              ],
            },
            {
              icon: 'chart',
              title: 'Unit Linked Insurance Plans',
              href: '/investment-plans/ulip',
              links: [
                { label: 'Promise4Wealth', href: '/investment-plans/promise4wealth', tag: 'New' },
                { label: 'Promise4Growth Plus', href: '/investment-plans/promise4growth-plus', badge: 'Starts @ Rs.2k /month' },
                { label: 'SecureInvest', href: '/investment-plans/secureinvest' },
              ],
            },
            {
              icon: 'tax',
              title: 'Tax Saving Plan',
              href: '/tax-saving-plan',
              links: [
                { label: 'Young Term Plan', href: '/tax-saving-plan/young-term-plan', badge: 'Rs. 1 Cr Life cover at @ Rs. 21/day' },
                { label: 'iSelect Smart360 Term Plan', href: '/tax-saving-plan/iselect-smart360' },
                { label: 'iSelect Guaranteed Future', href: '/tax-saving-plan/iselect-guaranteed-future' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              icon: 'retirement',
              title: 'Retirement Plans',
              href: '/retirement-plans',
              links: [
                { label: 'Legacy Builder', href: '/retirement-plans/legacy-builder', tag: 'New' },
                { label: 'iSelect Guaranteed Future Plus', href: '/retirement-plans/iselect-guaranteed-future-plus' },
                { label: 'EZ Pension', href: '/retirement-plans/ez-pension' },
              ],
            },
            {
              icon: 'piggy',
              title: 'Saving Plans',
              href: '/saving-plans',
              links: [
                { label: 'IncomeNow', href: '/saving-plans/incomenow' },
                { label: 'Promise4Life', href: '/saving-plans/promise4life' },
              ],
            },
            {
              icon: 'child',
              title: 'Child Insurance Plans',
              href: '/child-insurance-plans',
              links: [
                { label: 'iSelect Guaranteed Future Plus', href: '/child-insurance-plans/iselect-guaranteed-future-plus' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              icon: 'rider',
              title: 'Insurance Riders',
              href: '/insurance-riders',
              showViewAll: false,
              links: [
                { label: 'Accidental Benefit Rider (Linked)', href: '/insurance-riders/accidental-benefit' },
                { label: 'Linked Critical Illness Benefit Rider', href: '/insurance-riders/critical-illness' },
                { label: 'Group Critical Illness Rider', href: '/insurance-riders/group-critical-illness', tag: 'New' },
              ],
            },
            {
              icon: 'gift',
              title: 'GIFT City',
              href: '/gift-city',
              showViewAll: false,
              links: [
                { label: 'Future Dollar Investment', href: '/gift-city/future-dollar-investment' },
              ],
            },
            {
              icon: 'online',
              title: 'Online Life Insurance',
              href: '/online-life-insurance',
              showViewAll: false,
              links: [
                { label: 'Promise4Wealth', href: '/online-life-insurance/promise4wealth', tag: 'New' },
                { label: 'Promise4Growth Plus', href: '/online-life-insurance/promise4growth-plus', tag: 'New', badge: 'Starts @ Rs.2k /month' },
                { label: 'Young Term Plan', href: '/online-life-insurance/young-term-plan', badge: 'Rs. 1 Cr Life cover at @ Rs. 21/day' },
                { label: 'iSelect Guaranteed Future Plus', href: '/online-life-insurance/iselect-guaranteed-future-plus' },
                { label: 'iSelect Smart360 Term Plan', href: '/online-life-insurance/iselect-smart360' },
              ],
            },
            {
              icon: 'group',
              title: 'Group Insurance Plans',
              href: '/group-insurance-plans',
              showViewAll: false,
              links: [
                { label: 'Group Secure Plus', href: '/group-insurance-plans/group-secure-plus' },
                { label: 'Group Secure Plan', href: '/group-insurance-plans/group-secure-plan' },
                { label: 'Group Term Edge Plan', href: '/group-insurance-plans/group-term-edge-plan' },
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'Customer Service',
      href: '/customer-service',
      layout: 'grouped',
      columns: [
        {
          sections: [
            {
              icon: 'managePolicy',
              title: 'Manage Policy',
              href: '/customer-service/manage-policy',
              links: [
                { label: 'Pay Premium', href: '/customer-service/pay-premium' },
                { label: 'Premium Receipt', href: '/customer-service/premium-receipt' },
                { label: 'Update KYC', href: '/customer-service/update-kyc' },
                { label: 'Duplicate Policy Pack', href: '/customer-service/duplicate-policy-pack' },
                { label: 'Latest NAV', href: '/customer-service/latest-nav' },
                { label: 'Service Booklet & E-statements', href: '/customer-service/service-booklet' },
                { label: 'ENACH Registration', href: '/customer-service/enach-registration' },
              ],
            },
            {
              icon: 'claims',
              title: 'Claims',
              href: '/customer-service/claims',
              links: [
                { label: 'Register Claim', href: '/customer-service/claims/register' },
                { label: 'Claim Form', href: '/customer-service/claims/form' },
                { label: 'Claim Status', href: '/customer-service/claims/status' },
                { label: 'Get Claim Assistance', href: '/customer-service/claims/assistance' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              icon: 'others',
              title: 'Others',
              href: '/customer-service/others',
              showViewAll: false,
              links: [
                { label: 'Track Application', href: '/customer-service/track-application' },
                { label: 'Contact Us', href: '/customer-service/contact-us' },
              ],
            },
            {
              icon: 'unclaimed',
              title: 'Unclaimed Policies',
              href: '/customer-service/unclaimed-policies',
              showViewAll: false,
              links: [
                { label: 'Unclaimed Amount', href: '/customer-service/unclaimed-amount' },
                { label: 'Check unclaimed amount moved to Senior Citizen Account', href: '/customer-service/senior-citizen' },
              ],
            },
            {
              icon: 'grievance',
              title: 'Grievance Redressal',
              href: '/customer-service/grievance-redressal',
              showViewAll: false,
              links: [],
            },
          ],
        },
        {
          promo: {
            variant: 'lapse',
            headline: "Don't Let the <br>Protection Lapse",
            description: "Revive your Life Insurance policy today and safeguard your family's future.",
            cta: { label: 'Pay Your Premium Now', href: '/customer-service/pay-premium' },
            footer: 'T&amp;C apply',
          },
        },
      ],
    },
    {
      label: 'Investor Relations',
      href: '/investor-relations',
      layout: 'grouped',
      columns: [
        {
          sections: [
            {
              icon: 'aboutCompany',
              title: 'About the Company',
              href: '/investor-relations/about-the-company',
              showViewAll: false,
              links: [
                { label: 'Board of Directors', href: '/investor-relations/board-of-directors' },
                { label: 'Composition of the Board Committees', href: '/investor-relations/board-committees' },
              ],
            },
            {
              icon: 'offerDocuments',
              title: 'Offer Documents',
              href: '/investor-relations/offer-documents',
              showViewAll: false,
              links: [],
            },
          ],
        },
        {
          sections: [
            {
              icon: 'financials',
              title: 'Financials',
              href: '/investor-relations/financials',
              showViewAll: false,
              links: [
                { label: 'Financial Results', href: '/investor-relations/financial-results' },
                { label: 'Public Disclosure', href: '/investor-relations/public-disclosure' },
              ],
            },
            {
              icon: 'shareholders',
              title: 'Information to Shareholders',
              href: '/investor-relations/shareholders',
              showViewAll: false,
              links: [
                { label: 'Shareholder Meetings & Voting', href: '/investor-relations/shareholder-meetings' },
                { label: 'Shareholding & Governance Information', href: '/investor-relations/shareholding-governance' },
                { label: 'Other Disclosures', href: '/investor-relations/other-disclosures' },
              ],
            },
          ],
        },
        {
          sections: [
            {
              icon: 'policies',
              title: 'Policies and Code of Conduct',
              href: '/investor-relations/policies',
              showViewAll: false,
              links: [],
            },
            {
              icon: 'bulletin',
              title: 'Bulletin Board',
              href: '/investor-relations/bulletin-board',
              showViewAll: false,
              links: [],
            },
          ],
        },
      ],
    },
  ];

  const navIconSrc = {
    shield: '/icons/canara-sprite/life-cover.svg',
    chart: '/icons/canara-sprite/graph.svg',
    piggy: '/icons/canara-sprite/money.svg',
    retirement: '/icons/canara-sprite/retirement.svg',
    rider: '/icons/canara-sprite/respect-2.svg',
    gift: '/icons/canara-sprite/paper-money.svg',
    tax: '/icons/canara-sprite/tax-savings-1.svg',
    child: '/icons/canara-sprite/child-education.svg',
    online: '/icons/canara-sprite/pie-chart-document.svg',
    group: '/icons/canara-sprite/group-3.svg',
    support: '/icons/canara-sprite/contact.svg',
    calculator: '/icons/canara-sprite/calculator-bold.svg',
    return: '/icons/canara-sprite/return.svg',
    smart: '/icons/canara-sprite/financial-immunity.svg',
    managePolicy: '/icons/canara-sprite/note.svg',
    claims: '/icons/canara-sprite/hands-meet.svg',
    others: '/icons/canara-sprite/pending-requirement.svg',
    unclaimed: '/icons/canara-sprite/money.svg',
    grievance: '/icons/canara-sprite/grievance-redressal.svg',
    aboutCompany: '/icons/canara-sprite/contact-details.svg',
    financials: '/icons/canara-sprite/article.svg',
    policies: '/icons/canara-sprite/note.svg',
    offerDocuments: '/icons/canara-sprite/financial-immunity.svg',
    shareholders: '/icons/canara-sprite/article.svg',
    bulletin: '/icons/canara-sprite/check-claim-status.svg',
  };

  const renderNavLink = (link) => {
    const badge = link.badge ? `<span class="nav-mega-badge">${link.badge}</span>` : '';
    const tag = link.tag ? `<span class="nav-mega-tag">${link.tag}</span>` : '';
    return `<li><a href="${link.href}">${link.label}${tag}${badge}</a></li>`;
  };

  const renderSection = (sec) => {
    const iconSrc = navIconSrc[sec.icon];
    const iconHtml = iconSrc ? `<img src="${iconSrc}" alt="" loading="lazy">` : '';
    const showViewAll = sec.showViewAll !== false && sec.href;
    return `
      <section class="nav-mega-section">
        <div class="nav-mega-column-head">
          <div class="nav-mega-icon">${iconHtml}</div>
          <div class="nav-mega-title">${sec.title}</div>
        </div>
        <ul class="mega-links">
          ${sec.links.map(renderNavLink).join('')}
        </ul>
        ${showViewAll ? `<a class="nav-mega-viewall" href="${sec.href}">View All</a>` : ''}
      </section>
    `;
  };

  const renderColumn = (col) => `
    <li class="dropdown-item nav-mega-column">
      ${renderSection(col)}
    </li>
  `;

  const renderGroupedColumn = (col) => {
    if (col.promo) {
      return `<li class="dropdown-item nav-mega-detail-column nav-mega-detail-column--promo">${renderPromoBody(col.promo)}</li>`;
    }
    return `
      <li class="dropdown-item nav-mega-detail-column">
        ${(col.sections || []).map(renderSection).join('')}
      </li>
    `;
  };

  const renderDetailEntry = (it) => {
    const iconSrc = navIconSrc[it.icon];
    const iconHtml = iconSrc ? `<img src="${iconSrc}" alt="" loading="lazy">` : '';
    const badge = it.badge ? `<span class="nav-mega-badge">${it.badge}</span>` : '';
    return `
      <a class="nav-mega-detail-link" href="${it.href}">
        <div class="nav-mega-detail-icon">${iconHtml}</div>
        <div class="nav-mega-detail-text">
          <div class="nav-mega-detail-title">${it.title}${badge}</div>
          <div class="nav-mega-detail-desc">${it.desc || ''}</div>
        </div>
      </a>
    `;
  };

  const renderPromoBody = (promo) => {
    if (promo.variant === 'gold') {
      return `
        <div class="nav-mega-promo nav-mega-promo--gold">
          ${promo.disclaimer ? `<p class="nav-mega-promo-disclaimer">${promo.disclaimer}</p>` : ''}
          <p class="nav-mega-promo-gold-headline">${promo.headline || ''}</p>
          <p class="nav-mega-promo-gold-intro">
            ${promo.intro || ''}
            ${promo.highlight ? `<span class="nav-mega-promo-gold-highlight">${promo.highlight}</span>` : ''}
          </p>
          ${promo.subline ? `<p class="nav-mega-promo-gold-subline">${promo.subline}</p>` : ''}
          ${promo.tagline ? `<p class="nav-mega-promo-gold-tagline">${promo.tagline}</p>` : ''}
          ${promo.cta ? `<a class="nav-mega-promo-gold-cta" href="${promo.cta.href}">${promo.cta.label}</a>` : ''}
        </div>
      `;
    }
    if (promo.variant === 'lapse') {
      return `
        <div class="nav-mega-promo nav-mega-promo--lapse">
          <p class="nav-mega-promo-lapse-headline">${promo.headline || ''}</p>
          <p class="nav-mega-promo-lapse-desc">${promo.description || ''}</p>
          ${promo.cta ? `<a class="nav-mega-promo-lapse-cta" href="${promo.cta.href}">${promo.cta.label}</a>` : ''}
          ${promo.footer ? `<p class="nav-mega-promo-lapse-footer">${promo.footer}</p>` : ''}
        </div>
      `;
    }
    return `
      <div class="nav-mega-promo">
        <div class="nav-mega-promo-head">
          <span class="nav-mega-promo-eyebrow">${promo.eyebrow || ''}</span>
          <span class="nav-mega-promo-headline">${promo.headline || ''}</span>
        </div>
        <div class="nav-mega-promo-price">
          ${promo.price || ''}
          <span class="nav-mega-promo-sub">${promo.subtitle || ''}</span>
        </div>
        ${promo.cta ? `<a class="nav-mega-promo-cta" href="${promo.cta.href}">${promo.cta.label}</a>` : ''}
      </div>
    `;
  };

  const renderDetailColumn = (col) => {
    if (col.promo) {
      return `<li class="dropdown-item nav-mega-detail-column nav-mega-detail-column--promo">${renderPromoBody(col.promo)}</li>`;
    }
    return `
      <li class="dropdown-item nav-mega-detail-column">
        ${(col.items || []).map(renderDetailEntry).join('')}
      </li>
    `;
  };

  const renderDetailLayout = (item) => `
    <div class="nav-mega nav-mega--detail">
      <ul class="nav-mega-detail-grid" data-column-count="3">
        ${item.columns.map(renderDetailColumn).join('')}
      </ul>
    </div>
  `;

  const renderColumnsLayout = (item) => {
    const count = Math.min(Math.max(item.columns.length, 1), 3);
    return `
      <div class="nav-mega">
        <ul class="nav-mega-columns" data-column-count="${count}">
          ${item.columns.map(renderColumn).join('')}
        </ul>
      </div>
    `;
  };

  const renderGroupedLayout = (item) => {
    const count = Math.min(Math.max(item.columns.length, 1), 3);
    return `
      <div class="nav-mega nav-mega--detail">
        <ul class="nav-mega-detail-grid" data-column-count="${count}">
          ${item.columns.map(renderGroupedColumn).join('')}
        </ul>
      </div>
    `;
  };

  const renderNavItem = (item, index) => {
    const toggleId = `navbarDropdownMenuLink${index}`;
    const dropdownId = `navbarDropdownMenu${index}`;
    const hasDropdown = item.columns?.length || item.items?.length;
    if (!hasDropdown) {
      return `<li class="nav-item"><a class="nav-link" href="${item.href}">${item.label}</a></li>`;
    }
    let body;
    if (item.layout === 'detail') body = renderDetailLayout(item);
    else if (item.layout === 'grouped') body = renderGroupedLayout(item);
    else body = renderColumnsLayout(item);
    return `
      <li class="nav-item nav-item--dropdown">
        <a class="nav-link nav-dropdown-toggle" id="${toggleId}" href="${item.href}"
          aria-expanded="false" aria-haspopup="true" aria-controls="${dropdownId}"
          data-dropdown-index="${index}">
          ${item.label}
        </a>
        <div class="nav-dropdown" id="${dropdownId}" role="menu" aria-labelledby="${toggleId}">
          ${body}
        </div>
      </li>
    `;
  };

  const sections = document.createElement('div');
  sections.classList.add('nav-sections');
  sections.innerHTML = `
    <ul class="nav-list">
      ${navDropdowns.map(renderNavItem).join('')}
    </ul>
  `;

  const tools = document.createElement('div');
  tools.classList.add('nav-tools');
  tools.innerHTML = `
    <div class="tool-item search">
      <img src="/icons/search.svg" alt="Search">
    </div>
    <div class="tool-item notification">
      <img src="/icons/bell.svg" alt="Notifications">
      <span class="badge">1</span>
    </div>
    <div class="tool-item login">
      <a href="/login">
        <img src="/icons/user.svg" alt="Login">
        <span>Login</span>
      </a>
    </div>
    <div class="tool-item hamburger">
      <button type="button" class="nav-panel-toggle" aria-label="Open menu" aria-controls="nav-panel" aria-expanded="false">
        <img src="/icons/hamburger-blue.svg" alt="">
      </button>
    </div>
  `;

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation">
      <img src="/icons/hamburger.svg" alt="Menu">
    </button>
  `;

  const panelItems = [
    {
      label: 'About Us',
      href: '/about-us',
      children: [
        { label: 'About Canara HSBC Life Insurance', href: '/about-us' },
        { label: 'Vision & Values', href: '/about-us/vision-values' },
        { label: 'Leadership Team', href: '/about-us/leadership' },
        { label: 'Corporate Social Responsibility', href: '/about-us/csr' },
        { label: 'Awards & Recognition', href: '/about-us/awards' },
        { label: 'GARV', href: '/about-us/garv' },
      ],
    },
    {
      label: 'Blogs',
      href: '/blog',
      badge: 'New Articles',
      children: [
        { label: 'Tax Saving Plans', href: '/blog/tax-saving' },
        { label: 'Child Plan', href: '/blog/child-plan' },
        { label: 'Life Insurance', href: '/blog/life-insurance' },
        { label: 'Term Insurance', href: '/blog/term-insurance' },
        { label: 'Savings Plan', href: '/blog/savings-plan' },
        { label: 'Retirement Plan', href: '/blog/retirement-plan' },
        { label: 'ULIP', href: '/blog/ulip' },
      ],
    },
    {
      label: 'Tools & Calculators',
      href: '/tools-calculators',
      children: [
        { label: 'Life Insurance Calculator', href: '/tools-calculators/life-insurance-calculator' },
        { label: 'Retirement Calculator', href: '/tools-calculators/retirement-calculator' },
        { label: 'Term Insurance Calculator', href: '/tools-calculators/term-insurance-calculator' },
      ],
    },
    { label: 'Bima Bharosa', href: '/bima-bharosa' },
    {
      label: 'Careers',
      href: '/careers',
      children: [
        { label: 'Current Openings', href: '/careers/openings' },
        { label: 'Life at Canara HSBC', href: '/careers/life-at' },
      ],
    },
    {
      label: 'Media Center',
      href: '/media-center',
      children: [
        { label: 'Press Releases', href: '/media-center/press-releases' },
        { label: 'News', href: '/media-center/news' },
      ],
    },
  ];

  const caretSvg = `
    <svg class="nav-panel-caret" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 29a13 13 0 1 1 13-13 13.014 13.014 0 0 1-13 13m0-24a11 11 0 1 0 11 11A11.01 11.01 0 0 0 16 5m5.708 9.708a1 1 0 0 0-1.415-1.415L16 17.586l-4.292-4.293a1 1 0 0 0-1.415 1.415l5 5a1 1 0 0 0 1.415 0z" fill="#25b6e6" />
    </svg>
  `;

  const renderItem = (item) => {
    const badge = item.badge ? `<span class="nav-panel-badge">${item.badge}</span>` : '';
    if (!item.children?.length) {
      return `
        <li class="nav-panel-item">
          <a class="nav-panel-link" href="${item.href}">${item.label}${badge}</a>
        </li>
      `;
    }
    return `
      <li class="nav-panel-item nav-panel-item--expandable">
        <button type="button" class="nav-panel-link nav-panel-item-toggle" aria-expanded="false">
          <span>${item.label}${badge}</span>
          ${caretSvg}
        </button>
        <ul class="nav-panel-sublist">
          ${item.children.map((c) => `<li><a href="${c.href}">${c.label}</a></li>`).join('')}
        </ul>
      </li>
    `;
  };

  // Slide-in nav panel opened by the hamburger tool
  const panel = document.createElement('aside');
  panel.id = 'nav-panel';
  panel.className = 'nav-panel';
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="nav-panel-backdrop" data-close></div>
    <div class="nav-panel-drawer" role="dialog" aria-modal="true" aria-label="Menu">
      <button type="button" class="nav-panel-close" aria-label="Close menu" data-close>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="#25b6e6" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
      <ul class="nav-panel-list">
        ${panelItems.map(renderItem).join('')}
      </ul>
    </div>
  `;

  nav.append(brand);
  nav.append(sections);
  nav.append(tools);
  nav.prepend(hamburger);

  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    document.body.style.overflowY = expanded ? '' : 'hidden';
  });

  const panelToggle = tools.querySelector('.nav-panel-toggle');
  const openPanel = () => {
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    panelToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflowY = 'hidden';
  };
  const closePanel = () => {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    panelToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
    panelToggle.focus();
  };

  panelToggle.addEventListener('click', openPanel);
  panel.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) {
      closePanel();
      return;
    }
    const toggle = e.target.closest('.nav-panel-item-toggle');
    if (toggle) {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      toggle.classList.toggle('is-active', !expanded);
      const item = toggle.closest('.nav-panel-item');
      if (item) item.classList.toggle('is-active', !expanded);
      const sublist = toggle.nextElementSibling;
      if (sublist) sublist.classList.toggle('is-active', !expanded);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
  });

  // Mega-menu dropdown — open on hover, close on mouse leave
  const dropdownItems = sections.querySelectorAll('.nav-item--dropdown');
  const closeAllDropdowns = () => {
    dropdownItems.forEach((item) => {
      item.classList.remove('is-open');
      item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
  };
  const openDropdown = (item) => {
    dropdownItems.forEach((other) => {
      if (other !== item) {
        other.classList.remove('is-open');
        other.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.add('is-open');
    item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'true');
  };

  dropdownItems.forEach((item) => {
    let closeTimer;
    item.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      openDropdown(item);
    });
    item.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => {
        item.classList.remove('is-open');
        item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      }, 150);
    });
    item.addEventListener('focusin', () => openDropdown(item));
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) {
        item.classList.remove('is-open');
        item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
  block.append(panel);
}
