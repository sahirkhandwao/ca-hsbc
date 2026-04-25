import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const titleRow = rows[0];
  const itemsRow = rows[1];
  const imageRow = rows[2];
  const imageAltRow = rows[3];
  const imageLinkRow = rows[4];
  const iconRow = rows[5];
  const iconAltRow = rows[6];

  const layout = document.createElement('div');
  layout.className = 'glossary-layout';

  const main = document.createElement('div');
  main.className = 'glossary-main';

  // Authorable icon: read from row, expose URL via CSS custom property
  const iconImg = iconRow?.querySelector('img');
  const iconSrc = iconImg?.getAttribute('src');
  if (iconSrc) {
    main.style.setProperty('--glossary-icon-url', `url("${iconSrc}")`);
    const iconAlt = iconAltRow?.textContent?.trim();
    if (iconAlt) main.setAttribute('data-icon-alt', iconAlt);
  }

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
  block.append(layout);
}
