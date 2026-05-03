/**
 * Lead Form Block — EDS Universal Editor (WYSIWYG)
 * Pixel-accurate replication of .genericForm on canarahsbclife.com
 * Pure vanilla JS — no Adaptive Forms / DA Forms dependency.
 *
 * Authored fields (parsed from block table rows):
 *   heading, cta-text, cta-url, product-name, product-category,
 *   section-name, servlet-id, utm-cohort, recaptcha
 */

import CONSTANTS from "../../utils/constants.js";

// ---------------------------------------------------------------------------
// Country-code list (matches source page dropdown order)
// ---------------------------------------------------------------------------
const COUNTRY_CODES = [
  { code: '+91',   label: '+91',   indiaRegex: '^(?!([6-9])\\1{9})[6-9](?:(\\d)(?!\\2{9})){9}$' },
  { code: '+376',  label: '+376' },
  { code: '+54',   label: '+54' },
  { code: '+61',   label: '+61' },
  { code: '+43',   label: '+43' },
  { code: '+32',   label: '+32' },
  { code: '+1441', label: '+1441' },
  { code: '+359',  label: '+359' },
  { code: '+1',    label: '+1' },
  { code: '+385',  label: '+385' },
  { code: '+357',  label: '+357' },
  { code: '+420',  label: '+420' },
  { code: '+593',  label: '+593' },
  { code: '+358',  label: '+358' },
  { code: '+33',   label: '+33' },
  { code: '+49',   label: '+49' },
  { code: '+30',   label: '+30' },
  { code: '+852',  label: '+852' },
  { code: '+36',   label: '+36' },
  { code: '+354',  label: '+354' },
  { code: '+353',  label: '+353' },
  { code: '+39',   label: '+39' },
  { code: '+81',   label: '+81' },
  { code: '+371',  label: '+371' },
  { code: '+423',  label: '+423' },
  { code: '+370',  label: '+370' },
  { code: '+352',  label: '+352' },
  { code: '+356',  label: '+356' },
  { code: '+377',  label: '+377' },
  { code: '+31',   label: '+31' },
  { code: '+64',   label: '+64' },
  { code: '+47',   label: '+47' },
  { code: '+968',  label: '+968' },
  { code: '+48',   label: '+48' },
  { code: '+351',  label: '+351' },
  { code: '+974',  label: '+974' },
  { code: '+40',   label: '+40' },
  { code: '+65',   label: '+65' },
  { code: '+421',  label: '+421' },
  { code: '+386',  label: '+386' },
  { code: '+82',   label: '+82' },
  { code: '+34',   label: '+34' },
  { code: '+46',   label: '+46' },
  { code: '+886',  label: '+886' },
  { code: '+971',  label: '+971' },
  { code: '+44',   label: '+44' },
  { code: '+379',  label: '+379' },
];

const INDIA_MOBILE_REGEX = /^(?!([6-9])\1{9})[6-9](?:(\d)(?!\2{9})){9}$/;
const FOREIGN_MOBILE_REGEX = /^\d{5,15}$/;
const NAME_REGEX = /^[a-zA-Z][a-zA-Z .'-]{1,48}[a-zA-Z .'-]$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

function getGaId() {
  const gaCookie = getCookie('_ga') || '';
  if (gaCookie) {
    const parts = gaCookie.split('.');
    if (parts.length >= 4) {
      return `${parts[2]}.${parts[3]}`;
    }
  }
  return '';
}


// ---------------------------------------------------------------------------
// Config parser — reads EDS block table rows into a key/value map
// ---------------------------------------------------------------------------
function parseConfig(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      config[key] = cells[1].textContent.trim();
    }
  });
  return config;
}

