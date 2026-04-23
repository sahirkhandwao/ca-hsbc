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
  const imageRow = rows[2];
  const imageAltRow = rows[3];
  const imageLinkRow = rows[4];

  const layout = document.createElement('div');
  layout.className = 'glossary-layout';

  const main = document.createElement('div');
  main.className = 'glossary-main';

  if (titleRow) {
    const titleEl = document.createElement('div');
    titleEl.className = 'glossary-title';
    const firstChild = titleRow.querySelector('div') || titleRow;
    titleEl.append(...firstChild.childNodes);
    moveInstrumentation(titleRow, titleEl);
    main.append(titleEl);
  }

  if (itemsRow) {
    const itemsEl = document.createElement('div');
    itemsEl.className = 'glossary-items';
    const firstChild = itemsRow.querySelector('div') || itemsRow;
    itemsEl.append(...firstChild.childNodes);
    moveInstrumentation(itemsRow, itemsEl);
    main.append(itemsEl);
  }

  layout.append(main);

  const picture = imageRow?.querySelector('picture');
  if (picture) {
    const aside = document.createElement('div');
    aside.className = 'glossary-aside';

    const alt = imageAltRow?.textContent?.trim();
    const img = picture.querySelector('img');
    if (img && alt) img.alt = alt;

    const linkHref = imageLinkRow?.querySelector('a')?.getAttribute('href')
      || imageLinkRow?.textContent?.trim();
    if (linkHref) {
      const a = document.createElement('a');
      a.href = linkHref;
      a.className = 'glossary-aside-link';
      a.append(picture);
      aside.append(a);
    } else {
      aside.append(picture);
    }

    moveInstrumentation(imageRow, aside);
    layout.append(aside);
    block.classList.add('has-aside');
  }

  block.textContent = '';
  block.innerHTML = ICON_SVG;
  block.append(layout);
}
