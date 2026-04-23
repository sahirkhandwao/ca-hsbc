import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const titleRow = rows[0];
  const itemRows = rows.slice(1);

  const wrap = document.createElement('div');
  wrap.className = 'social-media-links-wrap';

  // Optional title
  if (titleRow) {
    const titleEl = document.createElement('div');
    titleEl.className = 'social-media-links-title';
    const firstChild = titleRow.querySelector('div') || titleRow;
    titleEl.append(...firstChild.childNodes);
    moveInstrumentation(titleRow, titleEl);
    if (titleEl.textContent.trim() || titleEl.querySelector('img,svg')) {
      wrap.append(titleEl);
    }
  }

  const list = document.createElement('ul');
  list.className = 'social-media-links-list';

  itemRows.forEach((row) => {
    const cells = [...row.children];
    // Detect cells by content rather than assuming index order, since
    // EDS can emit reference/aem-content fields in a different order
    // than declared in the model.
    const pictureCell = cells.find((c) => c.querySelector('picture'));
    const linkCell = cells.find((c) => c.querySelector('a'))
      || cells.find((c) => /^(https?:|\/|#)/.test((c.textContent || '').trim()));
    const textCells = cells.filter((c) => c !== pictureCell && c !== linkCell);
    // Remaining text cells are alt + label, in declared order.
    const imageAltCell = textCells[0];
    const labelCell = textCells[1];

    const picture = pictureCell?.querySelector('picture');
    const imageAlt = imageAltCell?.textContent?.trim() || '';
    const label = labelCell?.textContent?.trim() || '';
    const href = linkCell?.querySelector('a')?.getAttribute('href')
      || linkCell?.textContent?.trim()
      || '#';

    const li = document.createElement('li');
    li.className = 'social-media-link';
    moveInstrumentation(row, li);

    const a = document.createElement('a');
    a.className = 'social-media-link-anchor';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', label || imageAlt || 'Social link');

    const iconWrap = document.createElement('span');
    iconWrap.className = 'social-media-link-icon';
    if (picture) {
      const img = picture.querySelector('img');
      if (img && imageAlt) img.alt = imageAlt;
      iconWrap.append(picture);
    }
    a.append(iconWrap);

    if (label) {
      const labelEl = document.createElement('span');
      labelEl.className = 'social-media-link-label';
      labelEl.textContent = label;
      a.append(labelEl);
    }

    li.append(a);
    list.append(li);
  });

  wrap.append(list);
  block.textContent = '';
  block.append(wrap);
}
