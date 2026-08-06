/**
 * Render Engine - Populates DOM elements with clean semantic HTML
 */
const RenderEngine = {
  renderProfile(profile) {
    if (!profile) return;
    
    // Header & Hero Profile Fields
    const nameEls = document.querySelectorAll('.profile-name');
    nameEls.forEach(el => {
      el.textContent = profile.name;
    });

    const taglineEl = document.getElementById('hero-tagline');
    if (taglineEl) taglineEl.textContent = profile.tagline;

    const bioEl = document.getElementById('about-bio');
    if (bioEl) bioEl.textContent = profile.bio;

    const statusEl = document.getElementById('availability-status');
    if (statusEl) statusEl.textContent = profile.status;

    // Contact Email Links
    const emailEls = document.querySelectorAll('.profile-email');
    emailEls.forEach(el => {
      el.href = `mailto:${profile.email}`;
      el.textContent = profile.email;
    });

    // Social Links
    const githubLink = document.getElementById('github-link');
    if (githubLink) githubLink.href = profile.github;

    const linkedinLink = document.getElementById('linkedin-link');
    if (linkedinLink) linkedinLink.href = profile.linkedin;

    const cvLink = document.getElementById('resume-download-btn');
    if (cvLink) cvLink.href = profile.resume_url;
  },

  /**
   * Priority 1 Fix 2: Render Skills with level label appearing ONCE per group
   */
  renderSkills(skills) {
    const container = document.getElementById('skills-container');
    if (!container || !Array.isArray(skills)) return;

    container.innerHTML = skills.map(cat => {
      const groupsHtml = (cat.groups || []).map(group => `
        <div class="skill-group">
          <div class="skill-level-heading">${group.level}</div>
          <div class="skill-tags">
            ${(group.skills || []).map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
          </div>
        </div>
      `).join('');

      return `
        <div class="skill-card reveal">
          <h3 class="skill-card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            ${cat.category}
          </h3>
          ${groupsHtml}
        </div>
      `;
    }).join('');
  },

  /**
   * Priority 1 Fix 9 & Fix 12: Render Project Cards with Visual Interactivity & High Contrast
   */
  renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container || !Array.isArray(projects)) return;

    container.innerHTML = projects.map(project => `
      <article class="project-card reveal">
        <div class="project-visual">
          <pre class="project-code-snippet"><code>${this.escapeHtml(project.snippet || '// Core implementation')}</code></pre>
        </div>
        <div class="project-content">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-tags">
            ${(project.tags || []).map(tag => `<span class="project-tag">${tag}</span>`).join('')}
          </div>
          <div class="project-links">
            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View ${project.title} on GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              GitHub Repository
            </a>
          </div>
        </div>
      </article>
    `).join('');
  },

  renderExperience(experience) {
    const container = document.getElementById('experience-timeline');
    if (!container || !Array.isArray(experience)) return;

    container.innerHTML = experience.map(exp => `
      <div class="timeline-item reveal">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <h3 class="timeline-role">${exp.role}</h3>
          <div class="timeline-company">${exp.company} • ${exp.location}</div>
          <div class="timeline-period">${exp.period}</div>
          <ul class="timeline-list">
            ${(exp.description || []).map(desc => `<li>${desc}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  },

  renderEducation(education) {
    const container = document.getElementById('education-timeline');
    if (!container || !Array.isArray(education)) return;

    container.innerHTML = education.map(edu => `
      <div class="timeline-item reveal">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <h3 class="timeline-role">${edu.degree}</h3>
          <div class="timeline-company">${edu.institution} • ${edu.location}</div>
          <div class="timeline-period">${edu.period}</div>
          <p style="font-size: 0.9375rem; color: var(--text-secondary);">${edu.details}</p>
        </div>
      </div>
    `).join('');
  },

  renderResearch(research) {
    const container = document.getElementById('research-container');
    if (!container || !Array.isArray(research)) return;

    container.innerHTML = research.map(item => `
      <article class="timeline-card reveal" style="margin-bottom: 1.5rem;">
        <h3 class="timeline-role">${item.title}</h3>
        <div class="timeline-company">${item.domain} • ${item.institution}</div>
        <div class="timeline-period">${item.date}</div>
        <p style="font-size: 0.9375rem; color: var(--text-secondary);">${item.summary}</p>
      </article>
    `).join('');
  },

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};
