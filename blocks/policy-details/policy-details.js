import { moveInstrumentation } from '../../scripts/scripts.js';

const PREV_ICON = `
  <svg class="policy-details-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="#00adef" stroke-width="1.5"/>
    <path d="M13.5 8L10 12l3.5 4" stroke="#00adef" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

const NEXT_ICON = `
  <svg class="policy-details-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="#00adef" stroke-width="1.5"/>
    <path d="M10.5 8l3.5 4-3.5 4" stroke="#00adef" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

function readCell(row) {
  if (!row) return null;
  return row.querySelector(':scope > div') || row;
}

function cellText(cell) {
  return cell?.textContent?.trim() || '';
}

function cellHref(cell) {
  if (!cell) return '';
  const a = cell.querySelector('a');
  if (a) return a.getAttribute('href') || '';
  const t = cellText(cell);
  return /^(https?:|\/|#|mailto:|tel:)/.test(t) ? t : '';
}

function parseGroup(cells) {
  // cells: 4 rows for one side (image / alt / title / link) — any order
  const pictureCell = cells.find((c) => c?.querySelector('picture'));
  const linkCell = cells.find((c) => c && c !== pictureCell && cellHref(c));
  const textCells = cells.filter((c) => c && c !== pictureCell && c !== linkCell);
  return {
    picture: pictureCell?.querySelector('picture') || null,
    alt: cellText(textCells[0]),
    title: cellText(textCells[1]) || cellText(textCells[0]),
    href: cellHref(linkCell) || '#',
  };
}

export default function decorate(block) {
  const allRows = [...block.children].map(readCell);

  // If there are 9 rows, first is the optional text field.
  let textCell = null;
  let groupRows = allRows;
  if (allRows.length >= 9) {
    textCell = allRows[0];
    groupRows = allRows.slice(1);
  }

  const text = cellText(textCell);
  const prev = parseGroup(groupRows.slice(0, 4));
  const next = parseGroup(groupRows.slice(4, 8));

  // If the prev group has only alt (no title), promote alt to title.
  if (!prev.title && prev.alt) prev.title = prev.alt;
  if (!next.title && next.alt) next.title = next.alt;

  const buildCard = (data, variant) => {
    const a = document.createElement('a');
    a.className = `policy-details-card policy-details-card--${variant}`;
    a.href = data.href;

    const thumb = document.createElement('span');
    thumb.className = 'policy-details-thumb';
    if (data.picture) {
      const img = data.picture.querySelector('img');
      if (img && data.alt) img.alt = data.alt;
      thumb.append(data.picture);
    }

    const textEl = document.createElement('span');
    textEl.className = 'policy-details-text';
    textEl.innerHTML = `
      <span class="policy-details-label">
        ${variant === 'prev' ? PREV_ICON : ''}
        <span>${variant === 'prev' ? 'Previous' : 'Next'}</span>
        ${variant === 'next' ? NEXT_ICON : ''}
      </span>
      <span class="policy-details-title">${data.title}</span>
    `;

    if (variant === 'prev') {
      a.append(thumb, textEl);
    } else {
      a.append(textEl, thumb);
    }
    return a;
  };

  block.textContent = '';

  if (text) {
    const topEl = document.createElement('div');
    topEl.className = 'policy-details-text-top';
    topEl.textContent = text;
    block.append(topEl);
  }

  const wrap = document.createElement('div');
  wrap.className = 'policy-details-wrap';
  if (prev.title || prev.picture) wrap.append(buildCard(prev, 'prev'));
  if (next.title || next.picture) wrap.append(buildCard(next, 'next'));

  block.append(wrap);

  if (allRows[1]) moveInstrumentation(allRows[1], wrap.querySelector('.policy-details-card--prev') || wrap);
  if (allRows[5]) moveInstrumentation(allRows[5], wrap.querySelector('.policy-details-card--next') || wrap);
}
