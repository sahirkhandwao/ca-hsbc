function readField(block, index, fallback) {
  const row = block.children[index];
  const value = row ? row.textContent.trim() : '';
  return value || fallback;
}

function getTargetCards() {
  return [...document.querySelectorAll('.cards.blog-card > ul > li')];
}

function getCardText(li) {
  return li.textContent.toLowerCase();
}

function getCardYear(li) {
  const meta = li.querySelector('.cards-card-meta');
  if (!meta) return '';
  const match = meta.textContent.match(/\b(19|20)\d{2}\b/);
  if (match) return match[0];
  const shortMatch = meta.textContent.match(/['’](\d{2})\b/);
  if (shortMatch) return `20${shortMatch[1]}`;
  return '';
}

function applyFilters(query, year) {
  const q = query.trim().toLowerCase();
  getTargetCards().forEach((li) => {
    const matchesText = !q || getCardText(li).includes(q);
    const matchesYear = !year || getCardYear(li) === year;
    li.hidden = !(matchesText && matchesYear);
  });
}

export default function decorate(block) {
  const searchLabel = readField(block, 0, 'Search');
  const searchPlaceholder = readField(block, 1, 'Search by name, category, author');
  const yearLabel = readField(block, 2, 'Select Year');
  const yearsRaw = readField(block, 3, '');
  const years = yearsRaw
    .split(',')
    .map((y) => y.trim())
    .filter(Boolean);

  block.innerHTML = `
    <div class="blog-search-row">
      <div class="blog-search-field blog-search-field--input">
        <label class="blog-search-label" for="blog-search-input">${searchLabel}</label>
        <div class="blog-search-input-wrap">
          <input id="blog-search-input" class="blog-search-input" type="search" placeholder="${searchPlaceholder}" autocomplete="off" />
          <button type="button" class="blog-search-submit" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6.25" stroke="#00adef" stroke-width="1.5"/>
              <path d="m17 17-3.5-3.5" stroke="#00adef" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="blog-search-field blog-search-field--year">
        <label class="blog-search-label" for="blog-search-year">${yearLabel}</label>
        <div class="blog-search-select-wrap">
          <select id="blog-search-year" class="blog-search-select">
            <option value="">${years[0] || ''}</option>
            ${years.map((y) => `<option value="${y}">${y}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>
  `;

  const input = block.querySelector('#blog-search-input');
  const select = block.querySelector('#blog-search-year');
  const submit = block.querySelector('.blog-search-submit');

  const run = () => applyFilters(input.value, select.value);

  input.addEventListener('input', run);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run();
    }
  });
  submit.addEventListener('click', run);
  select.addEventListener('change', run);
}
