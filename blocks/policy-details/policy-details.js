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

function readPicture(cell) {
  return cell?.querySelector('picture') || null;
}

function readText(cell) {
  return cell?.textContent?.trim() || '';
}

function readHref(cell) {
  return cell?.querySelector('a')?.getAttribute('href') || readText(cell) || '#';
}

export default function decorate(block) {
  const rows = [...block.children].map(readCell);
  const [
    prevImgCell,
    prevAltCell,
    prevTitleCell,
    prevLinkCell,
    nextImgCell,
    nextAltCell,
    nextTitleCell,
    nextLinkCell,
  ] = rows;

  const prev = {
    picture: readPicture(prevImgCell),
    alt: readText(prevAltCell),
    title: readText(prevTitleCell),
    href: readHref(prevLinkCell),
  };
  const next = {
    picture: readPicture(nextImgCell),
    alt: readText(nextAltCell),
    title: readText(nextTitleCell),
    href: readHref(nextLinkCell),
  };

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

    const text = document.createElement('span');
    text.className = 'policy-details-text';
    text.innerHTML = `
      <span class="policy-details-label">
        ${variant === 'prev' ? PREV_ICON : ''}
        <span>${variant === 'prev' ? 'Previous' : 'Next'}</span>
        ${variant === 'next' ? NEXT_ICON : ''}
      </span>
      <span class="policy-details-title">${data.title}</span>
    `;

    if (variant === 'prev') {
      a.append(thumb, text);
    } else {
      a.append(text, thumb);
    }
    return a;
  };

  block.textContent = '';

  const wrap = document.createElement('div');
  wrap.className = 'policy-details-wrap';
  if (prev.title || prev.picture) wrap.append(buildCard(prev, 'prev'));
  if (next.title || next.picture) wrap.append(buildCard(next, 'next'));

  block.append(wrap);

  // restore instrumentation on each half-row to keep author edit hooks intact
  if (rows[0]) moveInstrumentation(rows[0], wrap.querySelector('.policy-details-card--prev') || wrap);
  if (rows[4]) moveInstrumentation(rows[4], wrap.querySelector('.policy-details-card--next') || wrap);
}
