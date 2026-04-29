const SOURCE = '/static-html/header.html';

/* ─── Accordion / Collapse helper ─────────────────────────────────────────── */

/**
 * Toggle a Bootstrap-style collapse element.
 * @param {Element} btn   - the trigger button / span
 * @param {Element} panel - the `.accordion-collapse` panel
 */
function toggleCollapse(btn, panel) {
  const isOpen = !panel.classList.contains('collapse') || panel.classList.contains('show');

  if (isOpen) {
    panel.classList.remove('show');
    panel.classList.add('collapse');
    btn.classList.add('collapsed');
    btn.setAttribute('aria-expanded', 'false');
  } else {
    panel.classList.remove('collapse');
    panel.classList.add('show');
    btn.classList.remove('collapsed');
    btn.setAttribute('aria-expanded', 'true');
  }
}

/* ─── Header interactions ──────────────────────────────────────────────────── */

function initHeaderInteractions(block) {
  // ── 1. Hamburger menu open/close ────────────────────────────────────────
  const hamburgerBtn = block.querySelector('.header__hamburger--button');
  const hamburgerMenu = block.querySelector('.header__hamburger--menu');
  const hamburgerClose = block.querySelector('.header__hamburger--close-icon');
  const overlay = block.querySelector('.header__overlay');
  const header = block.querySelector('.header') || block.closest('.header-wrapper') || block;

  function openMenu() {
    header.classList.add('header--menu-open');
    if (hamburgerMenu) {
      hamburgerMenu.classList.add('open');
      hamburgerMenu.removeAttribute('hidden');
    }
    if (overlay) {
      overlay.classList.remove('d-none');
      overlay.classList.add('active');
    }
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    header.classList.remove('header--menu-open');
    if (hamburgerMenu) {
      hamburgerMenu.classList.remove('open');
    }
    if (overlay) {
      overlay.classList.add('d-none');
      overlay.classList.remove('active');
    }
    document.body.classList.remove('menu-open');
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMenu);
  if (hamburgerClose) hamburgerClose.closest('div, button, span, svg') && hamburgerClose.closest('[class*="close"]')
    ? hamburgerClose.closest('[class*="close"]').addEventListener('click', closeMenu)
    : hamburgerClose.addEventListener('click', closeMenu);

  // Also handle the close icon container
  const hamburgerHead = block.querySelector('.header__hamburger--head');
  if (hamburgerHead) {
    const closeBtn = hamburgerHead.querySelector('.header__hamburger--close-icon');
    if (closeBtn) {
      const closeTarget = closeBtn.closest('button') || closeBtn.closest('[role="button"]') || closeBtn;
      closeTarget.addEventListener('click', closeMenu);
    }
  }

  // ── 2. Overlay click closes menu ─────────────────────────────────────────
  if (overlay) overlay.addEventListener('click', closeMenu);

  // ── 3. Desktop dropdown nav (hover + click) ──────────────────────────────
  const navItems = block.querySelectorAll('.header__navbar--item');

  navItems.forEach((item) => {
    const dropdown = item.querySelector('.header__navbar--dropdown');
    if (!dropdown) return;

    let hoverTimer;

    item.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimer);
      // Close all other dropdowns first
      navItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('dropdown-open');
          const otherDrop = other.querySelector('.header__navbar--dropdown');
          if (otherDrop) otherDrop.classList.remove('show');
        }
      });
      item.classList.add('dropdown-open');
      dropdown.classList.add('show');
    });

    item.addEventListener('mouseleave', () => {
      hoverTimer = setTimeout(() => {
        item.classList.remove('dropdown-open');
        dropdown.classList.remove('show');
      }, 150);
    });

    // Also support keyboard/click on the link
    const link = item.querySelector('.header__navbar--link');
    if (link) {
      link.addEventListener('click', (e) => {
        // Only intercept if dropdown is present (acts as toggle on mobile / keyboard)
        if (window.innerWidth < 992) {
          e.preventDefault();
          const isOpen = item.classList.contains('dropdown-open');
          navItems.forEach((other) => {
            other.classList.remove('dropdown-open');
            const otherDrop = other.querySelector('.header__navbar--dropdown');
            if (otherDrop) otherDrop.classList.remove('show');
          });
          if (!isOpen) {
            item.classList.add('dropdown-open');
            dropdown.classList.add('show');
          }
        }
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) {
      navItems.forEach((item) => {
        item.classList.remove('dropdown-open');
        const dropdown = item.querySelector('.header__navbar--dropdown');
        if (dropdown) dropdown.classList.remove('show');
      });
    }
  });

  // ── 4. Mobile accordion (header_arrow_icon) ───────────────────────────────
  const accordionTriggers = block.querySelectorAll('.header_arrow_icon[data-bs-target]');

  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-bs-target');
      if (!targetId) return;
      const panel = block.querySelector(targetId);
      if (!panel) return;
      toggleCollapse(trigger, panel);
    });
  });

  // ── 5. Notification bell ──────────────────────────────────────────────────
  const notifTrigger = block.querySelector('.header__notification--trigger');
  const notifPanel = block.querySelector('.header__notification--panel');

  if (notifTrigger && notifPanel) {
    notifTrigger.setAttribute('role', 'button');
    notifTrigger.setAttribute('tabindex', '0');

    function toggleNotif(e) {
      e.stopPropagation();
      const isOpen = notifPanel.classList.contains('show');
      notifPanel.classList.toggle('show', !isOpen);
      notifTrigger.classList.toggle('active', !isOpen);
    }

    notifTrigger.addEventListener('click', toggleNotif);
    notifTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleNotif(e);
      }
    });

    // Close notif panel on outside click
    document.addEventListener('click', (e) => {
      if (!notifTrigger.contains(e.target) && !notifPanel.contains(e.target)) {
        notifPanel.classList.remove('show');
        notifTrigger.classList.remove('active');
      }
    });
  }

  // ── 6. Search open / close ────────────────────────────────────────────────
  const searchTrigger = block.querySelector('.header__search');
  const searchWrapper = block.querySelector('.global__search--wrapper');
  const closeSearch = block.querySelector('.close-search');
  const searchInput = searchWrapper ? searchWrapper.querySelector('.global__search--input') : null;

  if (searchTrigger && searchWrapper) {
    searchTrigger.addEventListener('click', () => {
      searchWrapper.classList.add('show');
      if (searchInput) searchInput.focus();
    });
  }

  if (closeSearch && searchWrapper) {
    closeSearch.addEventListener('click', () => {
      searchWrapper.classList.remove('show');
    });
  }

  // Close search on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchWrapper && searchWrapper.classList.contains('show')) {
      searchWrapper.classList.remove('show');
    }
  });

  // ── 7. Scroll-to-top button ───────────────────────────────────────────────
  const scrollTopBtn = block.querySelector('#scrollTop') || document.querySelector('#scrollTop');

  if (scrollTopBtn) {
    function handleScroll() {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.remove('d-none');
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.add('d-none');
        scrollTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
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

    // Extract .header__wrapper
    const headerWrapper = doc.querySelector('.header__wrapper');
    if (!headerWrapper) throw new Error('Could not find .header__wrapper in source HTML');

    block.innerHTML = '';
    block.appendChild(headerWrapper);

    // Wire up all interactions
    initHeaderInteractions(block);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[header block]', err);
    block.classList.add('error');
  } finally {
    block.removeAttribute('aria-busy');
    block.classList.remove('loading');
  }
}
