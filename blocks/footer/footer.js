const CONTACT = {
  address: 'Corporate Office: 35th Floor, M3M IFC, Sec 66, Gurugram — 122002',
  email: 'customerservice@canarahsbclife.in',
  phones: ['1800-103-0003', '1800-891-0003'],
};

const SOCIAL = [
  { label: 'Facebook', href: 'https://www.facebook.com/canarahsbclifeinsurance', icon: '/icons/canara-sprite/facebook.svg' },
  { label: 'YouTube', href: 'https://www.youtube.com/@canarahsbclife', icon: '/icons/canara-sprite/youtube.svg' },
  { label: 'Instagram', href: 'https://www.instagram.com/canarahsbclife', icon: '/icons/canara-sprite/instagram.svg' },
  { label: 'X', href: 'https://twitter.com/canarahsbclife', icon: '/icons/canara-sprite/xlogo.svg' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/canara-hsbc-life-insurance', icon: '/icons/canara-sprite/linkedin.svg' },
];

const COLUMNS = [
  {
    title: 'Learn About Insurance',
    links: [
      { label: '5 Crore Term Insurance', href: '/term-insurance/5-crore' },
      { label: 'Tax Saving Plans', href: '/tax-saving-plans' },
      { label: 'Term Insurance Tax Benefits', href: '/term-insurance/tax-benefits' },
      { label: 'Health Insurance', href: '/health-insurance' },
      { label: 'Section 80C Tax Saving Options', href: '/tax-saving/80c' },
      { label: 'Child Money Back Plans', href: '/child-insurance/money-back' },
      { label: 'Financial Planning', href: '/financial-planning' },
      { label: 'Whole Life Insurance', href: '/whole-life-insurance' },
      { label: 'Disability Insurance', href: '/disability-insurance' },
      { label: 'What is Term Insurance', href: '/term-insurance/what-is' },
      { label: 'Term Insurance for NRI', href: '/term-insurance/nri' },
      { label: 'Term Insurance for Seniors', href: '/term-insurance/seniors' },
      { label: 'What is ULIP', href: '/ulip/what-is' },
      { label: 'How to File Income Tax?', href: '/tax/how-to-file' },
    ],
  },
  {
    title: 'Insurance Plans',
    links: [
      { label: 'Term Insurance', href: '/term-insurance' },
      { label: 'Life Insurance Plans', href: '/life-insurance' },
      { label: 'Saving & Investment Plans', href: '/saving-investment-plans' },
      { label: 'Child Insurance', href: '/child-insurance' },
      { label: 'Retirement Plans', href: '/retirement-plans' },
      { label: 'Financial Planning', href: '/financial-planning' },
      { label: 'Group Insurance', href: '/group-insurance' },
      { label: 'Health Insurance', href: '/health-insurance' },
      { label: 'Pension Scheme', href: '/pension-scheme' },
      { label: 'ULIP Insurance Plans', href: '/ulip-insurance-plans' },
      { label: 'Accidental Benefit Rider', href: '/insurance-riders/accidental-benefit' },
      { label: '1 Crore Term Plan', href: '/term-insurance/1-crore' },
      { label: '2 crore Term Plan', href: '/term-insurance/2-crore' },
      { label: 'Types of ULIP Plan', href: '/ulip/types' },
    ],
  },
  {
    title: 'Tools and Calculators',
    links: [
      { label: 'Calculate Premium', href: '/tools/premium-calculator' },
      { label: 'Suitability Calculator', href: '/tools/suitability-calculator' },
      { label: 'Term Insurance Calculator', href: '/tools/term-insurance-calculator' },
      { label: 'Income Tax Calculator', href: '/tools/income-tax-calculator' },
      { label: 'Other Calculators', href: '/tools' },
      { label: 'ULIP Calculator', href: '/tools/ulip-calculator' },
      { label: 'Child Calculator', href: '/tools/child-calculator' },
    ],
    subtitle: 'Important Links',
    subtitleLinks: [
      { label: 'Sitemap', href: '/sitemap' },
      { label: 'Fund Performance', href: '/fund-performance' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { label: 'Contact Us', href: '/customer-service/contact-us' },
      { label: 'Grievance Redressal', href: '/customer-service/grievance-redressal' },
      { label: 'Claims', href: '/customer-service/claims' },
      { label: 'Customer Awareness', href: '/customer-service/awareness' },
      { label: 'Life Insurance Fraud Awareness', href: '/customer-service/fraud-awareness' },
      { label: 'Track Application', href: '/customer-service/track-application' },
      { label: 'Renewal/Pay Premium', href: '/customer-service/pay-premium' },
      { label: 'Print Premium Receipt', href: '/customer-service/premium-receipt' },
    ],
  },
  {
    title: 'About Us',
    links: [
      { label: 'Overview', href: '/about-us' },
      { label: 'Careers', href: '/careers' },
      { label: 'Our Leaders', href: '/about-us/leadership' },
      { label: 'News & Press Release', href: '/about-us/news' },
      { label: 'Locate a Branch', href: '/locate-branch' },
      { label: 'Public Disclosures', href: '/investor-relations/public-disclosure' },
      { label: 'Account Aggregator', href: '/account-aggregator' },
    ],
  },
];

const RECOMMENDED = [
  { label: 'How to Apply for a Minor PAN Card for Your Child?', href: '#' },
  { label: 'Post Office Monthly Income Scheme (POMIS)', href: '#' },
  { label: 'TDS on Rent: Step-by-Step Guide to Calculation and Compliance', href: '#' },
  { label: 'Section 194J: TDS Rate on Fees for Professional & Technical Services', href: '#' },
  { label: 'What is Insurance? Definition, Types and Benefits', href: '#' },
  { label: 'Budget 2026 Tax Slabs: Impact on Salaried & Self-Employed', href: '#' },
  { label: 'ULIP Tax Benefits 2026: Save Tax Under Section 80C & 10(10D)', href: '#' },
  { label: 'New Labour Codes 2025: Key Changes, Benefits & PDF', href: '#' },
  { label: 'Senior Citizen Card: How to Apply for it Online?', href: '#' },
  { label: 'Will Budget 2026 Allow Joint Taxation for Married Couples?', href: '#' },
  { label: '7 Principles of Insurance in India Every Policyholder Should Know', href: '#' },
  { label: 'Income From Salary Explained: Components, Calculation, Allowances', href: '#' },
  { label: 'What is Salary Protection Insurance?', href: '#' },
];

const PARTNERS = [
  { label: 'Canara Bank', src: '/icons/partners/canara-bank-logo.svg' },
  { label: 'HSBC', src: '/icons/partners/hsbc-logo.svg' },
  { label: 'Tamil Nadu Grama Bank', src: '/icons/partners/tngb-logo.svg' },
  { label: 'Dhanlaxmi Bank', src: '/icons/partners/dhanlaxmi-bank-logo.svg' },
  { label: 'Kerala Gramin Bank', src: '/icons/partners/kgb-logo.svg' },
  { label: 'Can Fin Homes Ltd', src: '/icons/partners/can-fin-homes-logo.svg' },
];

const SECONDARY = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Bima Bharosa', href: '/bima-bharosa' },
      { label: 'Central KYC Registory', href: '/central-kyc-registory' },
      { label: 'Claims Paying Ability Rating', href: '/claims-paying-ability-rating' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Do not Call', href: '/do-not-call' },
      { label: 'Equal Opportunity Policy', href: '/equal-opportunity-policy' },
    ],
  },
  {
    title: 'Funds & NAV',
    links: [
      { label: 'HIV and AIDS Non Discrimination Policy', href: '/hiv-aids-policy' },
      { label: 'Hyperlink Policy', href: '/hyperlink-policy' },
      { label: 'List of Corporate Agent', href: '/list-of-corporate-agent' },
      { label: 'List of Insurance Agent', href: '/list-of-insurance-agent' },
      { label: 'List of Authorised Distributors', href: '/list-of-authorised-distributors' },
      { label: 'List of Products', href: '/list-of-products' },
    ],
  },
  {
    title: 'Download Center',
    links: [
      { label: 'Ombudsman Procedure', href: '/ombudsman-procedure' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Public Disclosures', href: '/public-disclosures' },
      { label: 'Quality Policy', href: '/quality-policy' },
      { label: 'Prevention of Sexual Harassment Policy', href: '/prevention-sexual-harassment-policy' },
      { label: 'Site Map', href: '/sitemap' },
    ],
  },
  {
    title: 'Proposal Form',
    links: [
      { label: 'Tender & Notices', href: '/tender-notices' },
      { label: 'Term of Use', href: '/term-of-use' },
      { label: 'WPC Disclosure FY 23-24', href: '/wpc-disclosure-23-24' },
      { label: 'WPC Disclosure FY 24-25', href: '/wpc-disclosure-24-25' },
    ],
  },
];

const DISCLAIMER_TEXT = 'IRDAI is not involved in activities like selling insurance policies, announcing bonus or investment of premiums. Public receiving such phone calls are requested to lodge a police complaint.';
const FRAUD_HEADING = 'BEWARE OF SPURIOUS / FRAUD PHONE CALLS!';
const COPYRIGHT = '&copy; 2019-2024 Canara HSBC Life Insurance Co. Ltd.';

const renderLinkList = (links) => links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('');

const renderColumn = (col) => `
  <div class="footer-col">
    <div class="footer-col-title">${col.title}</div>
    <ul class="footer-col-list">${renderLinkList(col.links)}</ul>
    ${col.subtitle ? `
      <div class="footer-col-title footer-col-title--sub">${col.subtitle}</div>
      <ul class="footer-col-list">${renderLinkList(col.subtitleLinks)}</ul>
    ` : ''}
  </div>
`;

const renderSocial = () => SOCIAL.map((s) => `
  <a class="footer-social-link" href="${s.href}" aria-label="${s.label}" target="_blank" rel="noopener noreferrer">
    <img src="${s.icon}" alt="" aria-hidden="true">
  </a>
`).join('');

const renderRecommended = () => `
  <div class="footer-recommended">
    <div role="button" tabindex="0" class="footer-recommended-toggle" aria-expanded="true" aria-controls="footer-recommended-list">
      <span>Recommended Articles</span>
      <img class="footer-recommended-caret" src="/icons/canara-sprite/down-arrow.svg" alt="" aria-hidden="true">
    </div>
    <ul class="footer-recommended-list" id="footer-recommended-list">
      ${RECOMMENDED.map((r) => `
        <li>
          <img class="footer-recommended-icon" src="/icons/canara-sprite/article.svg" alt="" aria-hidden="true">
          <a href="${r.href}">${r.label}</a>
        </li>
      `).join('')}
    </ul>
  </div>
`;

const renderPartners = () => `
  <div class="footer-partners">
    <div class="footer-partners-label">Our Partners</div>
    <div class="footer-partners-strip">
      ${PARTNERS.map((p) => `
        <div class="footer-partner">${p.src ? `<img src="${p.src}" alt="${p.label}" loading="lazy">` : `<span class="footer-partner-text">${p.label}</span>`}</div>
      `).join('')}
    </div>
  </div>
`;

const renderSecondary = () => `
  <div class="footer-secondary">
    <div class="footer-secondary-tabs" role="tablist">
      ${SECONDARY.map((col, i) => `
        <div role="tab" tabindex="0" class="footer-secondary-tab"
          id="footer-tab-${i}" aria-controls="footer-panel-${i}" aria-expanded="false" aria-selected="false">
          <span>${col.title}</span>
          <img class="footer-secondary-caret" src="/icons/canara-sprite/down-arrow.svg" alt="" aria-hidden="true">
        </div>
      `).join('')}
    </div>
    <div class="footer-secondary-panels">
      ${SECONDARY.map((col, i) => `
        <ul class="footer-secondary-panel" id="footer-panel-${i}" role="tabpanel"
          aria-labelledby="footer-tab-${i}" hidden>
          ${col.links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
        </ul>
      `).join('')}
    </div>

    <div class="footer-disclaimer">
      <div role="button" tabindex="0" class="footer-disclaimer-toggle" aria-expanded="false" aria-controls="footer-disclaimer-body">
        <span>Disclaimer</span>
        <img class="footer-secondary-caret" src="/icons/canara-sprite/down-arrow.svg" alt="" aria-hidden="true">
      </div>
      <div class="footer-disclaimer-body" id="footer-disclaimer-body" hidden>
        <p>Canara HSBC Life Insurance Company Limited is a joint venture between Canara Bank and HSBC Insurance (Asia Pacific) Holdings Limited (HIAPH). Regulated by the Insurance Regulatory and Development Authority of India (IRDAI).</p>
      </div>
    </div>

    <div class="footer-fraud">
      <div class="footer-fraud-heading">${FRAUD_HEADING}</div>
      <p class="footer-fraud-text">${DISCLAIMER_TEXT}</p>
    </div>

    <div class="footer-copyright">${COPYRIGHT}</div>
  </div>
`;

export default async function decorate(block) {
  block.textContent = '';

  const phonesHtml = CONTACT.phones.map((p) => `<a href="tel:${p.replace(/-/g, '')}">${p}</a>`).join(' | ');

  block.innerHTML = `
    <div class="footer-inner">
      <div class="footer-content">
      <div class="footer-top">
        <a class="footer-brand" href="/" aria-label="Canara HSBC Life Insurance">
          <img src="/icons/canara-hsbc-life-insurance-logo.svg" alt="Canara HSBC Life Insurance">
        </a>
        <div class="footer-social">${renderSocial()}</div>
      </div>

      <div class="footer-contact">
        <ul class="footer-contact-list">
          <li>
            <img class="footer-contact-icon" src="/icons/canara-sprite/location.svg" alt="" aria-hidden="true">
            <span>${CONTACT.address}</span>
          </li>
          <li>
            <img class="footer-contact-icon" src="/icons/canara-sprite/email.svg" alt="" aria-hidden="true">
            <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>
          </li>
          <li>
            <img class="footer-contact-icon" src="/icons/canara-sprite/contact.svg" alt="" aria-hidden="true">
            <span>Toll Free: ${phonesHtml}</span>
          </li>
        </ul>
        <div class="footer-apps">
          <div class="footer-apps-label">Download the Canara HSBC Life Insurance Mobile App</div>
          <div class="footer-apps-buttons">
            <a class="footer-app-btn" href="https://play.google.com/store" aria-label="Get it on Google Play" target="_blank" rel="noopener noreferrer">
              <img src="/icons/canara-sprite/get-it-on-google-play.svg" alt="Get it on Google Play">
            </a>
            <a class="footer-app-btn" href="https://www.apple.com/app-store/" aria-label="Download on the App Store" target="_blank" rel="noopener noreferrer">
              <img src="/icons/canara-sprite/app-store-download.svg" alt="Download on the App Store">
            </a>
          </div>
        </div>
      </div>

      <div class="footer-columns">
        ${COLUMNS.map(renderColumn).join('')}
      </div>

      ${renderRecommended()}

      ${renderPartners()}

      ${renderSecondary()}
      </div>
    </div>
  `;

  const activateOnKey = (el, fn) => el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  });

  const toggle = block.querySelector('.footer-recommended-toggle');
  const list = block.querySelector('.footer-recommended-list');
  if (toggle && list) {
    const activate = () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      list.hidden = expanded;
    };
    toggle.addEventListener('click', activate);
    activateOnKey(toggle, activate);
  }

  const tabs = [...block.querySelectorAll('.footer-secondary-tab')];
  const panels = [...block.querySelectorAll('.footer-secondary-panel')];
  tabs.forEach((tab, idx) => {
    const activate = () => {
      const wasOpen = tab.getAttribute('aria-expanded') === 'true';
      tabs.forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => { p.hidden = true; });
      if (!wasOpen) {
        tab.setAttribute('aria-expanded', 'true');
        tab.setAttribute('aria-selected', 'true');
        if (panels[idx]) panels[idx].hidden = false;
      }
    };
    tab.addEventListener('click', activate);
    activateOnKey(tab, activate);
  });

  const disclaimerBtn = block.querySelector('.footer-disclaimer-toggle');
  const disclaimerBody = block.querySelector('.footer-disclaimer-body');
  if (disclaimerBtn && disclaimerBody) {
    const activate = () => {
      const expanded = disclaimerBtn.getAttribute('aria-expanded') === 'true';
      disclaimerBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      disclaimerBody.hidden = expanded;
    };
    disclaimerBtn.addEventListener('click', activate);
    activateOnKey(disclaimerBtn, activate);
  }
}
