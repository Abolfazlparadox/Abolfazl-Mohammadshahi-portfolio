/**
 * Data Service - Fetches JSON data with graceful inline fallback.
 * Fallback mirrors the canonical assets/data/*.json schemas.
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
        title: "Backend Software Engineer",
        tagline: "Building scalable web systems, robust backend architectures, and high-performance APIs.",
        bio: "Backend Software Engineer and M.Sc. student in Software Engineering at K. N. Toosi University of Technology. I design and ship distributed Django services — REST APIs, async task pipelines, and database architectures optimized for scale.",
        location: "Tehran / Sabzevar, Iran",
        email: "abolfazl.mohammadshahi@gmail.com",
        academic_email: "abolfazl.mohammadshahi@email.kntu.ac.ir",
        github: "https://github.com/Abolfazlparadox",
        linkedin: "https://linkedin.com/in/abolfazl-mohammadshahi-12b87b324",
        status: "Available for Backend & Software Engineering Roles",
        resume_url: "assets/cv/Abolfazl_Mohammadshahi_Resume.pdf",
        stats: [
          { value: 22, suffix: "", label: "Public Repos", icon: "github" },
          { value: 4, suffix: "", label: "E-Commerce APIs", icon: "code" },
          { value: 5, suffix: "+", label: "Years Building", icon: "clock" },
          { value: 12, suffix: "+", label: "Technologies", icon: "layers" }
        ],
        focus: ["Software Engineering","Backend Engineering","Python","Django","REST APIs","System Design","Distributed Systems","Clean Code","Scalable Applications","Open Source"]
      },
      'skills.json': [
        { category: "Backend Engineering", icon: "code", groups: [
          { level: "Core", skills: ["Python","Django","Django REST Framework","RESTful API Architecture","Celery & Redis"] },
          { level: "Infrastructure", skills: ["Docker & Docker Compose","RabbitMQ","Linux Systems","Git & GitHub"] }
        ]},
        { category: "Databases & Data", icon: "database", groups: [
          { level: "Databases", skills: ["PostgreSQL","MySQL","SQLite","SQL Optimization"] },
          { level: "Data", skills: ["Pandas","Data Analysis"] }
        ]},
        { category: "System Design & Architecture", icon: "layers", groups: [
          { level: "Architecture", skills: ["Distributed Systems","Microservices","Clean Architecture","Scalable Applications"] },
          { level: "Engineering", skills: ["Algorithm Design & Analysis","Gitflow Workflow","Open Source"] }
        ]},
        { category: "Frontend & Tooling", icon: "layout", groups: [
          { level: "Frontend", skills: ["HTML5 & CSS3","Vanilla JavaScript (ES6+)","Tailwind CSS","Bootstrap","Responsive Web Design"] },
          { level: "Tooling", skills: ["VS Code","Node.js","C# / .NET"] }
        ]}
      ],
      'projects.json': [
        { id:"parashop-api", title:"Parashop API", subtitle:"Production-Ready Distributed E-Commerce REST API",
          description:"A production-grade distributed e-commerce REST API built with Django 5.2 and DRF. Modular monolith core designed to pair with a planned FastAPI AI microservice.",
          image:"assets/images/project-parashop-api.png", github:"https://github.com/Abolfazlparadox/Parashop-API", demo:"", featured:true, year:"2026",
          role:"Backend Architect & Engineer", tags:["Python","Django","DRF","PostgreSQL","Redis","Celery","Docker","JWT"],
          architecture:["Modular Monolith","Clean Architecture","Distributed","Microservice-Ready"],
          highlights:["Custom User Model + JWT auth with custom token claims","Redis-backed cart isolated from PostgreSQL until checkout","Concurrency-safe payments via transaction.atomic + select_for_update","Celery Beat cancels unpaid orders every 5 min and restores inventory","Bilingual (fa/en) catalog with N+1 query optimization","ZarinPal gateway, coupons, throttling & Swagger docs"],
          snippet:"with transaction.atomic():\n    order = Order.objects.select_for_update().get(pk=id)\n    result = ZarinPalService.verify(authority)\n    if result.status == 'success':\n        order.status = 'paid'\n        order.save()" },
        { id:"ecommerce-ultimate", title:"Ecommerce-Ultimate", subtitle:"Full-Stack Retail Platform",
          description:"Comprehensive full-stack e-commerce solution covering the retail lifecycle — role-based auth, complex catalog, cart, and transactional checkout with an integrated Django Templates frontend.",
          image:"assets/images/project-ecommerce-ultimate.png", github:"https://github.com/Abolfazlparadox/Ecommerce-Ultimate", demo:"", featured:true, year:"2024",
          role:"Full-Stack Developer — Backend Architecture & Integration", tags:["Python","Django","JavaScript","HTML5","CSS3","PostgreSQL","Bootstrap"],
          architecture:["Full-Stack","Role-Based Auth","Transactional Checkout","Responsive"],
          highlights:["Custom auth with Customer / Vendor / Admin roles","Advanced catalog: categories, brands, variants, inventory","Transactional cart & checkout with order integrity","Localized: Jalali calendar, National ID & mobile validation","Responsive Django Templates frontend"],
          snippet:"@transaction.atomic\ndef place_order(user, cart):\n    order = Order.objects.create(user=user, total=cart.total)\n    for item in cart.items.select_related('product'):\n        Product.objects.filter(pk=item.product.pk)\\\n            .update(inventory=F('inventory') - item.qty)" },
        { id:"azad-shop", title:"Azad Shop", subtitle:"Advanced Distributed E-Commerce API",
          description:"Collaborative, highly scalable e-commerce backend for multi-branch retail. Built with a team using Gitflow, emphasizing clean code and ORM query optimization.",
          image:"assets/images/project-azad-shop.png", github:"https://github.com/Abolfazlparadox/azad_shop", demo:"", featured:false, year:"2025",
          role:"Backend / Architecture (Team Project)", tags:["Python","Django","DRF","PostgreSQL","Git"],
          architecture:["Distributed","Team / Gitflow","Scalable","RESTful"],
          highlights:["Collaborative architecture with Gitflow & agile","N+1 query elimination via select_related & prefetch_related","Fully decoupled DRF backend with comprehensive endpoints","Robust PostgreSQL modeling for catalogs & orders","Modular design ready for microservices expansion"],
          snippet:"class ProductViewSet(ReadOnlyModelViewSet):\n    queryset = Product.objects.select_related('category')\\\n        .prefetch_related('variants', 'images')\n    serializer_class = ProductSerializer" },
        { id:"wooden-shop", title:"Wooden Shop", subtitle:"Modular Django E-Commerce Architecture Foundation",
          description:"Clean, domain-driven Django 5.2 modular monolith foundation separating concerns into accounts, orders, and shop business domains.",
          image:"assets/images/project-wooden-shop.png", github:"https://github.com/Abolfazlparadox/wooden_shop", demo:"", featured:false, year:"2025",
          role:"Backend Engineer", tags:["Python","Django","SQLite","Django ORM"],
          architecture:["Modular Monolith","Domain-Driven","Clean Separation"],
          highlights:["Domain-driven app separation: accounts, orders, shop, core","Django 5.2 project with conventional structure","Foundation designed for a DRF API layer & PostgreSQL","Isolated business domains ready for scaling"],
          snippet:"wooden_shop/\n  accounts/   # auth & user domain\n  orders/     # order lifecycle domain\n  shop/       # catalog & product domain\n  core/       # settings, urls, wsgi/asgi" }
      ],
      'experience.json': [
        { role:"Full-Stack & Backend Web Developer", company:"Freelance / Remote", period:"2024 — Present", type:"Freelance", location:"Tehran, Iran",
          description:["Architected and deployed high-performance web features using Django REST Framework (DRF).","Designed relational database schemas and optimized SQL for high concurrency.","Containerized services with Docker and configured async tasks with Celery & Redis."] },
        { role:"Backend Software Engineering Intern", company:"Arta Rasaneh", period:"2020 — 2021", type:"Internship", location:"Iran",
          description:["Developed server-side API endpoints and integrated backend modules into core services.","Participated in code reviews, bug fixes, and Git branch workflows."] },
        { role:"IT & Systems Trainee", company:"Bank Melli Iran", period:"Apr 2020 — Jul 2020", type:"Internship", location:"Sabzevar, Iran",
          description:["Assisted in technical system operations and database support for loan processing services."] }
      ],
      'education.json': [
        { degree:"M.Sc. in Computer Engineering — Software", institution:"K. N. Toosi University of Technology (KNTU)", period:"2024 — Present", location:"Tehran, Iran", details:"Specializing in Web Systems, Algorithm Design, and Distributed Software Architecture." },
        { degree:"B.Sc. in Computer Engineering — Software", institution:"Islamic Azad University", period:"2021 — 2024", location:"Sabzevar, Iran", details:"Graduated with GPA 18.5 / 20. Focused on Software Architecture, Databases, and OOP." }
      ],
      'certificates.json': [
        { title:"CS50x: Introduction to Computer Science", issuer:"Harvard University / CS50", date:"2024", credential_id:"CS50x-2024", url:"#" },
        { title:"ICDL Certification", issuer:"Iran Technical & Vocational Training Organization", date:"2023", credential_id:"ICDL-FULL", url:"#" }
      ],
      'research.json': [
        { title:"Concurrency-Safe Order Processing in Distributed E-Commerce", domain:"Backend Systems & Reliability", institution:"Applied in Parashop API", date:"2026", summary:"Practical study of idempotency and race-condition prevention in payment flows using row locking and transactional boundaries." },
        { title:"Quantum-Inspired Optimization for Software Requirement Selection", domain:"Optimization & Software Engineering", institution:"K. N. Toosi University of Technology", date:"Ongoing", summary:"Exploring quantum-inspired metaheuristics for optimal requirement selection and release scheduling." }
      ]
    };
    return fallbacks[filename] || [];
  }
};
