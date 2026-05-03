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
    // Animate close — transition must be set before maxHeight changes
    panel.style.transition = 'max-height 300ms ease';
    panel.style.overflow = 'hidden';
    panel.style.maxHeight = `${panel.scrollHeight}px`;
    panel.offsetHeight; // force reflow so browser registers the start value
    panel.style.maxHeight = '0';

    const onEnd = () => {
      panel.classList.remove('show');
      panel.classList.add('collapse');
      panel.removeAttribute('style');
      btn.classList.add('collapsed');
      btn.setAttribute('aria-expanded', 'false');
      panel.removeEventListener('transitionend', onEnd);
    };
    panel.addEventListener('transitionend', onEnd);
  } else {
    // Animate open
    panel.classList.remove('collapse');
    panel.classList.add('show');
    panel.style.overflow = 'hidden';
    panel.style.transition = 'max-height 300ms ease';
    panel.style.maxHeight = '0';
    panel.offsetHeight; // force reflow so browser registers the start value
    panel.style.maxHeight = `${panel.scrollHeight}px`;

    const onEnd = () => {
      panel.removeAttribute('style');
      btn.classList.remove('collapsed');
      btn.setAttribute('aria-expanded', 'true');
      panel.removeEventListener('transitionend', onEnd);
    };
    panel.addEventListener('transitionend', onEnd);
  }
}

/**
 * Wire up desktop quick links as tabs — one panel open at a time.
 * First tab is open by default on load.
 * @param {Element} root
 */
function initQuickLinksTabs(root) {
  const desktopEl = root.querySelector('.quick__links__desktop');
  if (!desktopEl) return;

  const buttons = Array.from(desktopEl.querySelectorAll('.quick__Link__btn[data-bs-target]'));

  const getPanel = (btn) => {
    const id = btn.getAttribute('data-bs-target').slice(1);
    return root.querySelector(`[id="${id}"]`);
  };

  const closeTab = (btn, panel) => {
    if (!panel) return;
    panel.classList.remove('show');
    panel.classList.add('collapse');
    btn.classList.add('collapsed');
    btn.setAttribute('aria-expanded', 'false');
  };

  const openTab = (btn, panel) => {
    if (!panel) return;
    panel.classList.remove('collapse');
    panel.classList.add('show');
    btn.classList.remove('collapsed');
    btn.setAttribute('aria-expanded', 'true');
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const panel = getPanel(btn);
      const isOpen = panel && panel.classList.contains('show');

      // Close all tabs
      buttons.forEach((b) => closeTab(b, getPanel(b)));

      // If this tab was closed, open it; if it was already open, leave all closed
      if (!isOpen) openTab(btn, panel);
    });
  });

  // Open first tab by default on load
  if (buttons.length > 0) openTab(buttons[0], getPanel(buttons[0]));
}

/**
 * Wire up all non-quick-links collapse triggers within a root element.
 * @param {Element} root
 */
function initAllCollapses(root) {
  const triggers = root.querySelectorAll('[data-bs-toggle="collapse"][data-bs-target]');

  triggers.forEach((trigger) => {
    // Quick links desktop tabs are handled by initQuickLinksTabs
    if (trigger.closest('.quick__links__desktop')) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSelector = trigger.getAttribute('data-bs-target');
      if (!targetSelector) return;

      // Robust ID selection, especially for numeric IDs like #1, #2
      let panel;
      if (targetSelector.startsWith('#')) {
        const id = targetSelector.slice(1);
        panel = root.querySelector(`[id="${id}"]`) || document.getElementById(id);
      } else {
        panel = root.querySelector(targetSelector) || document.querySelector(targetSelector);
      }

      if (!panel) return;

      // Mobile quick links mob: IDs #1–#4 clash with linklist mob IDs.
      // Search within the closest accordion-item to get the right panel,
      // and close all other open panels (one-open-at-a-time behaviour).
      if (trigger.closest('.quick__links__mob')) {
        const mobEl = trigger.closest('.quick__links__mob');
        const closestItem = trigger.closest('.heading_icon_wrapper') || trigger.closest('.accordion-item');
        const localPanel = closestItem
          ? closestItem.querySelector(`[id="${targetSelector.slice(1)}"]`)
          : panel;
        const targetPanel = localPanel || panel;
        const isOpen = targetPanel.classList.contains('show');

        // Close all other open panels in the mob section
        mobEl.querySelectorAll('.accordion-collapse.show').forEach((openPanel) => {
          if (openPanel !== targetPanel) {
            openPanel.classList.remove('show');
            openPanel.classList.add('collapse');
            // Reset the corresponding button
            const siblingBtn = openPanel.closest('.heading_icon_wrapper')
              && openPanel.closest('.heading_icon_wrapper').querySelector('.quick__Link__btn');
            if (siblingBtn) {
              siblingBtn.classList.add('collapsed');
              siblingBtn.setAttribute('aria-expanded', 'false');
            }
          }
        });

        // Toggle the clicked panel
        if (isOpen) {
          targetPanel.classList.remove('show');
          targetPanel.classList.add('collapse');
          trigger.classList.add('collapsed');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          targetPanel.classList.remove('collapse');
          targetPanel.classList.add('show');
          trigger.classList.remove('collapsed');
          trigger.setAttribute('aria-expanded', 'true');
        }
        return;
      }

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
  // ── Quick links desktop: tab switching (one panel open at a time) ─────────
  initQuickLinksTabs(block);

  // ── All other accordion/collapse triggers ─────────────────────────────────
  // Handles: popular articles, disclaimer, mobile quick links
  initAllCollapses(block);

  // ── Partner logo ticker ────────────────────────────────────────────────────
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
