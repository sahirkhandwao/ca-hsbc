/**
 * Lead Form Block — EDS Universal Editor (WYSIWYG)
 * Pure vanilla JS, no Adaptive Forms / DA Forms dependency.
 *
 * Authored fields (read via parseConfig):
 *   heading, cta-text, cta-url, product-name, product-category,
 *   section-name, servlet-id, utm-cohort, recaptcha
 */

// ---------------------------------------------------------------------------
// Country-code data
// ---------------------------------------------------------------------------
const COUNTRY_CODES = [
  { code: '+91', label: 'India (+91)', regex: '^(?!([6-9])\\1{9})[6-9](?:(\\d)(?!\\2{9})){9}$', maxLength: 10 },
  { code: '+1',  label: 'USA/Canada (+1)',  regex: '^\\d{5,15}$', maxLength: 15 },
  { code: '+44', label: 'UK (+44)',         regex: '^\\d{5,15}$', maxLength: 15 },
  { code: '+61', label: 'Australia (+61)',  regex: '^\\d{5,15}$', maxLength: 15 },
  { code: '+971', label: 'UAE (+971)',      regex: '^\\d{5,15}$', maxLength: 15 },
  { code: '+65', label: 'Singapore (+65)', regex: '^\\d{5,15}$', maxLength: 15 },
  { code: '+60', label: 'Malaysia (+60)',  regex: '^\\d{5,15}$', maxLength: 15 },
  { code: '+1-868', label: 'Trinidad (+1-868)', regex: '^\\d{5,15}$', maxLength: 15 },
];

const CONSENT_TEXT_FULL = `I hereby authorise Canara HSBC Life Insurance Company Limited and its authorised representatives
to contact me and send me communications (including via calls/SMS/emails/WhatsApp) regarding
their products, services and offers, overriding any registration on DNCR/NDNC.
I have read and agreed to the <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>
and <a href="/terms-and-conditions" target="_blank" rel="noopener">Terms &amp; Conditions</a>.`;

const CONSENT_TEXT_SHORT = `I authorise Canara HSBC Life Insurance to contact me regarding products &amp; services.
<a class="lf-read-more" href="#" role="button" aria-expanded="false">Read more</a>`;

