import { moveInstrumentation } from '../../scripts/scripts.js';

const INITIAL_VISIBLE = 5;
const STEP = 5;

export default function decorate(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    if (label) moveInstrumentation(label, summary);

    const body = row.children[1];
    body.className = 'accordion-item-body';
    if (row.children[1]) moveInstrumentation(row.children[1], body);

    const details = document.createElement('details');
    details.className = 'accordion-item';
    moveInstrumentation(row, details);
    details.append(summary, body);
    row.replaceWith(details);
  });

  const items = [...block.querySelectorAll('.accordion-item')];
  if (items.length <= INITIAL_VISIBLE) return;

  items.forEach((item, i) => {
    if (i >= INITIAL_VISIBLE) item.classList.add('is-hidden');
  });

  const loadMoreWrap = document.createElement('div');
  loadMoreWrap.className = 'accordion-loadmore-wrap';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'accordion-loadmore-btn';
  btn.textContent = 'Load More';
  loadMoreWrap.append(btn);
  block.append(loadMoreWrap);

  btn.addEventListener('click', () => {
    const hidden = items.filter((it) => it.classList.contains('is-hidden'));
    hidden.slice(0, STEP).forEach((it) => it.classList.remove('is-hidden'));
    if (items.every((it) => !it.classList.contains('is-hidden'))) {
      loadMoreWrap.remove();
    }
  });
}
