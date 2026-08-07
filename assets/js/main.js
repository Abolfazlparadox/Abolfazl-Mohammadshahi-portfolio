/**
 * Main Application Orchestrator
 * Data render → motion refresh → hero terminal → back-to-top → contact form (FormSubmit).
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 1. Fetch & Render All Data
  try {
    const [profile, skills, projects, experience, education, certificates, research] = await Promise.all([
      DataService.fetchJson('profile.json'),
      DataService.fetchJson('skills.json'),
      DataService.fetchJson('projects.json'),
      DataService.fetchJson('experience.json'),
      DataService.fetchJson('education.json'),
      DataService.fetchJson('certificates.json'),
      DataService.fetchJson('research.json')
    ]);

    RenderEngine.renderProfile(profile);
    RenderEngine.renderSkills(skills);
    RenderEngine.renderProjects(projects);
    RenderEngine.renderExperience(experience);
    RenderEngine.renderEducation(education);
    RenderEngine.renderResearch(research);

    // Refresh GSAP ScrollTrigger + MotionFX after dynamic DOM injection
    if (typeof window.refreshMotionSystem === 'function') {
      window.refreshMotionSystem();
    }
  } catch (err) {
    console.error('Error loading portfolio data:', err);
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-revealed'));
  }

  initHeroTerminal();
  initBackToTop();
  initContactForm();
});

/* Hero Terminal Typewriter Animation */
function initHeroTerminal() {
  const terminal = document.getElementById('hero-typewriter');
  if (!terminal) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lines = [
    { prompt: '$ ', text: 'whoami', delay: 350 },
    { response: 'Backend Software Engineer · Distributed Systems' },
    { prompt: '$ ', text: 'cat stack.json', delay: 400 },
    { response: "['Python','Django','DRF','Celery','Redis','PostgreSQL','Docker']" },
    { prompt: '$ ', text: 'git log --oneline -1', delay: 450 },
    { response: 'feat: ship scalable distributed e-commerce APIs ✓' }
  ];

  if (prefersReducedMotion) {
    terminal.innerHTML = lines.map(l => l.prompt
      ? `<div class="terminal-line"><span class="prompt-symbol">${l.prompt}</span><span class="typewriter-text">${l.text}</span></div>`
      : `<div class="terminal-line" style="color: var(--accent-light); padding-left: 1rem;"><span class="typewriter-text">${l.response}</span></div>`
    ).join('') + `<span class="cursor"></span>`;
    return;
  }

  let lineIndex = 0, charIndex = 0, currentHtml = '';

  function typeNextChar() {
    if (lineIndex >= lines.length) {
      terminal.innerHTML = currentHtml + `<span class="cursor"></span>`;
      return;
    }
    const currentLine = lines[lineIndex];

    if (currentLine.response) {
      currentHtml += `<div class="terminal-line" style="color: var(--accent-light); padding-left: 1rem;"><span class="typewriter-text">${currentLine.response}</span></div>`;
      terminal.innerHTML = currentHtml + `<span class="cursor"></span>`;
      lineIndex++;
      setTimeout(typeNextChar, 380);
      return;
    }

    if (charIndex === 0) {
      currentHtml += `<div class="terminal-line"><span class="prompt-symbol">${currentLine.prompt}</span><span class="typewriter-text">`;
    }
    if (charIndex < currentLine.text.length) {
      currentHtml += currentLine.text.charAt(charIndex);
      terminal.innerHTML = currentHtml + `</span></div><span class="cursor"></span>`;
      charIndex++;
      setTimeout(typeNextChar, 38 + Math.random() * 25);
    } else {
      currentHtml += `</span></div>`;
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNextChar, currentLine.delay || 400);
    }
  }

  setTimeout(typeNextChar, 600);
}

/* Back to Top */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  const toggleVisibility = () => {
    if (window.scrollY > 400) btn.classList.add('is-visible');
    else btn.classList.remove('is-visible');
  };
  window.addEventListener('scroll', toggleVisibility, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* Contact Form — FormSubmit via regular POST (no backend, free, static-host friendly).
   Browser navigation passes Cloudflare; _next redirects back with ?sent=1. */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('contact-submit');
  if (!form) return;

  const nameEl = form.querySelector('#form-name');
  const emailEl = form.querySelector('#form-email');
  const messageEl = form.querySelector('#form-message');
  const honeyEl = form.querySelector('[name="_honey"]');

  // Success state after FormSubmit _next redirect (?sent=1)
  const params = new URLSearchParams(window.location.search);
  if (params.get('sent') === '1') {
    showFeedback("Thank you! Your message has been sent — I'll get back to you soon.", 'success');
    // Clean the URL
    const cleanUrl = window.location.origin + window.location.pathname + window.location.hash;
    window.history.replaceState(null, '', cleanUrl);
  }

  form.addEventListener('submit', (e) => {
    feedback.className = 'form-feedback';
    feedback.innerHTML = '';

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = messageEl.value.trim();
    const honey = honeyEl ? honeyEl.value : '';

    // Honeypot — silently drop bots (let it "submit" to nowhere)
    if (honey) { e.preventDefault(); return; }

    if (!name || !email || !message) {
      e.preventDefault();
      showFeedback('Please fill in all required fields.', 'error');
      return;
    }
    if (!validateEmail(email)) {
      e.preventDefault();
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }
    if (message.length < 10) {
      e.preventDefault();
      showFeedback('Please write a slightly longer message (at least 10 characters).', 'error');
      return;
    }

    if (!form.action || !form.action.includes('formsubmit.co')) {
      e.preventDefault();
      showFeedback('Contact form is not configured. Please email me directly.', 'error');
      return;
    }

    // Valid — allow native POST to FormSubmit. Show loading state during navigation.
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    showFeedback('Sending your message…', 'loading');
    // Native form submission proceeds (no preventDefault).
  });

  function showFeedback(msg, type) {
    if (!feedback) return;
    const icon = type === 'success'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>'
      : (type === 'loading'
        ? '<span class="btn-spinner" style="position:static;display:inline-block;border-color:rgba(0,0,0,.25);border-top-color:var(--accent-primary)"></span>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>');
    feedback.innerHTML = icon + '<span>' + msg + '</span>';
    feedback.className = type === 'loading' ? 'form-feedback success' : `form-feedback ${type}`;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
