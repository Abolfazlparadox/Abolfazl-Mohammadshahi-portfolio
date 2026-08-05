/**
 * Navigation & Robust Scroll-Spy Engine
 */
(function() {
  let isNavClickScrolling = false;

  document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileMenu();
    initScrollSpy();
  });

  /* Priority 1 Fix 8: Sticky Navigation Border & Backdrop Transition */
  function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    function checkScroll() {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* Mobile Menu Drawer Toggle */
  function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-desktop');
    const overlay = document.querySelector('.nav-overlay');

    if (!toggleBtn || !navMenu) return;

    function openMenu() {
      toggleBtn.setAttribute('aria-expanded', 'true');
      navMenu.classList.add('is-open');
      if (overlay) overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    if (overlay) overlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* Priority 1 Fix 4 & Fix 5: Robust Scroll-Spy Engine */
  function initScrollSpy() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = Array.from(document.querySelectorAll('section[id]'));

    if (!sections.length || !navLinks.length) return;

    function setActiveNav(targetId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${targetId}`) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    }

    function updateScrollSpy() {
      if (isNavClickScrolling) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // 1. Top of page fallback
      if (scrollY < 100) {
        setActiveNav(sections[0].id);
        return;
      }

      // 2. Bottom of page fallback
      if (windowHeight + scrollY >= docHeight - 50) {
        setActiveNav(sections[sections.length - 1].id);
        return;
      }

      // 3. Offset calculation
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const offsetMargin = navHeight + 60;

      let currentSectionId = sections[0].id;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const top = section.offsetTop - offsetMargin;
        const bottom = top + section.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
          currentSectionId = section.id;
          break;
        }
      }

      setActiveNav(currentSectionId);
    }

    // Nav Link Click Smooth Scroll Handler
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        const targetEl = document.querySelector(href);
        if (!targetEl) return;

        e.preventDefault();
        isNavClickScrolling = true;
        
        const targetId = href.substring(1);
        setActiveNav(targetId);

        targetEl.scrollIntoView({ behavior: 'smooth' });

        // Update URL cleanly without jump
        if (history.pushState) {
          history.pushState(null, null, href);
        }

        setTimeout(() => {
          isNavClickScrolling = false;
          updateScrollSpy();
        }, 800);
      });
    });

    window.addEventListener('scroll', updateScrollSpy, { passive: true });
    updateScrollSpy();
  }
})();
