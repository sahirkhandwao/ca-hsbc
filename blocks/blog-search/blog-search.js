function readField(block, index, fallback) {
  const row = block.children[index];
  const value = row ? row.textContent.trim() : '';
  return value || fallback;
}

function getTargetCards() {
  return [
    ...document.querySelectorAll('.blog-cards .blog-cards-grid li.blog-cards-card'),
    ...document.querySelectorAll('.cards.blog-card > ul > li'),
  ];
}

function getCardText(li) {
  return li.textContent.toLowerCase();
}

function getCardYear(li) {
  const dateEl = li.querySelector('.blog-cards-meta-item span, .cards-card-meta span');
  const text = dateEl ? dateEl.textContent : li.querySelector('.blog-cards-meta, .cards-card-meta')?.textContent || '';

  // Full 4-digit year
  const full = text.match(/\b(20\d{2})\b/);
  if (full) return full[1];

  // Short year like '26
  const short = text.match(/[''`](\d{2})\b/);
  if (short) return `20${short[1]}`;

  return '';
}

function applyFilters(query, year) {
  const q = query.trim().toLowerCase();
  getTargetCards().forEach((li) => {
    const matchesText = !q || getCardText(li).includes(q);
    const matchesYear = !year || year === 'all' || getCardYear(li) === year;
    // eslint-disable-next-line no-param-reassign
    li.hidden = !(matchesText && matchesYear);
  });
}


function deriveYears(fallbackList) {
  const years = new Set();
  getTargetCards().forEach((li) => {
    const y = getCardYear(li);
    if (y) years.add(y);
  });
  const derived = [...years].sort((a, b) => b - a);
  return derived.length ? derived : fallbackList;
}

export default function decorate(block) {
  const searchLabel = readField(block, 0, 'Search');
  const searchPlaceholder = readField(block, 1, 'Search by name, category, author');
  const yearLabel = readField(block, 2, 'Select Year');
  const yearsRaw = readField(block, 3, '');
  const fallbackYears = yearsRaw
    .split(',')
    .map((y) => y.trim())
    .filter(Boolean);

  // Filter SVG icon (3-line filter icon matching Canara design)
  const filterIconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
      <circle cx="7" cy="3" r="2.2" fill="#00adef"/>
      <circle cx="17" cy="9" r="2.2" fill="#00adef"/>
      <circle cx="7" cy="15" r="2.2" fill="#00adef"/>
      <path d="M3 3h2M9.5 3H21M3 9h11.5M19.5 9H21M3 15h2M9.5 15H21" stroke="#00adef" stroke-width="1.6" stroke-linecap="round"/>
    </svg>`;

  // Search icon SVG
  const searchIconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6.25" stroke="#00adef" stroke-width="1.5"/>
      <path d="m17 17-3.5-3.5" stroke="#00adef" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;

  // Down arrow SVG for select
  const downArrowSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
      <path d="M1 1l5 5 5-5" stroke="#00adef" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  // Close icon SVG
  const closeIconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M1 1l16 16M17 1L1 17" stroke="#00adef" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;

  const modalId = 'blog-search-filter-modal';

  block.innerHTML = `
    <div class="blog-search-row">

      <div class="blog-search-field blog-search-field--input">
        <label class="blog-search-label" for="blog-search-input">${searchLabel}</label>
        <div class="blog-search-input-wrap">
          <input
            id="blog-search-input"
            class="blog-search-input"
            type="search"
            placeholder="${searchPlaceholder}"
            autocomplete="off"
          />
          <button type="button" class="blog-search-submit" aria-label="${searchLabel}">
            ${searchIconSVG}
          </button>
        </div>
      </div>

      <div class="blog-search-field blog-search-field--year blog-search-field--desktop">
        <label class="blog-search-label" for="blog-search-year">${yearLabel}</label>
        <div class="blog-search-select-wrap">
          <select id="blog-search-year" class="blog-search-select">
            <option value="all">All Years</option>
          </select>
          ${downArrowSVG}
        </div>
      </div>

      <div class="blog-search-field blog-search-field--mobile-filter">
        <div class="blog-search-filter-btn" role="button" aria-haspopup="dialog" aria-controls="${modalId}" tabindex="0" aria-label="Filter by year">
          ${filterIconSVG}
        </div>
      </div>

    </div>

    <div class="blog-search-modal" id="${modalId}" role="dialog" aria-modal="true" aria-label="Filter" hidden>
      <div class="blog-search-modal-backdrop"></div>
      <div class="blog-search-modal-panel">
        <div class="blog-search-modal-header">
          <span class="blog-search-modal-title">${yearLabel}</span>
          <button type="button" class="blog-search-modal-close" aria-label="Close">
            ${closeIconSVG}
          </button>
        </div>
        <div class="blog-search-modal-body">
          <div class="blog-search-select-wrap">
            <select id="blog-search-year-modal" class="blog-search-select">
              <option value="all">All Years</option>
            </select>
            ${downArrowSVG}
          </div>
        </div>
      </div>
    </div>
  `;

  const input = block.querySelector('#blog-search-input');
  const desktopSelect = block.querySelector('#blog-search-year');
  const modalSelect = block.querySelector('#blog-search-year-modal');
  const submitBtn = block.querySelector('.blog-search-submit');
  const filterBtn = block.querySelector('.blog-search-filter-btn');
  const modal = block.querySelector(`#${modalId}`);
  const modalClose = block.querySelector('.blog-search-modal-close');
  const backdrop = block.querySelector('.blog-search-modal-backdrop');

  /** Populate year options in both selects */
  function populateYears(years) {
    [desktopSelect, modalSelect].forEach((sel) => {
      // keep the "All Years" option
      while (sel.options.length > 1) sel.remove(1);
      years.forEach((y) => {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        sel.append(opt);
      });
    });
  }

  /** Run filters using active values from desktop or modal select */
  function run() {
    const year = desktopSelect.value;
    applyFilters(input.value, year);
  }

  /** Keep desktop and modal selects in sync */
  function syncSelects(sourceId) {
    const val = sourceId === 'desktop' ? desktopSelect.value : modalSelect.value;
    desktopSelect.value = val;
    modalSelect.value = val;
  }

  // Open modal
  function openModal() {
    modal.hidden = false;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  // Close modal
  function closeModal() {
    modal.classList.remove('is-open');
    modal.hidden = true;
    document.body.style.overflow = '';
    filterBtn.focus();
  }

  // Events
  input.addEventListener('input', run);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); run(); }
  });
  submitBtn.addEventListener('click', run);

  desktopSelect.addEventListener('change', () => {
    syncSelects('desktop');
    run();
  });

  modalSelect.addEventListener('change', () => {
    syncSelects('modal');
    run();
    closeModal();
  });

  filterBtn.addEventListener('click', openModal);
  filterBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
  });
  modalClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Populate years — try immediately, then retry once cards load (async block)
  function tryPopulate() {
    const years = deriveYears(fallbackYears);
    populateYears(years);
  }

  tryPopulate();

  // If blog-cards block is async, retry after a short delay to pick up its rendered cards
  setTimeout(tryPopulate, 2000);
}
