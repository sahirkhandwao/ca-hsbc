const SOURCE = '/static-html/footer.html';

/* ─── Accordion / Collapse helper ─────────────────────────────────────────── */

/**
 * Toggle a Bootstrap-style collapse panel natively (no Bootstrap JS needed).
 * @param {Element} btn   - the trigger button / span
 * @param {Element} panel - the target `.accordion-collapse` element
 */
function toggleCollapse(btn, panel) {
  const isOpen = panel.classList.contains('show');

  if (isOpen) {
    // Animate close
    panel.style.maxHeight = `${panel.scrollHeight}px`;
    // eslint-disable-next-line no-unused-expressions
    panel.offsetHeight; // force reflow
    panel.style.maxHeight = '0';
    panel.style.overflow = 'hidden';

    panel.addEventListener(
      'transitionend',
      () => {
        panel.classList.remove('show');
        panel.classList.add('collapse');
        panel.removeAttribute('style');
        btn.classList.add('collapsed');
        btn.setAttribute('aria-expanded', 'false');
      },
      { once: true },
    );
  } else {
    // Animate open
    panel.classList.remove('collapse');
    panel.classList.add('show');
    panel.style.overflow = 'hidden';
    panel.style.maxHeight = '0';
    // eslint-disable-next-line no-unused-expressions
    panel.offsetHeight; // force reflow
    panel.style.maxHeight = `${panel.scrollHeight}px`;
    panel.style.transition = 'max-height 280ms ease';

    panel.addEventListener(
      'transitionend',
      () => {
        panel.removeAttribute('style');
        btn.classList.remove('collapsed');
        btn.setAttribute('aria-expanded', 'true');
      },
      { once: true },
    );
  }
}

/**
 * Wire up all elements with [data-bs-toggle="collapse"][data-bs-target]
 * within a root element.
 * @param {Element} root
 */
function initAllCollapses(root) {
  const triggers = root.querySelectorAll('[data-bs-toggle="collapse"][data-bs-target]');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetSelector = trigger.getAttribute('data-bs-target');
      if (!targetSelector) return;

      // Support both #id and .class selectors
      const panel = root.querySelector(targetSelector)
        || document.querySelector(targetSelector);
      if (!panel) return;

      toggleCollapse(trigger, panel);
    });
  });
}

/* ─── Partner logo ticker ──────────────────────────────────────────────────── */

/**
 * Creates a pure CSS-driven infinite ticker for partner logos.
 * Clones the swiper-wrapper content so the scroll loops seamlessly.
 * @param {Element} swiperEl - `.swiper[data-ticker-direction]`
 */
function initTicker(swiperEl) {
  const direction = swiperEl.getAttribute('data-ticker-direction') || 'left';
  const wrapper = swiperEl.querySelector('.swiper-wrapper');
  if (!wrapper) return;

  // Clone slides for seamless loop
  const slides = Array.from(wrapper.querySelectorAll('.swiper-slide'));
  if (!slides.length) return;

  slides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    wrapper.appendChild(clone);
  });

  // Mark for CSS animation
  swiperEl.classList.add('ticker-initialized');
  swiperEl.setAttribute('data-direction', direction);

  // Total width = number of original slides × slide width (approximate)
  // CSS animation uses translateX(-50%) to scroll one "set" of slides
  wrapper.classList.add('ticker-track');
  if (direction === 'right') {
    wrapper.classList.add('ticker-track--right');
  }
}

/* ─── Footer interactions ──────────────────────────────────────────────────── */

function initFooterInteractions(block) {
  // ── 1–4. All accordion/collapse triggers (Bootstrap data-api pattern) ────
  // This handles:
  //   - Popular articles (#popular__article__section)
  //   - Disclaimer (#disclaimer__section)
  //   - Quick links (data-bs-target="#quickLinks-collapse-*")
  //   - Mobile link list (.popular__link__btn)
  initAllCollapses(block);

  // ── 5. Partner logo ticker ────────────────────────────────────────────────
  const tickers = block.querySelectorAll('.swiper[data-ticker-direction]');
  tickers.forEach(initTicker);
}

/* ─── Block entry point ────────────────────────────────────────────────────── */

export default async function decorate(block) {
  block.classList.add('loading');

  try {
    const resp = await fetch(SOURCE, { cache: 'force-cache' });
    if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);

    const html = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract section.footer__section
    const footerSection = doc.querySelector('section.footer__section');
    if (!footerSection) throw new Error('Could not find section.footer__section in source HTML');


    // Prepend domain to relative paths
    const domain = 'https://www.canarahsbclife.com';
    const attrs = ['src', 'href', 'xlink:href', 'srcset'];
    footerSection.querySelectorAll(attrs.map((attr) => `[${attr.replace(':', '\\:')}]`).join(', ')).forEach((el) => {
      attrs.forEach((attr) => {
        if (el.hasAttribute(attr)) {
          const val = el.getAttribute(attr);
          if (attr === 'srcset') {
            const newVal = val.split(',').map((part) => {
              const [url, ...rest] = part.trim().split(/\s+/);
              return (url.startsWith('/') && !url.startsWith('//'))
                ? [`${domain}${url}`, ...rest].join(' ')
                : part.trim();
            }).join(', ');
            el.setAttribute(attr, newVal);
          } else if (val.startsWith('/') && !val.startsWith('//')) {
            el.setAttribute(attr, `${domain}${val}`);
          }
        }
      });
    });

    block.innerHTML = '';
    block.appendChild(footerSection);

    // Wire up all interactions
    initFooterInteractions(block);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[footer block]', err);
    block.classList.add('error');
  } finally {
    block.removeAttribute('aria-busy');
    block.classList.remove('loading');
  }
}
