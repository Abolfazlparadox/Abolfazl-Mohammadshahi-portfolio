/**
 * Motion System - GSAP + ScrollTrigger Scroll-Driven Motion Architecture
 * Features: Staggered reveals, subtle parallax, 3D tilt micro-interactions, fallback handling.
 */
(function() {
  document.documentElement.classList.add('js-enabled');

  const prefersReducedMotion = window.matchMedia && (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(prefers-color-scheme: reduce)').matches
  );

  function initMotionSystem() {
    // 1. Accessibility / Fallback Check
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-revealed'));
      init3DTiltCards(true); // Disable tilt
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // 2. Hero Section Entrance Animation Timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (document.querySelector('.availability-badge')) {
      heroTl.from('.availability-badge', { y: -20, opacity: 0, duration: 0.6 }, 0.2);
    }
    if (document.querySelector('.hero-name')) {
      heroTl.from('.hero-name', { y: 30, opacity: 0, duration: 0.8 }, 0.35);
    }
    if (document.querySelector('#hero-tagline')) {
      heroTl.from('#hero-tagline', { y: 20, opacity: 0, duration: 0.6 }, 0.5);
    }
    if (document.querySelector('.hero-cta')) {
      heroTl.from('.hero-cta .btn', { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, 0.65);
    }
    if (document.querySelector('.hero-terminal')) {
      heroTl.from('.hero-terminal', { x: 30, opacity: 0, duration: 0.8 }, 0.5);
    }

    // 3. Subtle Scroll Parallax Effects
    if (document.querySelector('.hero-terminal')) {
      gsap.to('.hero-terminal', {
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        y: 35,
        ease: 'none'
      });
    }

    // Section Tags Subtle Depth Shift
    gsap.utils.toArray('.section-tag').forEach(tag => {
      gsap.to(tag, {
        scrollTrigger: {
          trigger: tag,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        },
        y: -12,
        ease: 'none'
      });
    });

    // 4. Section Headers Scroll-Driven Reveal
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      });
    });

    // 5. Staggered Grid & Component Reveals
    initDynamicBatchReveals();

    // 6. Interactive 3D Tilt Micro-Interactions
    init3DTiltCards(false);

    // 7. Handle Deep Link Anchors
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        gsap.set(target.querySelectorAll('.reveal'), { opacity: 1, y: 0, x: 0 });
      }
    }

    // Safety fallback timer to guarantee no stuck elements
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-revealed'));
      ScrollTrigger.refresh();
    }, 1200);
  }

  // Dynamic Batch Reveals for Rendered Grid Cards
  function initDynamicBatchReveals() {
    if (!window.ScrollTrigger) return;

    // Skill Cards Stagger
    if (document.querySelector('.skill-card')) {
      ScrollTrigger.batch('.skill-card', {
        onEnter: batch => gsap.fromTo(batch, 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, overwrite: true }
        ),
        start: 'top 85%'
      });
    }

    // Project Cards Stagger
    if (document.querySelector('.project-card')) {
      ScrollTrigger.batch('.project-card', {
        onEnter: batch => gsap.fromTo(batch, 
          { opacity: 0, y: 35 }, 
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1, overwrite: true }
        ),
        start: 'top 85%'
      });
    }

    // Timeline Items Stagger
    if (document.querySelector('.timeline-item')) {
      ScrollTrigger.batch('.timeline-item', {
        onEnter: batch => gsap.fromTo(batch, 
          { opacity: 0, x: -20 }, 
          { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12, overwrite: true }
        ),
        start: 'top 85%'
      });
    }
  }

  // Interactive 3D Perspective Tilt on Cards
  function init3DTiltCards(disabled) {
    if (disabled || prefersReducedMotion) return;

    const cards = document.querySelectorAll('.project-card, .profile-photo-wrapper, .hero-terminal');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rx = (y / (rect.height / 2)) * -5;
        const ry = (x / (rect.width / 2)) * 5;

        if (window.gsap) {
          gsap.to(card, {
            rotationX: rx,
            rotationY: ry,
            transformPerspective: 1000,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        if (window.gsap) {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: 'power2.out'
          });
        }
      });
    });
  }

  // Export refresh helper for main.js after data rendering
  window.refreshMotionSystem = function() {
    if (window.ScrollTrigger) {
      initDynamicBatchReveals();
      init3DTiltCards(false);
      ScrollTrigger.refresh();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotionSystem);
  } else {
    initMotionSystem();
  }
})();
