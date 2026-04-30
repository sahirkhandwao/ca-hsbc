/**
 * Lead Form Block
 *
 * Renders a "Secure Your Family's Future" lead capture form.
 * Fields: Full Name, Mobile Number (with country code), Email
 * Consent checkbox + "Check Your Premium" CTA.
 *
 * Authoring (Google Doc / SharePoint):
 * ┌─────────────────┬──────────────────────────────────────────────────────┐
 * │ Lead Form       │                                                      │
 * ├─────────────────┼──────────────────────────────────────────────────────┤
 * │ heading         │ Secure Your Family's Future with the Right Life ...  │
 * │ cta-text        │ Check Your Premium                                   │
 * │ cta-url         │ https://www.canarahsbclife.com/life-insurance-plans  │
 * │ product-name    │ Term                                                 │
 * │ product-category│ Life Insurance                                       │
 * │ section-name    │ Blogs - Life Insurance                               │
 * └─────────────────┴──────────────────────────────────────────────────────┘
 * Any row not provided falls back to a sensible default.
 */

const COUNTRY_CODES = [
  { code: '+91', label: '+91', default: true },
  { code: '+1', label: '+1' },
  { code: '+44', label: '+44' },
  { code: '+61', label: '+61' },
  { code: '+971', label: '+971' },
  { code: '+65', label: '+65' },
  { code: '+60', label: '+60' },
  { code: '+49', label: '+49' },
  { code: '+33', label: '+33' },
  { code: '+81', label: '+81' },
  { code: '+86', label: '+86' },
  { code: '+82', label: '+82' },
  { code: '+64', label: '+64' },
  { code: '+34', label: '+34' },
  { code: '+39', label: '+39' },
  { code: '+31', label: '+31' },
  { code: '+46', label: '+46' },
  { code: '+47', label: '+47' },
  { code: '+45', label: '+45' },
  { code: '+358', label: '+358' },
  { code: '+41', label: '+41' },
  { code: '+43', label: '+43' },
  { code: '+32', label: '+32' },
  { code: '+351', label: '+351' },
  { code: '+30', label: '+30' },
  { code: '+48', label: '+48' },
  { code: '+420', label: '+420' },
  { code: '+36', label: '+36' },
  { code: '+40', label: '+40' },
  { code: '+359', label: '+359' },
  { code: '+372', label: '+372' },
  { code: '+371', label: '+371' },
  { code: '+370', label: '+370' },
  { code: '+386', label: '+386' },
  { code: '+421', label: '+421' },
  { code: '+385', label: '+385' },
  { code: '+974', label: '+974' },
  { code: '+968', label: '+968' },
  { code: '+852', label: '+852' },
  { code: '+886', label: '+886' },
  { code: '+54', label: '+54' },
  { code: '+55', label: '+55' },
  { code: '+52', label: '+52' },
  { code: '+57', label: '+57' },
  { code: '+56', label: '+56' },
  { code: '+51', label: '+51' },
  { code: '+58', label: '+58' },
  { code: '+593', label: '+593' },
  { code: '+353', label: '+353' },
  { code: '+354', label: '+354' },
  { code: '+423', label: '+423' },
  { code: '+352', label: '+352' },
  { code: '+356', label: '+356' },
  { code: '+357', label: '+357' },
  { code: '+377', label: '+377' },
  { code: '+379', label: '+379' },
  { code: '+376', label: '+376' },
];

/**
 * Parse authoring rows from the block table into a config object.
 * Rows are expected as: [key cell] [value cell]
 */
function parseConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase().replace(/\s+/g, '-');
      config[key] = cells[1].textContent.trim();
    }
  });
  return config;
}

/**
 * Show an error message on a form group.
 */
function showError(group, type) {
  group.querySelectorAll('.lead-form__error').forEach((el) => el.classList.add('hidden'));
  const target = group.querySelector(`.lead-form__error--${type}`);
  if (target) target.classList.remove('hidden');
  group.querySelector('input,select')?.classList.add('has-error');
}

function clearError(group) {
  group.querySelectorAll('.lead-form__error').forEach((el) => el.classList.add('hidden'));
  group.querySelector('input,select')?.classList.remove('has-error');
}

/**
 * Validate the entire form. Returns true if valid.
 */