// ---------------------------------------------------------------------------
// Config parser — reads the EDS block table rows into a key/value map
// ---------------------------------------------------------------------------
function parseConfig(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      // Preserve inner HTML for rich-text fields (e.g. consent copy)
      config[key] = cells[1].textContent.trim();
    }
  });
  return config;
}

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'className') node.className = v;
    else if (k.startsWith('data-')) node.setAttribute(k, v);
    else node[k] = v;
  });
  children.flat().forEach((child) => {
    if (child == null) return;
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
}

// ---------------------------------------------------------------------------
// Build the <form> element from config
// ---------------------------------------------------------------------------
function buildForm(config) {
  // --- Heading ---
  const heading = el('h2', { className: 'lf-heading' },
    config.heading || "Secure Your Family's Future with the Right Life Insurance Plan",
  );

  // --- Full Name ---
  const nameGroup = buildFieldGroup({
    id: 'lf-name',
    label: 'Full Name',
    required: true,
    input: el('input', {
      type: 'text',
      id: 'lf-name',
      name: 'fullName',
      className: 'lf-input',
      placeholder: 'Enter your full name',
      required: true,
      minLength: 3,
      maxLength: 50,
      'data-regex': '^[a-zA-Z][a-zA-Z .\'-]{1,48}[a-zA-Z .\'-]$',
      autocomplete: 'name',
    }),
  });

  // --- Mobile Number ---
  const countrySelect = el('select', {
    className: 'lf-country-code',
    name: 'countryCode',
    id: 'lf-country-code',
    'aria-label': 'Country code',
  });
  COUNTRY_CODES.forEach(({ code, label }) => {
    const opt = el('option', { value: code }, label);
    if (code === '+91') opt.selected = true;
    countrySelect.append(opt);
  });

  const mobileInput = el('input', {
    type: 'tel',
    id: 'lf-mobile',
    name: 'mobile',
    className: 'lf-input lf-mobile-input',
    placeholder: 'Enter mobile number',
    required: true,
    maxLength: 10,
    autocomplete: 'tel-national',
    'data-regex-in': '^(?!([6-9])\\1{9})[6-9](?:(\\d)(?!\\2{9})){9}$',
    'data-regex-foreign': '^\\d{5,15}$',
  });

  const mobileWrapper = el('div', { className: 'lf-mobile-wrapper' }, countrySelect, mobileInput);
  const mobileGroup = buildFieldGroup({
    id: 'lf-mobile',
    label: 'Mobile Number',
    required: true,
    input: mobileWrapper,
  });

  // --- Email ---
  const emailGroup = buildFieldGroup({
    id: 'lf-email',
    label: 'Email Address',
    required: true,
    input: el('input', {
      type: 'email',
      id: 'lf-email',
      name: 'email',
      className: 'lf-input',
      placeholder: 'Enter your email address',
      required: true,
      maxLength: 100,
      'data-regex': '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
      autocomplete: 'email',
    }),
  });

  // --- Hidden fields ---
  const hiddenFields = [
    el('input', { type: 'hidden', name: 'allowUtmParam',         value: 'false' }),
    el('input', { type: 'hidden', name: 'isISNPRedirection',     value: 'false' }),
    el('input', { type: 'hidden', name: 'isCLPRedirection',      value: 'false' }),
    el('input', { type: 'hidden', name: 'productName',           value: config['product-name']     || 'Term' }),
    el('input', { type: 'hidden', name: 'productCategory',       value: config['product-category'] || 'Life Insurance' }),
    el('input', { type: 'hidden', name: 'Website_Section_Name',  value: config['section-name']     || 'Blogs - Life Insurance' }),
    el('input', { type: 'hidden', name: 'utmCohort',             value: config['utm-cohort']       || 'Organic_Term' }),
  ];

  // --- Consent ---
  const consentId = 'lf-consent';
  const consentLabel = el('label', { htmlFor: consentId, className: 'lf-consent-label' });
  consentLabel.innerHTML = CONSENT_TEXT_SHORT;

  const consentCheckbox = el('input', {
    type: 'checkbox',
    id: consentId,
    name: 'consent',
    className: 'lf-consent-checkbox',
    required: true,
    checked: true,
  });

  const consentGroup = el('div', { className: 'lf-field-group lf-consent-group' },
    consentCheckbox,
    consentLabel,
    el('span', { className: 'lf-field-error', 'aria-live': 'polite' }),
  );

  // --- Submit button ---
  const submitBtn = el('button', {
    type: 'submit',
    className: 'lf-submit-btn',
  }, config['cta-text'] || 'Check Your Premium');

  // --- Build <form> ---
  const formAttrs = {
    className: 'lf-form',
    noValidate: true,
    'data-servlet-id': config['servlet-id'] || 'digital',
  };
  if (config.recaptcha === 'true' || config.recaptcha === true) {
    formAttrs['data-recaptcha'] = 'true';
  }

  const form = el('form', formAttrs,
    nameGroup,
    mobileGroup,
    emailGroup,
    ...hiddenFields,
    consentGroup,
    submitBtn,
  );

  return el('div', { className: 'lf-form-inner' }, heading, form);
}

// ---------------------------------------------------------------------------
// Field group builder
// ---------------------------------------------------------------------------
function buildFieldGroup({ id, label, required, input }) {
  const labelEl = el('label', { htmlFor: id, className: 'lf-label' },
    label,
    required ? el('span', { className: 'lf-required', 'aria-hidden': 'true' }, ' *') : null,
  );
  const errorEl = el('span', { className: 'lf-field-error', 'aria-live': 'polite' });
  return el('div', { className: 'lf-field-group' }, labelEl, input, errorEl);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
function getError(field) {
  const val = field.value.trim();

  if (field.type === 'checkbox') {
    return field.checked ? '' : 'Please accept the consent to proceed.';
  }

  if (!val) return `${getLabelText(field)} is required.`;

  const regex = field.dataset.regex;
  if (regex && !new RegExp(regex).test(val)) {
    if (field.name === 'fullName') return 'Please enter a valid full name (3–50 characters, letters only).';
    if (field.type === 'email') return 'Please enter a valid email address.';
    return `Please enter a valid ${getLabelText(field).toLowerCase()}.`;
  }

  // Mobile: pick regex based on selected country code
  if (field.name === 'mobile') {
    const form = field.closest('form');
    const countryCode = form?.querySelector('[name="countryCode"]')?.value || '+91';
    const isIndia = countryCode === '+91';
    const mobileRegex = isIndia ? field.dataset.regexIn : field.dataset.regexForeign;
    if (mobileRegex && !new RegExp(mobileRegex).test(val)) {
      return 'Please enter a valid mobile number.';
    }
  }

  return '';
}

function getLabelText(field) {
  const label = field.closest('.lf-field-group')?.querySelector('.lf-label');
  return label ? label.firstChild.textContent.trim() : 'This field';
}

function validateForm(form) {
  let valid = true;
  const fields = [...form.querySelectorAll('input[required], input[name="mobile"]')];

  fields.forEach((field) => {
    const error = getError(field);
    showFieldError(field, error);
    if (error) valid = false;
  });

  return valid;
}

function showFieldError(field, message) {
  const group = field.closest('.lf-field-group, .lf-consent-group');
  if (!group) return;
  const errorEl = group.querySelector('.lf-field-error');
  if (errorEl) errorEl.textContent = message;
  group.classList.toggle('lf-has-error', !!message);
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function clearFieldError(field) {
  showFieldError(field, '');
}

// ---------------------------------------------------------------------------
// Country-code change handler — updates mobile maxlength & placeholder
// ---------------------------------------------------------------------------
function onCountryChange(select, mobileInput) {
  const selected = COUNTRY_CODES.find((c) => c.code === select.value) || COUNTRY_CODES[0];
  mobileInput.maxLength = selected.maxLength;
  mobileInput.placeholder = selected.maxLength === 10 ? '10-digit mobile number' : 'Mobile number';
}

// ---------------------------------------------------------------------------
// Consent read-more / read-less toggle
// ---------------------------------------------------------------------------
function initConsentToggle(wrapper) {
  wrapper.addEventListener('click', (e) => {
    const link = e.target.closest('.lf-read-more, .lf-read-less');
    if (!link) return;
    e.preventDefault();

    const label = link.closest('.lf-consent-label');
    if (!label) return;

    const isExpanded = link.classList.contains('lf-read-less');

    if (isExpanded) {
      label.innerHTML = CONSENT_TEXT_SHORT;
    } else {
      label.innerHTML = `${CONSENT_TEXT_FULL} <a class="lf-read-less" href="#" role="button" aria-expanded="true">Read less</a>`;
    }
  });
}

// ---------------------------------------------------------------------------
// Success state
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
        'Your details have been submitted successfully. We will get in touch with you shortly.',
      ),
    ),
  );
}

