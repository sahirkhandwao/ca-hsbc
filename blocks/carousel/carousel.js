import { moveInstrumentation } from '../../scripts/scripts.js';

const META_HTML = `
  <div class="carousel-meta">
    <div class="carousel-meta-item">
      <span class="icon icon-calendar"></span>
      <div>29 Jan '25</div>
    </div>
    <div class="carousel-meta-item">
      <span class="icon icon-eye"></span>
      <div>5950 Views</div>
    </div>
    <div class="carousel-meta-item">
      <span class="icon icon-clock"></span>
      <div>8 minute read</div>
    </div>
  </div>
`;

const MOBILE_QUERY = '(max-width: 767px)';

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

function isMobile() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function setActive(block, index) {
  const slides = [...block.querySelectorAll('.carousel-slide')];
  const thumbs = block.querySelectorAll('.carousel-thumb');
  if (!slides.length) return;
  const i = ((index % slides.length) + slides.length) % slides.length;
  slides.forEach((s, idx) => s.classList.toggle('is-active', idx === i));
  thumbs.forEach((t, idx) => {
    t.classList.toggle('is-active', idx === i);
    t.setAttribute('aria-current', idx === i ? 'true' : 'false');
  });
  block.dataset.activeSlide = i;

  if (isMobile()) {
    const container = block.querySelector('.carousel-slides');
    const active = slides[i];
    if (container && active) {
      const target = active.offsetLeft - (container.clientWidth - active.offsetWidth) / 2;
      container.scrollTo({ left: target, behavior: 'smooth' });
    }
  }
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
    <div role="button" tabindex="0" class="carousel-thumb${idx === 0 ? ' is-active' : ''}" data-slide-index="${idx}" aria-current="${idx === 0}">
      <div class="carousel-thumb-image">${d.picture ? d.picture.outerHTML : ''}</div>
      <div class="carousel-thumb-title">${d.title}</div>
    </div>
  `).join('');

  block.innerHTML = `
    <div class="carousel-stage">
      <div class="carousel-slides">${slidesHtml}</div>
      <button type="button" class="carousel-nav carousel-prev" aria-label="Previous Slide">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M14.5 7 10 12l4.5 5" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button type="button" class="carousel-nav carousel-next" aria-label="Next Slide">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9.5 7 14 12l-4.5 5" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
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
    const activate = () => setActive(block, parseInt(thumb.dataset.slideIndex, 10));
    thumb.addEventListener('click', activate);
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });

  block.querySelector('.carousel-prev').addEventListener('click', () => {
    setActive(block, parseInt(block.dataset.activeSlide || 0, 10) - 1);
  });
  block.querySelector('.carousel-next').addEventListener('click', () => {
    setActive(block, parseInt(block.dataset.activeSlide || 0, 10) + 1);
  });

  block.dataset.activeSlide = 0;

  // Track active slide from scroll position on mobile (swipe support)
  const container = block.querySelector('.carousel-slides');
  if (container) {
    let scrollTimer;
    container.addEventListener('scroll', () => {
      if (!isMobile()) return;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const slides = [...block.querySelectorAll('.carousel-slide')];
        const centerX = container.scrollLeft + container.clientWidth / 2;
        let closest = 0;
        let minDist = Infinity;
        slides.forEach((s, idx) => {
          const mid = s.offsetLeft + s.offsetWidth / 2;
          const dist = Math.abs(mid - centerX);
          if (dist < minDist) { minDist = dist; closest = idx; }
        });
        const current = parseInt(block.dataset.activeSlide || 0, 10);
        if (closest !== current) {
          const thumbs = block.querySelectorAll('.carousel-thumb');
          slides.forEach((s, idx) => s.classList.toggle('is-active', idx === closest));
          thumbs.forEach((t, idx) => {
            t.classList.toggle('is-active', idx === closest);
            t.setAttribute('aria-current', idx === closest ? 'true' : 'false');
          });
          block.dataset.activeSlide = closest;
        }
      }, 120);
    });
  }

  import('../../scripts/aem.js').then(({ decorateIcons }) => decorateIcons(block));
}
