/**
 * Motion System — GSAP + ScrollTrigger scroll-driven motion.
 * Staggered reveals, parallax, 3D tilt micro-interactions, reduced-motion fallback.
 */
(function () {
  document.documentElement.classList.add('js-enabled');

  const prefersReducedMotion = window.matchMedia &&
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
     window.matchMedia('(prefers-color-scheme: reduce)').matches);

  function initMotionSystem() {
    // Accessibility / fallback
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-revealed'));
      init3DTiltCards(true);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (document.querySelector('.availability-badge')) heroTl.from('.availability-badge', { y: -16, opacity: 0, duration: 0.6 }, 0.15);
    if (document.querySelector('.hero-name')) heroTl.from('.hero-name', { y: 32, opacity: 0, duration: 0.85 }, 0.3);
    if (document.querySelector('#hero-tagline')) heroTl.from('#hero-tagline', { y: 20, opacity: 0, duration: 0.6 }, 0.45);
    if (document.querySelector('.hero-cta')) heroTl.from('.hero-cta .btn', { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, 0.7);
    if (document.querySelector('.hero-terminal')) heroTl.from('.hero-terminal', { x: 30, opacity: 0, duration: 0.85 }, 0.5);
    if (document.querySelector('.scroll-indicator')) heroTl.from('.scroll-indicator', { y: 14, opacity: 0, duration: 0.6 }, 1);

    // Parallax — hero terminal drifts on scroll
    if (document.querySelector('.hero-terminal')) {
      gsap.to('.hero-terminal', {
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
        y: 40, ease: 'none'
      });
    }

    // Parallax — hero background subtle move
    if (document.querySelector('.hero-bg-img')) {
      gsap.to('.hero-bg-img', {
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
        y: 80, scale: 1.05, ease: 'none'
      });
    }

    // Section tag subtle depth shift
    gsap.utils.toArray('.section-tag').forEach(tag => {
      gsap.to(tag, {
        scrollTrigger: { trigger: tag, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
        y: -10, ease: 'none'
      });
    });

    // Section headers reveal
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.from(header, {
        scrollTrigger: { trigger: header, start: 'top 88%', toggleActions: 'play none none none' },
        y: 26, opacity: 0, duration: 0.7, ease: 'power3.out'
      });
    });

    // Static reveal elements (already in DOM)
    gsap.utils.toArray('.reveal').forEach(el => {
      if (el.closest('#hero')) return; // hero handled by timeline
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          onStart: () => el.classList.add('is-revealed')
        }
      );
    });

    // Dynamic batch reveals for rendered grids
    initDynamicBatchReveals();

    // 3D tilt
    init3DTiltCards(false);

    // Deep link anchors
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) gsap.set(target.querySelectorAll('.reveal'), { opacity: 1, y: 0, x: 0 });
    }

    // Safety fallback — guarantee no stuck elements
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-revealed'));
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }, 1400);
  }

  function initDynamicBatchReveals() {
    if (!window.ScrollTrigger) return;

    const batch = (sel, opts) => {
      if (!document.querySelector(sel)) return;
      ScrollTrigger.batch(sel, {
        onEnter: b => gsap.fromTo(b, opts.from, opts.to),
        start: 'top 85%'
      });
    };

    batch('.skill-card', { from: { opacity: 0, y: 30 }, to: { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, overwrite: true } });
    batch('.project-card', { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12, overwrite: true } });
    batch('.stat-card', { from: { opacity: 0, y: 24, scale: 0.96 }, to: { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)', stagger: 0.08, overwrite: true, onStart: function () { this.targets().forEach(t => t.classList.add('is-revealed')); } } });
    batch('.timeline-item', { from: { opacity: 0, x: -24 }, to: { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12, overwrite: true } });
    batch('.research-card', { from: { opacity: 0, y: 20 }, to: { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1, overwrite: true } });
  }

  // 3D perspective tilt
  function init3DTiltCards(disabled) {
    if (disabled || prefersReducedMotion) return;
    const cards = document.querySelectorAll('[data-tilt], .project-card:not(.project-card-featured)');
    cards.forEach(card => {
      if (card.dataset.tiltBound === '1') return;
      card.dataset.tiltBound = '1';
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rx = (y / (rect.height / 2)) * -4;
        const ry = (x / (rect.width / 2)) * 4;
        if (window.gsap) {
          gsap.to(card, { rotationX: rx, rotationY: ry, transformPerspective: 1100, duration: 0.3, ease: 'power2.out' });
        }
      });
      card.addEventListener('mouseleave', () => {
        if (window.gsap) gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power2.out' });
      });
    });
  }

  // Export refresh helper for main.js after data rendering
  window.refreshMotionSystem = function () {
    if (window.ScrollTrigger) {
      initDynamicBatchReveals();
      init3DTiltCards(false);
      ScrollTrigger.refresh();
    } else {
      // GSAP not loaded yet — reveal everything
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-revealed'));
    }
    if (window.MotionFX && typeof window.MotionFX.refresh === 'function') {
      window.MotionFX.refresh();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotionSystem);
  } else {
    initMotionSystem();
  }
})();
