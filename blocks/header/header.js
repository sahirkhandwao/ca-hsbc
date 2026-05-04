const SOURCE = '/static-html/header.html';

/* ─── Accordion / Collapse helper ─────────────────────────────────────────── */

/**
 * Toggle a Bootstrap-style collapse element.
 * @param {Element} btn   - the trigger button / span
 * @param {Element} panel - the `.accordion-collapse` panel
 */
function toggleCollapse(btn, panel) {
  const isClosing = panel.classList.contains('show');

  if (isClosing) {
    panel.classList.remove('show');
    btn.classList.add('collapsed');
    btn.setAttribute('aria-expanded', 'false');
  } else {
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
    if (hamburgerBtn) hamburgerBtn.classList.add('active');
    if (hamburgerMenu) {
      hamburgerMenu.classList.add('active');
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
    if (hamburgerBtn) hamburgerBtn.classList.remove('active');
    if (hamburgerMenu) {
      hamburgerMenu.classList.remove('active');
    }
    if (overlay) {
      overlay.classList.add('d-none');
      overlay.classList.remove('active');
    }
    document.body.classList.remove('menu-open');
  }

  // Hamburger button toggles open/close
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerMenu && hamburgerMenu.classList.contains('active');
      if (isOpen) closeMenu();
      else openMenu();
    });
  }

  // Close icon inside the hamburger panel head
  const hamburgerHead = block.querySelector('.header__hamburger--head');
  if (hamburgerHead) {
    const closeBtn = hamburgerHead.querySelector('.header__hamburger--close-icon');
    if (closeBtn) {
      const closeTarget = closeBtn.closest('button') || closeBtn.closest('[role="button"]') || closeBtn;
      closeTarget.addEventListener('click', closeMenu);
    }
  }

  // Also wire any standalone close-icon SVG directly (fallback)
  if (hamburgerClose && !hamburgerHead) {
    hamburgerClose.addEventListener('click', closeMenu);
  }

  // Close menu when clicking outside (on the overlay or page content)
  document.addEventListener('click', (e) => {
    if (
      hamburgerMenu
      && hamburgerMenu.classList.contains('active')
      && !hamburgerMenu.contains(e.target)
      && !(hamburgerBtn && hamburgerBtn.contains(e.target))
    ) {
      closeMenu();
    }
  });

  // ── 2. Overlay click closes menu and any open dropdowns ──────────────────
  if (overlay) {
    overlay.addEventListener('click', () => {
      closeMenu();
      navItems.forEach((n) => {
        n.classList.remove('dropdown-open');
        const drop = n.querySelector('.header__navbar--dropdown');
        if (drop) drop.classList.remove('active');
      });
      overlay.classList.remove('active');
      overlay.classList.add('d-none');
    });
  }

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
          if (otherDrop) otherDrop.classList.remove('active');
        }
      });
      item.classList.add('dropdown-open');
      dropdown.classList.add('active');
      // Show overlay behind the page content (header stays above)
      if (overlay) {
        overlay.classList.remove('d-none');
        overlay.classList.add('active');
      }
    });

    item.addEventListener('mouseleave', () => {
      hoverTimer = setTimeout(() => {
        item.classList.remove('dropdown-open');
        dropdown.classList.remove('active');
        // Hide overlay only if no other dropdown is open
        const anyOpen = Array.from(navItems).some((n) => n.classList.contains('dropdown-open'));
        if (!anyOpen && overlay) {
          overlay.classList.remove('active');
          overlay.classList.add('d-none');
        }
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
            if (otherDrop) otherDrop.classList.remove('active');
          });
          if (!isOpen) {
            item.classList.add('dropdown-open');
            dropdown.classList.add('active');
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
        if (dropdown) dropdown.classList.remove('active');
      });
    }
  });

  // ── 4. Mobile accordion (header_arrow_icon) ───────────────────────────────
  const accordionItems = block.querySelectorAll('.header__accordion--item');

  accordionItems.forEach((item) => {
    const btn = item.querySelector('.header__accordion--button');
    const trigger = item.querySelector('.header_arrow_icon[data-bs-target]');
    if (!trigger) return;

    // Helper to perform the toggle
    const handleToggle = (e) => {
      // If clicking a real link inside the button, let it through
      if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href') !== '#' && e.target.getAttribute('href') !== '') {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const targetId = trigger.getAttribute('data-bs-target');
      if (!targetId) return;
      const panel = block.querySelector(targetId);
      if (!panel) return;

      toggleCollapse(trigger, panel);
    };

    // Listen on the main button/link
    if (btn) btn.addEventListener('click', handleToggle);
    // Also listen on the arrow specifically if it's not the same element
    if (trigger && trigger !== btn) trigger.addEventListener('click', handleToggle);
  });

  // ── 5. Notification bell ──────────────────────────────────────────────────
  const notifTrigger = block.querySelector('.header__notification--trigger');
  const notifPanel = block.querySelector('.header__notification--panel');

  if (notifTrigger && notifPanel) {
    // Apply data-notification-bgcolor to each item's background
    notifPanel.querySelectorAll('.header__notification--item-background').forEach((section) => {
      const bg = section.getAttribute('data-notification-bgcolor');
      if (bg) section.style.backgroundColor = bg;
    });

    // Show on hover
    let hideTimer;
    notifTrigger.addEventListener('mouseenter', () => {
      clearTimeout(hideTimer);
      notifPanel.classList.add('show');
    });
    notifTrigger.addEventListener('mouseleave', () => {
      hideTimer = setTimeout(() => notifPanel.classList.remove('show'), 200);
    });
    notifPanel.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    notifPanel.addEventListener('mouseleave', () => {
      hideTimer = setTimeout(() => notifPanel.classList.remove('show'), 200);
    });

    // Also support click / keyboard
    notifTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      notifPanel.classList.toggle('show');
    });
    notifTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        notifPanel.classList.toggle('show');
      }
      if (e.key === 'Escape') notifPanel.classList.remove('show');
    });

    document.addEventListener('click', (e) => {
      if (!notifTrigger.contains(e.target)) notifPanel.classList.remove('show');
    });
  }

  // ── 6. Search open / close ────────────────────────────────────────────────
  const searchTrigger = block.querySelector('.header__search');
  const searchWrapper = block.querySelector('.global__search--wrapper');
  const closeSearch = block.querySelector('.close-search');
  const searchInput = searchWrapper ? searchWrapper.querySelector('.global__search--input') : null;

  // Move close button into the input wrapper so it sits in the same flex row
  if (closeSearch && searchWrapper) {
    const inputWrapper = searchWrapper.querySelector('.global__search__input--wrapper');
    if (inputWrapper && closeSearch.parentElement !== inputWrapper) {
      inputWrapper.appendChild(closeSearch);
    }
  }

  // Static HTML may include 'show' by default — remove it on init
  if (searchWrapper) searchWrapper.classList.remove('show');

  function openSearch() {
    searchWrapper.classList.add('show');
    document.body.classList.add('search-open');
    // Measure panel height after render so overlay starts exactly below it
    requestAnimationFrame(() => {
      const panelBottom = searchWrapper.getBoundingClientRect().bottom;
      document.documentElement.style.setProperty('--search-panel-bottom', `${panelBottom}px`);
    });
    if (searchInput) searchInput.focus();
  }

  function closeSearchPanel() {
    searchWrapper.classList.remove('show');
    document.body.classList.remove('search-open');
    document.documentElement.style.removeProperty('--search-panel-bottom');
  }

  if (searchTrigger && searchWrapper) {
    searchTrigger.addEventListener('click', () => {
      const isOpen = searchWrapper.classList.contains('show');
      if (!isOpen) openSearch();
      else closeSearchPanel();
    });
  }

  if (closeSearch && searchWrapper) {
    closeSearch.addEventListener('click', closeSearchPanel);
  }

  // Close search on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchWrapper && searchWrapper.classList.contains('show')) {
      closeSearchPanel();
    }
  });

  // Clicking outside search panel closes it (via body::after pseudo-element backdrop)
  document.addEventListener('click', (e) => {
    if (
      searchWrapper
      && searchWrapper.classList.contains('show')
      && !searchWrapper.contains(e.target)
      && !searchTrigger.contains(e.target)
    ) {
      closeSearchPanel();
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

    // Prepend domain to relative paths
    const domain = 'https://www.canarahsbclife.com';
    const attrs = ['src', 'href', 'xlink:href', 'srcset'];
    headerWrapper.querySelectorAll(attrs.map((attr) => `[${attr.replace(':', '\\:')}]`).join(', ')).forEach((el) => {
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
