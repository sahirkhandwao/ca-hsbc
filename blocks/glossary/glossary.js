import { moveInstrumentation } from '../../scripts/scripts.js';

const ICON_SVG = `
  <svg class="glossary-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="10" y="6" width="28" height="34" rx="2" stroke="#00adef" stroke-width="2"/>
    <path d="M16 14h14M16 20h14M16 26h10" stroke="#00adef" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="32" cy="32" r="6.5" fill="#ffffff" stroke="#00adef" stroke-width="2"/>
    <path d="m37 37 4 4" stroke="#00adef" stroke-width="2" stroke-linecap="round"/>
  </svg>
`;

export default function decorate(block) {
  const rows = [...block.children];
  const titleRow = rows[0];
  const itemsRow = rows[1];

  const inner = document.createElement('div');
  inner.className = 'glossary-inner';

  if (titleRow) {
    const titleEl = document.createElement('div');
    titleEl.className = 'glossary-title';
    const firstChild = titleRow.querySelector('div') || titleRow;
    titleEl.append(...firstChild.childNodes);
    moveInstrumentation(titleRow, titleEl);
    inner.append(titleEl);
  }

  if (itemsRow) {
    const itemsEl = document.createElement('div');
    itemsEl.className = 'glossary-items';
    const firstChild = itemsRow.querySelector('div') || itemsRow;
    itemsEl.append(...firstChild.childNodes);
    moveInstrumentation(itemsRow, itemsEl);
    inner.append(itemsEl);
  }

  block.textContent = '';
  block.innerHTML = ICON_SVG;
  block.append(inner);
}
