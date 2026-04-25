import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Find rows that hold picture elements (right image + icon)
  const pictureRows = rows.filter((r) => r.querySelector('picture'));
  const [imageRow, iconRow] = pictureRows;

  // Remaining (non-picture) rows in document order:
  // [title, items, imageAlt, imageLink, iconAlt]
  const textRows = rows.filter((r) => !r.querySelector('picture'));
  const [titleRow, itemsRow, imageAltRow, imageLinkRow, iconAltRow] = textRows;

  const layout = document.createElement('div');
  layout.className = 'glossary-layout';

  const main = document.createElement('div');
  main.className = 'glossary-main';

  // Authorable icon: render only when an Icon image is authored
  const iconPicture = iconRow?.querySelector('picture');
  if (iconPicture) {
    const iconWrap = document.createElement('div');
    iconWrap.className = 'glossary-icon';
    const iconAlt = iconAltRow?.textContent?.trim() || '';
    const iconImg = iconPicture.querySelector('img');
    if (iconImg && iconAlt) iconImg.alt = iconAlt;
    iconWrap.append(iconPicture);
    moveInstrumentation(iconRow, iconWrap);
    main.append(iconWrap);
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
