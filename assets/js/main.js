/**
 * Main Application Orchestrator
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. Fetch & Render All Data
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

    // Refresh GSAP ScrollTrigger after dynamic DOM injection
    if (typeof window.refreshMotionSystem === 'function') {
      window.refreshMotionSystem();
    }

  } catch (err) {
    console.error('Error loading portfolio data:', err);
  }

  // 2. Initialize Hero Terminal Typewriter Animation
  initHeroTerminal();

  // 3. Initialize Back to Top Button
  initBackToTop();

  // 4. Initialize Contact Form Submission Handler
  initContactForm();
});

/* Hero Terminal Typewriter Animation */
function initHeroTerminal() {
  const terminal = document.getElementById('hero-typewriter');
  if (!terminal) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lines = [
    { prompt: '$ ', text: 'python3 -c "import profile"', delay: 300 },
    { response: 'Full-Stack & Backend Software Developer' },
    { prompt: '$ ', text: 'cat education.txt', delay: 400 },
    { response: 'M.Sc. Software Engineering @ K. N. Toosi Univ.' },
    { prompt: '$ ', text: 'echo $STACK', delay: 400 },
    { response: "['Python', 'Django', 'Docker', 'Celery', 'Redis', 'PostgreSQL']" }
  ];

  if (prefersReducedMotion) {
    terminal.innerHTML = lines.map(l => {
      if (l.prompt) {
        return `<div class="terminal-line"><span class="prompt-symbol">${l.prompt}</span><span class="typewriter-text">${l.text}</span></div>`;
      } else {
        return `<div class="terminal-line" style="color: var(--accent-light); padding-left: 1rem;"><span class="typewriter-text">${l.response}</span></div>`;
      }
    }).join('') + `<span class="cursor"></span>`;
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let currentHtml = '';

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
      setTimeout(typeNextChar, 350);
      return;
    }

    if (charIndex === 0) {
      currentHtml += `<div class="terminal-line"><span class="prompt-symbol">${currentLine.prompt}</span><span class="typewriter-text">`;
    }

    if (charIndex < currentLine.text.length) {
      currentHtml += currentLine.text.charAt(charIndex);
      terminal.innerHTML = currentHtml + `</span></div><span class="cursor"></span>`;
      charIndex++;
      setTimeout(typeNextChar, 35 + Math.random() * 25);
    } else {
      currentHtml += `</span></div>`;
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNextChar, currentLine.delay || 400);
    }
  }

  setTimeout(typeNextChar, 500);
}

/* Back to Top Button Handler */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  function toggleVisibility() {
    if (window.scrollY > 400) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* Contact Form Handling & Non-JS Fallback */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !email || !message) {
      showFeedback('Please fill in all required fields.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // Success feedback
    showFeedback(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
    form.reset();
  });

  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className = `form-feedback ${type}`;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
