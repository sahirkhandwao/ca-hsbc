import { moveInstrumentation } from '../../scripts/scripts.js';

const META_HTML = `
  <div class="carousel-meta">
    <span class="carousel-meta-item">
      <span class="icon icon-calendar"></span>
      <span>29 Jan '25</span>
    </span>
    <span class="carousel-meta-item">
      <span class="icon icon-eye"></span>
      <span>5950 Views</span>
    </span>
    <span class="carousel-meta-item">
      <span class="icon icon-clock"></span>
      <span>8 minute read</span>
    </span>
  </div>
`;

function parseSlide(row) {
  const picture = row.querySelector('picture');
  const h = row.querySelector('h1, h2, h3, h4, h5, h6');
  const title = h ? h.textContent.trim() : '';
  const paragraphs = [...row.querySelectorAll('p')];
  const linkPara = paragraphs.find((p) => p.querySelector('a'));
  const descPara = paragraphs.find((p) => !p.querySelector('a'));
  const description = descPara ? descPara.textContent.trim() : '';
  const link = linkPara ? linkPara.querySelector('a') : null;
  const href = link ? link.getAttribute('href') : '#';
  const linkText = link ? link.textContent.trim() : 'Read More';
  return {
    picture, title, description, href, linkText,
  };
}

function setActive(block, index) {
  const slides = block.querySelectorAll('.carousel-slide');
  const thumbs = block.querySelectorAll('.carousel-thumb');
  if (!slides.length) return;
  const i = (index + slides.length) % slides.length;
  slides.forEach((s, idx) => s.classList.toggle('is-active', idx === i));
  thumbs.forEach((t, idx) => {
    t.classList.toggle('is-active', idx === i);
    t.setAttribute('aria-current', idx === i ? 'true' : 'false');
  });
  block.dataset.activeSlide = i;
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const data = rows.map((row) => ({ row, ...parseSlide(row) }));

  const slidesHtml = data.map((d, idx) => `
    <div class="carousel-slide${idx === 0 ? ' is-active' : ''}" data-slide-index="${idx}">
      <div class="carousel-slide-image">${d.picture ? d.picture.outerHTML : ''}</div>
      <div class="carousel-slide-info">
        <h3 class="carousel-slide-title">${d.title}</h3>
        ${META_HTML}
        <p class="carousel-slide-desc">${d.description}</p>
        <a class="carousel-slide-link" href="${d.href}">${d.linkText}</a>
      </div>
    </div>
  `).join('');

  const thumbsHtml = data.map((d, idx) => `
    <button type="button" class="carousel-thumb${idx === 0 ? ' is-active' : ''}" data-slide-index="${idx}" aria-current="${idx === 0}">
      <span class="carousel-thumb-image">${d.picture ? d.picture.outerHTML : ''}</span>
      <span class="carousel-thumb-title">${d.title}</span>
    </button>
  `).join('');

  block.innerHTML = `
    <div class="carousel-stage">
      <div class="carousel-slides">${slidesHtml}</div>
      <button type="button" class="carousel-nav carousel-prev" aria-label="Previous Slide">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 12 6 8l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button type="button" class="carousel-nav carousel-next" aria-label="Next Slide">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 4 4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
    <div class="carousel-thumbs">${thumbsHtml}</div>
  `;

  data.forEach(({ row }, idx) => {
    const slide = block.querySelectorAll('.carousel-slide')[idx];
    if (slide) moveInstrumentation(row, slide);
    row.remove();
  });

  block.querySelectorAll('.carousel-thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      setActive(block, parseInt(thumb.dataset.slideIndex, 10));
    });
  });
  block.querySelector('.carousel-prev').addEventListener('click', () => {
    setActive(block, parseInt(block.dataset.activeSlide || 0, 10) - 1);
  });
  block.querySelector('.carousel-next').addEventListener('click', () => {
    setActive(block, parseInt(block.dataset.activeSlide || 0, 10) + 1);
  });

  block.dataset.activeSlide = 0;

  import('../../scripts/aem.js').then(({ decorateIcons }) => decorateIcons(block));
}
