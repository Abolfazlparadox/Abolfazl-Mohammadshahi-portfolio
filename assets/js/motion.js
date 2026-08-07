/**
 * Motion FX — premium micro-interactions.
 * Custom cursor, magnetic buttons, scroll progress, animated counters.
 * Respects prefers-reduced-motion. Exposes window.MotionFX.refresh().
 */
(function () {
  const prefersReducedMotion = window.matchMedia &&
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

  const MotionFX = {
    init() {
      this.initScrollProgress();
      if (prefersReducedMotion) return;
      if (canHover) this.initCursor();
      this.initMagnetic();
      this.initCounters();
    },

    refresh() {
      // Re-bind dynamic elements after render
      if (!prefersReducedMotion) {
        this.initMagnetic();
        this.initCounters();
      }
    },

    /* ---------- Scroll Progress ---------- */
    initScrollProgress() {
      const bar = document.querySelector('.scroll-progress-bar');
      if (!bar) return;
      let ticking = false;
      const update = () => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
        bar.style.width = pct + '%';
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
      }, { passive: true });
      update();
    },

    /* ---------- Custom Cursor ---------- */
    initCursor() {
      const dot = document.querySelector('.cursor-dot');
      const ring = document.querySelector('.cursor-ring');
      if (!dot || !ring) return;

      document.body.classList.add('cursor-active');

      let mx = window.innerWidth / 2, my = window.innerHeight / 2;
      let rx = mx, ry = my;
      let visible = false;

      const onMove = (e) => {
        mx = e.clientX; my = e.clientY;
        if (!visible) {
          visible = true;
          dot.classList.remove('is-hidden');
          ring.classList.remove('is-hidden');
        }
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      };

      // Ring lags slightly for a premium trailing feel
      const tick = () => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      window.addEventListener('mousemove', onMove, { passive: true });

      document.addEventListener('mouseleave', () => {
        dot.classList.add('is-hidden');
        ring.classList.add('is-hidden');
        visible = false;
      });
      document.addEventListener('mouseenter', () => {
        if (!visible) {
          dot.classList.remove('is-hidden');
          ring.classList.remove('is-hidden');
          visible = true;
        }
      });

      // Hover state on interactive elements
      const hoverSel = 'a, button, [data-tilt], .tech-chip, .stat-card, .skill-card, .project-card, .timeline-card, .research-card, .social-btn, .nav-link, .focus-chip';
      const setHover = (on) => (el) => {
        if (on) ring.classList.add('is-hover'); else ring.classList.remove('is-hover');
      };
      document.addEventListener('mouseover', (e) => {
        if (e.target.closest && e.target.closest(hoverSel)) ring.classList.add('is-hover');
      });
      document.addEventListener('mouseout', (e) => {
        if (e.target.closest && e.target.closest(hoverSel)) ring.classList.remove('is-hover');
      });

      // Click/down state
      document.addEventListener('mousedown', () => ring.classList.add('is-down'));
      document.addEventListener('mouseup', () => ring.classList.remove('is-down'));
    },

    /* ---------- Magnetic Buttons ---------- */
    initMagnetic() {
      const els = document.querySelectorAll('.btn-magnetic');
      if (!els.length) return;

      els.forEach((el) => {
        if (el.dataset.magnetic === '1') return;
        el.dataset.magnetic = '1';
        const strength = 18;

        const onMove = (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - (rect.left + rect.width / 2);
          const y = e.clientY - (rect.top + rect.height / 2);
          const tx = (x / rect.width) * strength;
          const ty = (y / rect.height) * strength;
          if (window.gsap) {
            gsap.to(el, { x: tx, y: ty, duration: 0.3, ease: 'power2.out' });
          } else {
            el.style.transform = `translate(${tx}px, ${ty}px)`;
          }
        };

        const onLeave = () => {
          if (window.gsap) {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
          } else {
            el.style.transform = '';
          }
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
      });
    },

    /* ---------- Animated Stat Counters ---------- */
    initCounters() {
      const counters = document.querySelectorAll('[data-counter] .stat-value:not([data-counted])');
      if (!counters.length) return;

      const animate = (el) => {
        if (el.dataset.counted) return;
        el.dataset.counted = '1';
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const dur = 1600;
        const start = performance.now();

        const step = (now) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          const val = Math.round(target * eased);
          el.textContent = val + suffix;
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        };
        requestAnimationFrame(step);
      };

      if (!('IntersectionObserver' in window) || prefersReducedMotion) {
        counters.forEach((el) => {
          const target = el.getAttribute('data-target');
          const suffix = el.getAttribute('data-suffix') || '';
          el.textContent = target + suffix;
          el.dataset.counted = '1';
        });
        return;
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });

      counters.forEach((el) => io.observe(el));
    }
  };

  window.MotionFX = MotionFX;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MotionFX.init());
  } else {
    MotionFX.init();
  }
})();
