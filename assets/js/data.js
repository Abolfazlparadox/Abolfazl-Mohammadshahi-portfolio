/**
 * Data Service - Fetches JSON data with graceful fallback handling
 */
const DataService = {
  async fetchJson(filename) {
    try {
      const response = await fetch(`assets/data/${filename}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn(`DataService: Failed to fetch ${filename}, using internal fallback.`, error);
      return this.getFallback(filename);
    }
  },

  getFallback(filename) {
    const fallbacks = {
      'profile.json': {
        name: "Abolfazl Mohammadshahi",
        title: "Backend Software Developer & Software Engineering Student",
        tagline: "Building scalable web systems, robust backend architectures, and high-performance APIs.",
        bio: "Software Engineer pursuing an M.Sc. in Software Engineering at K. N. Toosi University of Technology. Experienced in backend development using Python, Django, Docker, Celery, and Redis.",
        location: "Tehran / Sabzevar, Iran",
        email: "abolfazl.mohammadshahi@gmail.com",
        academic_email: "abolfazl.mohammadshahi@email.kntu.ac.ir",
        phone: "+98 935 672 7789",
        github: "https://github.com/Abolfazlparadox",
        linkedin: "https://linkedin.com/in/abolfazl-mohammadshahi-12b87b324",
        status: "Available for Technical Roles & Research Collaboration",
        resume_url: "assets/cv/Abolfazl_Mohammadshahi_Resume.pdf"
      },
      'skills.json': [
        {
          category: "Backend & Distributed Systems",
          groups: [
            { level: "Advanced", skills: ["Python", "Django", "Django REST Framework", "RESTful API Architecture", "Git & GitHub"] },
            { level: "Intermediate", skills: ["Docker & Docker Compose", "Celery & Redis", "C# / .NET", "Linux Systems"] }
          ]
        },
        {
          category: "Databases & Data Engineering",
          groups: [
            { level: "Intermediate", skills: ["PostgreSQL", "MySQL", "Data Analysis & Pandas", "SQL Optimization"] }
          ]
        },
        {
          category: "Frontend & Web Technologies",
          groups: [
            { level: "Intermediate", skills: ["HTML5 & CSS3", "Vanilla JavaScript (ES6+)", "Responsive Web Design"] }
          ]
        },
        {
          category: "Computer Science & Academic Research",
          groups: [
            { level: "Advanced / Research", skills: ["Algorithm Design & Analysis", "ANTLR & Grammars", "Information Hiding", "Quantum Optimization Models"] }
          ]
        }
      ],
      'projects.json': [
        {
          id: "code-obfuscator",
          title: "Source Code Obfuscator & Anti-Tamper Engine",
          description: "An automated code obfuscation and information hiding system built with Python and ANTLR parser grammars.",
          tags: ["Python", "ANTLR", "AST", "Information Hiding", "Security"],
          github: "https://github.com/Abolfazlparadox",
          demo: "#",
          featured: true,
          snippet: "class ObfuscatorVisitor(PythonVisitor):\n    def visitFunctionDef(self, ctx):\n        new_name = generate_hash(ctx.name)\n        self.symbol_table[ctx.name] = new_name"
        },
        {
          id: "task-pipeline",
          title: "Scalable Asynchronous Task Processing Pipeline",
          description: "High-throughput backend task queue architecture utilizing Django REST Framework, Celery workers, and Redis message brokering.",
          tags: ["Python", "Django", "Celery", "Redis", "Docker"],
          github: "https://github.com/Abolfazlparadox",
          demo: "#",
          featured: true,
          snippet: "@app.task(bind=True, max_retries=3)\ndef process_batch_job(self, batch_id):\n    return TaskPipeline.execute(batch_id)"
        }
      ],
      'experience.json': [
        {
          role: "Full-Stack & Backend Web Developer",
          company: "Freelance / Remote",
          period: "2024 — Present",
          description: [
            "Architected and deployed high-performance web features using Django REST Framework (DRF).",
            "Containerized application services using Docker and configured Celery & Redis background tasks."
          ]
        }
      ],
      'education.json': [
        {
          degree: "Master of Science (M.Sc.) in Computer Engineering — Software",
          institution: "K. N. Toosi University of Technology (KNTU)",
          period: "2024 — Present",
          details: "Specializing in Web Systems, Algorithm Design, Artificial Intelligence, and Information Hiding."
        }
      ],
      'certificates.json': [
        { title: "CS50x: Introduction to Computer Science", issuer: "Harvard University / CS50", date: "2024" }
      ],
      'research.json': [
        {
          title: "Effects of Removing User-Land Hooks in Endpoint Protection",
          domain: "Information Hiding & Evasion Techniques",
          institution: "K. N. Toosi University of Technology",
          date: "2026",
          summary: "Investigated memory unhooking evasion techniques in modern EDR systems."
        }
      ]
    };
    return fallbacks[filename] || [];
  }
};
