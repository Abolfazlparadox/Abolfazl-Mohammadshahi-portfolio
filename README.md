# Abolfazl Mohammadshahi — Backend Software Engineer Portfolio

A fast, premium, animated developer portfolio built with **modular Vanilla HTML5, CSS Custom Properties, and JavaScript ES6+**, powered by **GSAP + ScrollTrigger** for motion design. No frameworks, no build step — just static files ready to deploy.

## Highlights

- **Premium motion design** — GSAP timelines, ScrollTrigger batch reveals, parallax, 3D tilt cards, magnetic buttons, custom cursor, animated counters, scroll progress bar, ambient gradient background.
- **Modular architecture** — small, single-responsibility JS modules: `theme.js`, `icons.js`, `data.js`, `render.js`, `nav.js`, `reveal.js`, `motion.js`, `main.js`.
- **Colorful tech icons** — 37 brand & concept SVG icons (official simple-icons paths) rendered inline via a smart matcher (`TechIcons`).
- **Real GitHub projects** — 4 featured e-commerce / distributed-system repos with architecture tags, engineering highlights, code snippets, and preview visuals.
- **Working contact form** — FormSubmit (free, no backend) with validation, loading state, success animation, error states, and honeypot spam protection.
- **Dark-first theme** — electric-blue accent on near-black; light theme toggle with localStorage persistence.
- **Accessibility** — semantic HTML, ARIA labels, keyboard navigation, focus-visible, reduced-motion support.
- **SEO** — OpenGraph, Twitter Card, JSON-LD Person schema, canonical, sitemap, robots, web manifest.
- **Responsive** — desktop, laptop, tablet, mobile (mobile drawer navigation).

## Stack Architecture

- **HTML5** — semantic, WCAG-minded.
- **CSS3** — tokens (`tokens.css`), base (`base.css`), layout (`layout.css`), components (`components.css`), motion (`motion.css`), responsive (`responsive.css`).
- **Vanilla JavaScript ES6+** — modular, no bundler.
- **Data** — JSON content in `assets/data/*.json` with inline fallbacks in `data.js`.
- **GSAP 3.12 + ScrollTrigger** — loaded via CDN (deferred).

## File Structure

```
├── index.html              # Single-page portfolio
├── 404.html                 # Not-found page
├── robots.txt / sitemap.xml # SEO
├── assets/
│   ├── css/                 # 6 modular stylesheets
│   ├── js/                  # 8 modular scripts
│   ├── data/                # 7 JSON content files
│   └── images/              # profile, generated visuals, og-cover, manifest
```

## How to Run & Preview

Serve the static directory with any local web server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Or deploy directly to any static host (Cloudflare Pages/Workers, GitHub Pages, Netlify, Vercel).

## Contact Form Setup (one-time)

The contact form uses [FormSubmit](https://formsubmit.co) — free, no signup, no backend. The endpoint is derived automatically from the email in `assets/data/profile.json`.

**One-time activation:** the first time a visitor submits the form, FormSubmit sends a confirmation email to `abolfazl.mohammadshahi@gmail.com`. Click the confirmation link once to activate delivery. After that, all submissions are delivered and the visitor is redirected back with a success confirmation.

## License

For educational and portfolio demonstration purposes.