// ---------------------------------------------------------------------------
// Form submission
// ---------------------------------------------------------------------------
async function submitForm(form, config) {
  const servletId = form.dataset.servletId || 'digital';
  const endpoint = `/bin/canarahsbc/servlet?servletId=${servletId}`;

  const formData = new FormData(form);
  // Add UTM params from URL if allowUtmParam is true
  const urlParams = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
    if (urlParams.has(key)) formData.set(key, urlParams.get(key));
  });

  const body = new URLSearchParams(formData).toString();

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { success: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[lead-form] Submission error:', err);
    return { success: false, error: err.message };
  }
}

// ---------------------------------------------------------------------------
// Wire up all interactions
// ---------------------------------------------------------------------------
function initFormInteractions(wrapper, config) {
  const form = wrapper.querySelector('.lf-form');
  if (!form) return;

  const countrySelect = form.querySelector('[name="countryCode"]');
  const mobileInput = form.querySelector('[name="mobile"]');

  // Country-code change
  if (countrySelect && mobileInput) {
    countrySelect.addEventListener('change', () => onCountryChange(countrySelect, mobileInput));
  }

  // Real-time validation — clear errors on input/change
  form.querySelectorAll('input[required], input[name="mobile"]').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.closest('.lf-field-group')?.classList.contains('lf-has-error')) {
        clearFieldError(field);
      }
    });
    field.addEventListener('blur', () => {
      const error = getError(field);
      if (error) showFieldError(field, error);
    });
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    const submitBtn = form.querySelector('.lf-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Please wait…';

    const { success } = await submitForm(form, config);

    if (success) {
      showSuccess(wrapper);
      const ctaUrl = config['cta-url'] || 'https://www.canarahsbclife.com/life-insurance-plans';
      // Redirect after brief delay so user sees the success message
      setTimeout(() => { window.location.href = ctaUrl; }, 2000);
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      // Show a generic inline error
      let errorBanner = form.querySelector('.lf-submit-error');
      if (!errorBanner) {
        errorBanner = el('p', { className: 'lf-submit-error', role: 'alert' });
        submitBtn.insertAdjacentElement('beforebegin', errorBanner);
      }
      errorBanner.textContent = 'Something went wrong. Please try again in a moment.';
    }
  });

  // Consent read-more toggle
  initConsentToggle(wrapper);
}

// ---------------------------------------------------------------------------
// EDS block entry point
// ---------------------------------------------------------------------------
export default function decorate(block) {
  // Parse authoring config from block table rows
  const config = parseConfig(block);

  // Build form HTML
  const formWrapper = el('div', { className: 'lf-wrapper' });
  formWrapper.append(buildForm(config));

  // Replace block content with rendered form
  block.innerHTML = '';
  block.append(formWrapper);

  // Wire interactions
  initFormInteractions(formWrapper, config);
}