function validateForm(form) {
  let valid = true;

  // Name
  const nameGroup = form.querySelector('.lead-form__group--name');
  const nameInput = nameGroup?.querySelector('input');
  if (nameInput) {
    const nameRegex = /^[a-zA-Z][a-zA-Z .'-]{1,48}[a-zA-Z .'-]$/;
    if (!nameInput.value.trim()) {
      showError(nameGroup, 'empty');
      valid = false;
    } else if (!nameRegex.test(nameInput.value.trim())) {
      showError(nameGroup, 'invalid');
      valid = false;
    } else {
      clearError(nameGroup);
    }
  }

  // Mobile
  const mobileGroup = form.querySelector('.lead-form__group--mobile');
  const mobileInput = mobileGroup?.querySelector('input[name="mobileNo"]');
  const countrySelect = mobileGroup?.querySelector('select');
  if (mobileInput) {
    const isIndia = !countrySelect || countrySelect.value === '+91';
    const indiaRegex = /^(?!([6-9])\1{9})[6-9](?:(\d)(?!\2{9})){9}$/;
    const foreignRegex = /^\d{5,15}$/;
    const val = mobileInput.value.trim();
    if (!val) {
      showError(mobileGroup, 'empty');
      valid = false;
    } else if (isIndia && !indiaRegex.test(val)) {
      showError(mobileGroup, 'invalid');
      valid = false;
    } else if (!isIndia && !foreignRegex.test(val)) {
      showError(mobileGroup, 'invalid');
      valid = false;
    } else {
      clearError(mobileGroup);
    }
  }

  // Email
  const emailGroup = form.querySelector('.lead-form__group--email');
  const emailInput = emailGroup?.querySelector('input');
  if (emailInput) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const val = emailInput.value.trim();
    if (!val) {
      showError(emailGroup, 'empty');
      valid = false;
    } else if (!emailRegex.test(val)) {
      showError(emailGroup, 'invalid');
      valid = false;
    } else {
      clearError(emailGroup);
    }
  }

  // Consent
  const consentWrapper = form.querySelector('.lead-form__consent');
  const consentInput = consentWrapper?.querySelector('input[type="checkbox"]');
  const consentError = consentWrapper?.querySelector('.lead-form__consent--error');
  if (consentInput && !consentInput.checked) {
    if (consentError) consentError.classList.remove('hidden');
    valid = false;
  } else if (consentError) {
    consentError.classList.add('hidden');
  }

  return valid;
}

/**
 * Show the success state after submission.
 */
function showSuccess(wrapper) {
  wrapper.innerHTML = `
    <div class="lead-form__success" role="alert">
      <div class="lead-form__success--icon">✓</div>
      <h3 class="lead-form__success--title">Thank You!</h3>
      <p class="lead-form__success--msg">We have received your details. Our team will get in touch with you shortly.</p>
    </div>
  `;
}

/**
 * Build and return the country code <select>.
 */
function buildCountrySelect() {
  const select = document.createElement('select');
  select.name = 'countryCode';
  select.className = 'lead-form__country-select';
  select.setAttribute('aria-label', 'Country code');

  COUNTRY_CODES.forEach(({ code, label, default: isDefault }) => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = label;
    if (isDefault) opt.selected = true;
    select.appendChild(opt);
  });

  return select;
}

/**
 * Wire up consent "Read more / Read less" toggle.
 */
function initConsentToggle(consentWrapper) {
  const label = consentWrapper.querySelector('.lead-form__consent--label');
  const expandBtn = consentWrapper.querySelector('.lead-form__consent--expand');
  const collapseBtn = consentWrapper.querySelector('.lead-form__consent--collapse');

  if (expandBtn && collapseBtn && label) {
    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      label.classList.add('expanded');
      expandBtn.classList.add('hidden');
      collapseBtn.classList.remove('hidden');
    });
    collapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      label.classList.remove('expanded');
      collapseBtn.classList.add('hidden');
      expandBtn.classList.remove('hidden');
    });
  }

  // Clicking anywhere on consent wrapper toggles checkbox
  const checkbox = consentWrapper.querySelector('input[type="checkbox"]');
  const customCheck = consentWrapper.querySelector('.lead-form__consent--checkbox');
  if (customCheck && checkbox) {
    customCheck.addEventListener('click', () => {
      checkbox.checked = !checkbox.checked;
      customCheck.classList.toggle('checked', checkbox.checked);
    });
  }
}

/**
 * Build the full form HTML structure.
 */
