/**
 * Render Engine - Populates DOM with semantic, accessible, icon-rich HTML.
 * Depends on: window.TechIcons (icons.js)
 */
const RenderEngine = {
  /* ---------- Profile ---------- */
  renderProfile(profile) {
    if (!profile) return;

    document.querySelectorAll('.profile-name').forEach(el => el.textContent = profile.name);
    const setTitle = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.textContent = val; };
    setTitle('hero-tagline', profile.tagline);
    setTitle('about-bio', profile.bio);
    setTitle('availability-status', profile.status);

    document.querySelectorAll('.profile-email').forEach(el => {
      el.href = `mailto:${profile.email}`;
      el.textContent = profile.email;
    });
    const githubLink = document.getElementById('github-link'); if (githubLink) githubLink.href = profile.github;
    const linkedinLink = document.getElementById('linkedin-link'); if (linkedinLink) linkedinLink.href = profile.linkedin;
    const cvLink = document.getElementById('resume-download-btn'); if (cvLink) cvLink.href = profile.resume_url;

    // Contact form — FormSubmit (regular POST, browser navigation passes Cloudflare).
    // _next redirects back to this page with ?sent=1 so we can show an in-page success state.
    const form = document.getElementById('contact-form');
    if (form && profile.email) {
      form.action = `https://formsubmit.co/${profile.email}`;
      const nextInput = document.getElementById('form-next');
      if (nextInput) {
        const base = window.location.origin + window.location.pathname;
        nextInput.value = `${base}?sent=1#contact`;
      }
    }

    // Focus chips (hero/sub)
    if (profile.focus) {
      const focusWrap = document.getElementById('focus-chips');
      if (focusWrap) {
        focusWrap.innerHTML = profile.focus.map(f => `<span class="focus-chip">${this.escapeHtml(f)}</span>`).join('');
        // Stagger focus chips in (hero entrance)
        if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.from(focusWrap.querySelectorAll('.focus-chip'), {
            opacity: 0, y: 14, duration: 0.5, stagger: 0.04, ease: 'power3.out', delay: 0.55
          });
        }
      }
    }

    // Animated stat counters
    if (profile.stats) {
      const statsWrap = document.getElementById('stats-grid');
      if (statsWrap) {
        statsWrap.innerHTML = profile.stats.map(s => `
          <div class="stat-card reveal" data-counter>
            <div class="stat-icon">${this.statIcon(s.icon)}</div>
            <div class="stat-value" data-target="${s.value}" data-suffix="${this.escapeHtml(s.suffix || '')}">0</div>
            <div class="stat-label">${this.escapeHtml(s.label)}</div>
          </div>
        `).join('');
      }
    }
  },

  statIcon(name) {
    const map = {
      github: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
      code: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      clock: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      layers: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'
    };
    return map[name] || map.code;
  },

  /* ---------- Skills (colorful icon chips) ---------- */
  renderSkills(skills) {
    const container = document.getElementById('skills-container');
    if (!container || !Array.isArray(skills)) return;

    container.innerHTML = skills.map(cat => {
      const groupsHtml = (cat.groups || []).map(group => `
        <div class="skill-group">
          <div class="skill-level-heading">${this.escapeHtml(group.level)}</div>
          <div class="skill-tags">
            ${(group.skills || []).map(skill => this.techChip(skill)).join('')}
          </div>
        </div>
      `).join('');

      return `
        <div class="skill-card reveal">
          <div class="skill-card-head">
            <span class="skill-card-icon">${this.skillIcon(cat.icon)}</span>
            <h3 class="skill-card-title">${this.escapeHtml(cat.category)}</h3>
          </div>
          ${groupsHtml}
        </div>
      `;
    }).join('');
  },

  skillIcon(name) {
    const map = {
      code: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      database: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>',
      layers: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
      layout: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>'
    };
    return map[name] || map.code;
  },

  // Tech chip with brand icon (if matched) + label
  techChip(text) {
    if (window.TechIcons && typeof window.TechIcons.chip === 'function') {
      return window.TechIcons.chip(text);
    }
    return `<span class="tech-chip"><span class="chip-label">${this.escapeHtml(text)}</span></span>`;
  },

  /* ---------- Projects (featured hero card + standard cards) ---------- */
  renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container || !Array.isArray(projects)) return;

    container.innerHTML = projects.map(p => {
      const techChips = (p.tags || []).map(t => this.techChip(t)).join('');
      const archBadges = (p.architecture || []).map(a => `<span class="arch-badge">${this.escapeHtml(a)}</span>`).join('');
      const highlights = (p.highlights || []).map(h => `<li>${this.escapeHtml(h)}</li>`).join('');
      const demoLink = p.demo ? `
        <a href="${this.escapeHtml(p.demo)}" target="_blank" rel="noopener noreferrer" class="project-link project-link-demo" aria-label="Live demo of ${this.escapeHtml(p.title)}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Live Demo
        </a>` : '';

      if (p.featured) {
        return `
          <article class="project-card project-card-featured reveal" data-tilt>
            <div class="project-media">
              <img src="${this.escapeHtml(p.image)}" alt="${this.escapeHtml(p.title)} preview" class="project-image" loading="lazy" />
              <div class="project-media-glow"></div>
              <span class="project-featured-tag">★ Flagship</span>
            </div>
            <div class="project-content">
              <div class="project-head">
                <div>
                  <span class="project-year">${this.escapeHtml(p.year || '')}</span>
                  <h3 class="project-title">${this.escapeHtml(p.title)}</h3>
                  <p class="project-subtitle">${this.escapeHtml(p.subtitle || '')}</p>
                </div>
                <span class="project-role">${this.escapeHtml(p.role || '')}</span>
              </div>
              <p class="project-description">${this.escapeHtml(p.description)}</p>
              <div class="project-arch">${archBadges}</div>
              <ul class="project-highlights">${highlights}</ul>
              <div class="project-tags">${techChips}</div>
              <div class="project-code">
                <div class="project-code-bar"><span class="d-red"></span><span class="d-yellow"></span><span class="d-green"></span><span class="project-code-name">${this.escapeHtml(p.id || 'code')}.py</span></div>
                <pre class="project-code-snippet"><code>${this.escapeHtml(p.snippet || '')}</code></pre>
              </div>
              <div class="project-links">
                <a href="${this.escapeHtml(p.github)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-magnetic" aria-label="View ${this.escapeHtml(p.title)} on GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>
                  View on GitHub
                </a>
                ${demoLink}
              </div>
            </div>
          </article>`;
      }

      return `
        <article class="project-card reveal" data-tilt>
          <div class="project-media">
            <img src="${this.escapeHtml(p.image)}" alt="${this.escapeHtml(p.title)} preview" class="project-image" loading="lazy" />
            <div class="project-media-glow"></div>
          </div>
          <div class="project-content">
            <div class="project-head">
              <div>
                <span class="project-year">${this.escapeHtml(p.year || '')}</span>
                <h3 class="project-title">${this.escapeHtml(p.title)}</h3>
                <p class="project-subtitle">${this.escapeHtml(p.subtitle || '')}</p>
              </div>
            </div>
            <p class="project-description">${this.escapeHtml(p.description)}</p>
            <div class="project-arch">${archBadges}</div>
            <ul class="project-highlights">${highlights}</ul>
            <div class="project-tags">${techChips}</div>
            <div class="project-links">
              <a href="${this.escapeHtml(p.github)}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View ${this.escapeHtml(p.title)} on GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>
                Repository
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </a>
              ${demoLink}
            </div>
          </div>
        </article>`;
    }).join('');
  },

  /* ---------- Experience ---------- */
  renderExperience(experience) {
    const container = document.getElementById('experience-timeline');
    if (!container || !Array.isArray(experience)) return;

    container.innerHTML = experience.map(exp => `
      <div class="timeline-item reveal">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-top">
            <h3 class="timeline-role">${this.escapeHtml(exp.role)}</h3>
            <span class="timeline-period">${this.escapeHtml(exp.period)}</span>
          </div>
          <div class="timeline-company">${this.escapeHtml(exp.company)} <span class="timeline-sep">•</span> ${this.escapeHtml(exp.location)}</div>
          <ul class="timeline-list">
            ${(exp.description || []).map(d => `<li>${this.escapeHtml(d)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  },

  /* ---------- Education ---------- */
  renderEducation(education) {
    const container = document.getElementById('education-timeline');
    if (!container || !Array.isArray(education)) return;

    container.innerHTML = education.map(edu => `
      <div class="timeline-item reveal">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-top">
            <h3 class="timeline-role">${this.escapeHtml(edu.degree)}</h3>
            <span class="timeline-period">${this.escapeHtml(edu.period)}</span>
          </div>
          <div class="timeline-company">${this.escapeHtml(edu.institution)} <span class="timeline-sep">•</span> ${this.escapeHtml(edu.location)}</div>
          <p class="timeline-details">${this.escapeHtml(edu.details)}</p>
        </div>
      </div>
    `).join('');
  },

  /* ---------- Research (compact, secondary) ---------- */
  renderResearch(research) {
    const container = document.getElementById('research-container');
    if (!container || !Array.isArray(research)) return;

    container.innerHTML = research.map(item => `
      <article class="research-card reveal">
        <div class="research-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v6M12 22v-6M5 7l3 4M19 17l-3-4M19 7l-3 4M5 17l3-4M12 12l4-1M12 12l-4 1M12 12l1 4M12 12l-1-4"/></svg>
        </div>
        <div>
          <h4 class="research-title">${this.escapeHtml(item.title)}</h4>
          <div class="research-meta">${this.escapeHtml(item.domain)} <span class="timeline-sep">•</span> ${this.escapeHtml(item.date)}</div>
          <p class="research-summary">${this.escapeHtml(item.summary)}</p>
        </div>
      </article>
    `).join('');
  },

  escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};