// ---------------------------------------------------------------------------
// Minimal DOM builder
// ---------------------------------------------------------------------------
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'className') { node.className = v; }
    else if (k === 'htmlFor') { node.htmlFor = v; }
    else if (k === 'innerHTML') { node.innerHTML = v; }
    else if (k.startsWith('data-') || k.startsWith('aria-')) { node.setAttribute(k, v); }
    else { node[k] = v; }
  });
  children.flat().forEach((child) => {
    if (child == null) return;
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
}

// ---------------------------------------------------------------------------
// Build the country-code <select>
// ---------------------------------------------------------------------------
function buildCountrySelect() {
  const select = el('select', {
    className: 'lf-country-code',
    name: 'countryCode',
    id: 'lf-country-code',
    'aria-label': 'Country code',
  });
  COUNTRY_CODES.forEach(({ code, label }) => {
    const opt = el('option', { value: code }, label);
    if (code === '+91') opt.selected = true;
    select.appendChild(opt);
  });
  return select;
}

// ---------------------------------------------------------------------------
// Build one field group (label + input + error span)
// ---------------------------------------------------------------------------
function buildFieldGroup({ id, label, required, input, extraClass = '' }) {
  const labelEl = el('label', { htmlFor: id, className: 'lf-label' },
    label,
    required ? el('span', { className: 'lf-required', 'aria-hidden': 'true' }, '*') : null,
  );
  const errorEl = el('span', {
    className: 'lf-field-error',
    'aria-live': 'polite',
    id: `${id}-error`,
  });
  const groupClass = `lf-field-group${extraClass ? ` ${extraClass}` : ''}`;
  return el('div', { className: groupClass }, labelEl, input, errorEl);
}

// ---------------------------------------------------------------------------
// Build the complete form structure
// ---------------------------------------------------------------------------
function buildForm(config) {
  const heading = config.heading || "Secure Your Family's Future with the Right Life Insurance Plan";
  const ctaText = config['cta-text'] || 'Check Your Premium';
  const ctaUrl = config['cta-url'] || 'https://www.canarahsbclife.com/life-insurance-plans';
  const productName = config['product-name'] || 'Term';
  const productCategory = config['product-category'] || 'Life Insurance';
  const sectionName = config['section-name'] || 'Blogs - Life Insurance';
  const servletId = config['servlet-id'] || 'digital';
  const utmCohort = config['utm-cohort'] || 'Organic_Term';
  const recaptchaEnabled = config.recaptcha === 'true' || config.recaptcha === true;

  // --- Full Name ---
  const nameInput = el('input', {
    type: 'text',
    id: 'lf-name',
    name: 'fullName',
    className: 'lf-input',
    placeholder: 'Enter your name',
    required: true,
    minLength: 3,
    maxLength: 50,
    autocomplete: 'name',
    'aria-describedby': 'lf-name-error',
  });
  const nameGroup = buildFieldGroup({ id: 'lf-name', label: 'Full Name', required: true, input: nameInput });

  // --- Mobile Number ---
  const mobileInput = el('input', {
    type: 'tel',
    id: 'lf-mobile',
    name: 'mobileNumber',
    className: 'lf-input lf-mobile-input',
    placeholder: 'Enter your mobile number',
    required: true,
    maxLength: 15,
    autocomplete: 'tel-national',
    'aria-describedby': 'lf-mobile-error',
  });
  const mobileWrapper = el('div', { className: 'lf-mobile-wrapper' },
    buildCountrySelect(),
    mobileInput,
  );
  const mobileGroup = buildFieldGroup({ id: 'lf-mobile', label: 'Mobile Number', required: true, input: mobileWrapper });

  // --- Email ---
  const emailInput = el('input', {
    type: 'email',
    id: 'lf-email',
    name: 'emailID',
    className: 'lf-input',
    placeholder: 'Enter your email',
    required: true,
    maxLength: 100,
    autocomplete: 'email',
    'aria-describedby': 'lf-email-error',
  });
  const emailGroup = buildFieldGroup({ id: 'lf-email', label: 'Email', required: true, input: emailInput, extraClass: 'lf-email-group' });

  // --- Hidden fields ---
  const hiddenFields = [
    el('input', { type: 'hidden', name: 'allowUtmParam',        value: 'false' }),
    el('input', { type: 'hidden', name: 'isISNPRedirection',    value: 'false' }),
    el('input', { type: 'hidden', name: 'isCLPRedirection',     value: 'false' }),
    el('input', { type: 'hidden', name: 'productName',          value: productName }),
    el('input', { type: 'hidden', name: 'productCategory',      value: productCategory }),
    el('input', { type: 'hidden', name: 'Website_Section_Name', value: sectionName }),
    el('input', { type: 'hidden', name: 'utmCohort',            value: utmCohort }),
  ];

  // --- Consent ---
  const consentCheckbox = el('input', {
    type: 'checkbox',
    id: 'lf-consent',
    name: 'leadConsent',
    className: 'lf-consent-checkbox',
    required: true,
    checked: true,
    'aria-describedby': 'lf-consent-error',
  });

  // Custom checkbox visual box
  const consentBox = el('div', { className: 'lf-consent-box is-checked', 'aria-hidden': 'true' });
  consentBox.innerHTML = `
    <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  // Consent label with truncated text + read more
  const consentLabelEl = el('label', {
    htmlFor: 'lf-consent',
    className: 'lf-consent-label',
    id: 'lf-consent-label',
  });
  const consentTextSpan = el('span', { className: 'lf-consent-text' },
    'I agree that even if my contact number is registered with NDNC / NCPR, I would still want the Company to contact me on the given number and email id for the clarifications/product information sought by me and agree that I have read and understood the Privacy Policy and agree to abide by the same.',
  );
  const readMoreBtn = el('button', {
    type: 'button',
    className: 'lf-read-more',
    'aria-expanded': 'false',
  }, '... Read more');
  consentLabelEl.append(consentTextSpan, readMoreBtn);

  const consentError = el('span', {
    className: 'lf-field-error',
    id: 'lf-consent-error',
    'aria-live': 'polite',
  });

  const consentGroup = el('div', {
    className: 'lf-consent-group',
  }, consentCheckbox, consentBox, consentLabelEl, consentError);

  // --- Submit ---
  const submitBtn = el('button', {
    type: 'submit',
    className: 'lf-submit-btn',
  });
  submitBtn.innerHTML = `
    ${ctaText}
    <span class="lf-submit-icon" aria-hidden="true">
      <svg viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 6h13M9 1l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>`;

  const submitWrap = el('div', { className: 'lf-submit-wrap' }, submitBtn);

  // --- Assemble <form> ---
  const formAttrs = {
    className: 'lf-form',
    noValidate: true,
    'data-servlet-id': servletId,
  };
  if (recaptchaEnabled) {
    formAttrs['data-recaptcha'] = 'true';
  }

  const form = el('form', formAttrs,
    nameGroup,
    mobileGroup,
    emailGroup,
    ...hiddenFields,
    consentGroup,
    submitWrap,
  );

  // --- Heading + form in lf-main ---
  const headingEl = el('h2', { className: 'lf-heading' }, heading);
  const mainEl = el('div', { className: 'lf-main' }, headingEl, form);
  const inner = el('div', { className: 'lf-form-inner' }, mainEl);

  return inner;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
function showError(groupOrField, message) {
  const group = groupOrField.closest
    ? groupOrField.closest('.lf-field-group, .lf-consent-group')
    : groupOrField;
  if (!group) return;
  group.classList.add('lf-has-error');
  const errorEl = group.querySelector('.lf-field-error');
  if (errorEl) errorEl.textContent = message;
  const input = group.querySelector('input:not([type=hidden]):not([type=checkbox])');
  if (input) input.setAttribute('aria-invalid', 'true');
}

function clearError(groupOrField) {
  const group = groupOrField.closest
    ? groupOrField.closest('.lf-field-group, .lf-consent-group')
    : groupOrField;
  if (!group) return;
  group.classList.remove('lf-has-error');
  const errorEl = group.querySelector('.lf-field-error');
  if (errorEl) errorEl.textContent = '';
  const input = group.querySelector('input:not([type=hidden]):not([type=checkbox])');
  if (input) input.removeAttribute('aria-invalid');
}

function validateForm(form) {
  let valid = true;

  // Name
  const nameInput = form.querySelector('[name="fullName"]');
  if (nameInput) {
    const val = nameInput.value.trim();
    if (!val) {
      showError(nameInput, 'Please enter the Full name');
      valid = false;
    } else if (!NAME_REGEX.test(val)) {
      showError(nameInput, 'Please enter correct name');
      valid = false;
    } else {
      clearError(nameInput);
    }
  }

  // Mobile
  const mobileInput = form.querySelector('[name="mobileNumber"]');
  const countrySelect = form.querySelector('[name="countryCode"]');
  if (mobileInput) {
    const val = mobileInput.value.trim();
    const isIndia = !countrySelect || countrySelect.value === '+91';
    if (!val) {
      showError(mobileInput, 'Please enter Mobile Number');
      valid = false;
    } else if (isIndia && !INDIA_MOBILE_REGEX.test(val)) {
      showError(mobileInput, 'Please enter valid mobile number');
      valid = false;
    } else if (!isIndia && !FOREIGN_MOBILE_REGEX.test(val)) {
      showError(mobileInput, 'Please enter valid mobile number');
      valid = false;
    } else {
      clearError(mobileInput);
    }
  }

  // Email
  const emailInput = form.querySelector('[name="emailID"]');
  if (emailInput) {
    const val = emailInput.value.trim();
    if (!val) {
      showError(emailInput, 'Please enter Email');
      valid = false;
    } else if (!EMAIL_REGEX.test(val)) {
      showError(emailInput, 'Please enter valid email');
      valid = false;
    } else {
      clearError(emailInput);
    }
  }

  // Consent
  const consentCheckbox = form.querySelector('[name="leadConsent"]');
  if (consentCheckbox && !consentCheckbox.checked) {
    const consentGroup = consentCheckbox.closest('.lf-consent-group');
    if (consentGroup) {
      consentGroup.classList.add('lf-has-error');
      const errorEl = consentGroup.querySelector('.lf-field-error');
      if (errorEl) errorEl.textContent = 'Consent is required';
    }
    valid = false;
  } else if (consentCheckbox) {
    const consentGroup = consentCheckbox.closest('.lf-consent-group');
    if (consentGroup) {
      consentGroup.classList.remove('lf-has-error');
      const errorEl = consentGroup.querySelector('.lf-field-error');
      if (errorEl) errorEl.textContent = '';
    }
  }

  return valid;
}

// ---------------------------------------------------------------------------
// Consent toggle: custom checkbox + read more/less
// ---------------------------------------------------------------------------
function initConsentToggle(wrapper) {
  const consentCheckbox = wrapper.querySelector('[name="leadConsent"]');
  const consentBox = wrapper.querySelector('.lf-consent-box');
  const consentLabel = wrapper.querySelector('.lf-consent-label');

  // Click on consentBox toggles checkbox
  if (consentBox && consentCheckbox) {
    consentBox.addEventListener('click', () => {
      consentCheckbox.checked = !consentCheckbox.checked;
      consentBox.classList.toggle('is-checked', consentCheckbox.checked);
    });
  }

  // Read more / Read less
  if (consentLabel) {
    consentLabel.addEventListener('click', (e) => {
      const btn = e.target.closest('.lf-read-more, .lf-read-less');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      const isExpanded = consentLabel.classList.contains('is-expanded');
      if (isExpanded) {
        consentLabel.classList.remove('is-expanded');
        const textSpan = consentLabel.querySelector('.lf-consent-text');
        if (btn.classList.contains('lf-read-less')) {
          btn.className = 'lf-read-more';
          btn.setAttribute('aria-expanded', 'false');
          btn.textContent = '... Read more';
        }
      } else {
        consentLabel.classList.add('is-expanded');
        btn.className = 'lf-read-less';
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = ' Read less';
      }
    });
  }
}

// ---------------------------------------------------------------------------
// Show success state
// ---------------------------------------------------------------------------
function showSuccess(wrapper) {
  const inner = wrapper.querySelector('.lf-form-inner');
  if (!inner) return;
  inner.innerHTML = '';
  inner.append(
    el('div', { className: 'lf-success' },
      el('div', { className: 'lf-success-icon', 'aria-hidden': 'true' }, '✓'),
      el('h3', { className: 'lf-success-title' }, 'Thank you!'),
      el('p', { className: 'lf-success-message' },
        'Your details have been submitted. Our team will be in touch with you shortly.',
      ),
    ),
  );
}

// ---------------------------------------------------------------------------
// Submit via fetch
// ---------------------------------------------------------------------------
async function submitLead(form) {
  const servletId = form.dataset.servletId || 'digital';
  const endpoint = `https://www.canarahsbclife.com/bin/chli/genericForm?servletID=${servletId}`;

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Mapping/Formatting fields for API
  const payload = {
    ...data,
    isQualified: true,
    isOtpEnabled: false,
    leadConsent: data.leadConsent === 'on' ? 'Yes' : 'No',
    gaId: getGaId(),
  };

  // UTM handling
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source') || 'Organic';
  payload.utmSource = utmSource;

  ['utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
    if (urlParams.has(key)) payload[key] = urlParams.get(key);
  });

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[lead-form] Submit error:', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Wire all form interactions
// ---------------------------------------------------------------------------
function initFormInteractions(wrapper, config) {
  const form = wrapper.querySelector('.lf-form');
  if (!form) return;

  const ctaUrl = config['cta-url'] || CONSTANTS.prodDomain + '/life-insurance-plans';

  // Real-time error clearing
  form.querySelectorAll('input:not([type=hidden])').forEach((input) => {
    const event = input.type === 'checkbox' ? 'change' : 'input';
    input.addEventListener(event, () => {
      if (input.closest('.lf-field-group, .lf-consent-group')?.classList.contains('lf-has-error')) {
        clearError(input);
      }
    });
  });

  // Consent toggle
  initConsentToggle(wrapper);

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const submitBtn = form.querySelector('.lf-submit-btn');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Please wait…';

    const success = await submitLead(form);

    if (success) {
      // Dispatch analytics event before showing success state
      const nameVal = form.querySelector('[name="fullName"]')?.value?.trim() || '';
      const emailVal = form.querySelector('[name="emailID"]')?.value?.trim() || '';
      const mobileVal = form.querySelector('[name="mobileNumber"]')?.value?.trim() || '';
      document.dispatchEvent(new CustomEvent('lead-form:submitted', {
        detail: {
          name: nameVal,
          email: emailVal,
          mobile: mobileVal,
          leadId: '',
          productName: config['product-name'] || 'Term',
          productCategory: config['product-category'] || 'Life Insurance',
        },
      }));

      showSuccess(wrapper);
      setTimeout(() => { window.location.href = ctaUrl; }, 2000);
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
      let errMsg = form.querySelector('.lf-submit-error');
      if (!errMsg) {
        errMsg = el('p', { className: 'lf-submit-error', role: 'alert' });
        submitBtn.closest('.lf-submit-wrap').insertBefore(errMsg, submitBtn);
      }
      errMsg.textContent = 'Something went wrong. Please try again.';
    }
  });
}

// ---------------------------------------------------------------------------
// EDS block entry point
// ---------------------------------------------------------------------------
export default function decorate(block) {
  const config = parseConfig(block);
  const formWrapper = el('div', { className: 'lf-wrapper' });
  formWrapper.append(buildForm(config));
  block.innerHTML = '';
  block.append(formWrapper);
  initFormInteractions(formWrapper, config);
}