function buildForm(config) {
  const heading = config.heading || "Secure Your Family's Future with the Right Life Insurance Plan";
  const ctaText = config['cta-text'] || 'Check Your Premium';
  const ctaUrl = config['cta-url'] || 'https://www.canarahsbclife.com/life-insurance-plans';
  const productName = config['product-name'] || 'Term';
  const productCategory = config['product-category'] || 'Life Insurance';
  const sectionName = config['section-name'] || 'Blogs - Life Insurance';

  const wrapper = document.createElement('div');
  wrapper.className = 'lead-form__wrapper';

  wrapper.innerHTML = `
    <div class="lead-form__container">
      <div class="lead-form__main">
        <div class="lead-form__content">
          <h3 class="lead-form__heading">${heading}</h3>
          <form class="lead-form__form" novalidate>

            <!-- Hidden fields -->
            <input type="hidden" name="allowUtmParam" value="false"/>
            <input type="hidden" name="isISNPRedirection" value="false"/>
            <input type="hidden" name="isCLPRedirection" value="false"/>
            <input type="hidden" name="productName" value="${productName}"/>
            <input type="hidden" name="productCategory" value="${productCategory}"/>
            <input type="hidden" name="Website_Section_Name" value="${sectionName}"/>
            <input type="hidden" name="utmCohort" value="Organic_Term"/>

            <!-- Full Name -->
            <div class="lead-form__group lead-form__group--name">
              <label class="lead-form__label" for="lf-name">
                Full Name<span class="lead-form__required" aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                id="lf-name"
                class="lead-form__input"
                placeholder="Enter your name"
                name="name"
                minlength="3"
                maxlength="50"
                autocomplete="name"
                required
              />
              <span class="lead-form__error lead-form__error--invalid hidden" aria-live="polite">Please enter correct name</span>
              <span class="lead-form__error lead-form__error--empty hidden" aria-live="polite">Please enter the Full name</span>
            </div>

            <!-- Mobile Number -->
            <div class="lead-form__group lead-form__group--mobile">
              <label class="lead-form__label" for="lf-mobile">
                Mobile Number<span class="lead-form__required" aria-hidden="true">*</span>
              </label>
              <div class="lead-form__mobile-row">
                <div class="lead-form__country-wrapper"></div>
                <input
                  type="tel"
                  id="lf-mobile"
                  class="lead-form__input lead-form__input--mobile"
                  placeholder="Enter your mobile number"
                  name="mobileNo"
                  maxlength="15"
                  autocomplete="tel-national"
                  required
                />
              </div>
              <span class="lead-form__error lead-form__error--invalid hidden" aria-live="polite">Please enter valid mobile number</span>
              <span class="lead-form__error lead-form__error--empty hidden" aria-live="polite">Please enter Mobile Number</span>
            </div>

            <!-- Email -->
            <div class="lead-form__group lead-form__group--email lead-form__group--full">
              <label class="lead-form__label" for="lf-email">
                Email<span class="lead-form__required" aria-hidden="true">*</span>
              </label>
              <input
                type="email"
                id="lf-email"
                class="lead-form__input"
                placeholder="Enter your email"
                name="emaiID"
                autocomplete="email"
                required
              />
              <span class="lead-form__error lead-form__error--invalid hidden" aria-live="polite">Please enter valid email</span>
              <span class="lead-form__error lead-form__error--empty hidden" aria-live="polite">Please enter Email</span>
            </div>

            <!-- Consent -->
            <div class="lead-form__consent lead-form__group--full">
              <input
                type="checkbox"
                class="lead-form__consent--input"
                id="lf-consent"
                name="consent"
                checked
                required
              />
              <div class="lead-form__consent--checkbox checked" role="checkbox" aria-checked="true" aria-labelledby="lf-consent-label" tabindex="0">
                <svg class="lead-form__consent--check-icon" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <label class="lead-form__consent--label" id="lf-consent-label">
                <span class="lead-form__consent--text">I agree that even if my contact number is registered with NDNC / NCPR, I would still want the Company to contact me on the given number and email id for the clarifications/product information sought by me and agree that I have read and understood the Privacy Policy and agree to abide by the same.</span>
                <button type="button" class="lead-form__consent--expand">...&nbsp;<span class="lead-form__consent--expand-text">Read more</span></button>
                <button type="button" class="lead-form__consent--collapse hidden">...&nbsp;<span>Read less</span></button>
              </label>
              <span class="lead-form__consent--error hidden" aria-live="polite">Consent is required</span>
            </div>

            <!-- Submit -->
            <div class="lead-form__submit-wrapper lead-form__group--full">
              <button type="submit" class="lead-form__submit">
                <a href="${ctaUrl}" class="lead-form__submit--link" target="_self" rel="noopener noreferrer" data-url="${ctaUrl}">
                  <span class="lead-form__submit--text">${ctaText}</span>
                  <span class="lead-form__submit--icon" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </a>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  `;

  // Inject country code select
  const countryWrapper = wrapper.querySelector('.lead-form__country-wrapper');
  countryWrapper.appendChild(buildCountrySelect());

  return wrapper;
}

/**
 * Wire up form interactions.
 */
function initFormInteractions(wrapper) {
  const form = wrapper.querySelector('.lead-form__form');
  if (!form) return;

  // Consent toggle
  initConsentToggle(wrapper.querySelector('.lead-form__consent'));

  // Real-time clear errors on input
  form.querySelectorAll('.lead-form__input').forEach((input) => {
    input.addEventListener('input', () => {
      clearError(input.closest('.lead-form__group'));
    });
  });

  // Country code change — re-evaluate mobile regex
  const countrySelect = form.querySelector('.lead-form__country-select');
  if (countrySelect) {
    countrySelect.addEventListener('change', () => {
      const mobileGroup = form.querySelector('.lead-form__group--mobile');
      clearError(mobileGroup);
    });
  }

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = validateForm(form);
    if (!valid) return;

    // Get redirect URL from the link inside submit button
    const redirectLink = form.querySelector('.lead-form__submit--link');
    const redirectUrl = redirectLink?.dataset.url || redirectLink?.href || '#';

    // Show success state
    showSuccess(wrapper);

    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 800);
  });
}

export default function decorate(block) {
  // Parse authoring config from block table rows
  const config = parseConfig(block);

  // Clear the block and inject the form
  block.innerHTML = '';
  const formWrapper = buildForm(config);
  block.appendChild(formWrapper);

  // Wire up interactions
  initFormInteractions(block);
}
