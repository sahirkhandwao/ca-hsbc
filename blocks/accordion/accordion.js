import { moveInstrumentation } from '../../scripts/scripts.js';

const INITIAL_VISIBLE = 5;
const STEP = 5;
const DURATION = 350;

function measure(body) {
  const cs = getComputedStyle(body);
  return {
    paddingTop: cs.paddingTop,
    paddingBottom: cs.paddingBottom,
    height: body.scrollHeight,
  };
}

function animateOpen(details, body) {
  details.setAttribute('open', '');
  const { paddingTop, paddingBottom, height } = measure(body);
  body.style.overflow = 'hidden';
  body.style.transition = 'none';
  body.style.maxHeight = '0px';
  body.style.paddingTop = '0px';
  body.style.paddingBottom = '0px';
  void body.offsetHeight;
  body.style.transition = `max-height ${DURATION}ms ease, padding ${DURATION}ms ease`;
  body.style.maxHeight = `${height}px`;
  body.style.paddingTop = paddingTop;
  body.style.paddingBottom = paddingBottom;
  const done = (e) => {
    if (e.target !== body || e.propertyName !== 'max-height') return;
    body.style.transition = '';
    body.style.maxHeight = '';
    body.style.overflow = '';
    body.style.paddingTop = '';
    body.style.paddingBottom = '';
    body.removeEventListener('transitionend', done);
  };
  body.addEventListener('transitionend', done);
}

function animateClose(details, body) {
  const { paddingTop, paddingBottom, height } = measure(body);
  body.style.overflow = 'hidden';
  body.style.transition = 'none';
  body.style.maxHeight = `${height}px`;
  body.style.paddingTop = paddingTop;
  body.style.paddingBottom = paddingBottom;
  void body.offsetHeight;
  body.style.transition = `max-height ${DURATION}ms ease, padding ${DURATION}ms ease`;
  body.style.maxHeight = '0px';
  body.style.paddingTop = '0px';
  body.style.paddingBottom = '0px';
  const done = (e) => {
    if (e.target !== body || e.propertyName !== 'max-height') return;
    details.removeAttribute('open');
    body.style.transition = '';
    body.style.maxHeight = '';
    body.style.overflow = '';
    body.style.paddingTop = '';
    body.style.paddingBottom = '';
    body.removeEventListener('transitionend', done);
  };
  body.addEventListener('transitionend', done);
}

function wireAnimation(details) {
  const summary = details.querySelector('summary');
  const body = details.querySelector('.accordion-item-body');
  if (!summary || !body) return;
  summary.addEventListener('click', (e) => {
    e.preventDefault();
    if (details.hasAttribute('open')) animateClose(details, body);
    else animateOpen(details, body);
  });
}

function renderFAQSchema(block) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [],
  };

  const items = [...block.querySelectorAll('.accordion-item')];
  items.forEach((item) => {
    const question = item.querySelector('.accordion-item-label');
    const answer = item.querySelector('.accordion-item-body');
    if (question && answer) {
      schema.mainEntity.push({
        '@type': 'Question',
        name: question.textContent.trim(),
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer.innerHTML.replace(/\s+/g, ' ').trim(),
        },
      });
    }
  });

  if (schema.mainEntity.length > 0) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.append(script);
  }
}

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

  block.querySelectorAll('.accordion-item').forEach(wireAnimation);

  const items = [...block.querySelectorAll('.accordion-item')];

  // Render FAQ Schema
  renderFAQSchema(block);

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
