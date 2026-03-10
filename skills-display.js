// ── Rich Skill Data ───────────────────────────────────────────────────────────
const SKILLS_DATA = [
    {
        category: "Frontend", color: "#6c63ff",
        skills: [
            {
                name: "HTML", icon: "devicon-html5-plain", levelPct: 95,
                what: "HyperText Markup Language — the structural backbone of every web page, defining elements like headings, links, forms, and media.",
                use:  "I write semantic, accessible HTML to build clean page structure and ensure SEO-friendliness in all my projects.",
                projects: ["Portfolio", "FitGear", "E-Commerce UI"]
            },
            {
                name: "CSS", icon: "devicon-css3-plain", levelPct: 92,
                what: "Cascading Style Sheets — a language for styling HTML with layouts, colors, animations, and responsive designs.",
                use:  "Used to craft pixel-perfect designs, smooth animations, glassmorphism effects, and fully responsive layouts.",
                projects: ["Portfolio", "FitGear", "SaaS Landing Page"]
            },
            {
                name: "JavaScript", icon: "devicon-javascript-plain", levelPct: 78,
                what: "A high-level, interpreted language that brings interactivity and dynamic behavior to web pages in the browser.",
                use:  "Used for DOM manipulation, async API calls, interactive UI components, and logic in all my front-end projects.",
                projects: ["College Bus System", "Portfolio", "Mini Games"]
            },
            {
                name: "Bootstrap", icon: "devicon-bootstrap-plain", levelPct: 72,
                what: "A popular CSS framework with pre-built components and a responsive grid system for rapid UI development.",
                use:  "Used for rapid prototyping of responsive layouts and consistent component styling across admin panels.",
                projects: ["Admin Panels", "FitGear"]
            }
        ]
    },
    {
        category: "Backend", color: "#00c9a7",
        skills: [
            {
                name: "Python", icon: "devicon-python-plain", levelPct: 88,
                what: "A versatile, readable high-level language widely used for web backends, automation, data science and AI.",
                use:  "My primary backend language — used to build APIs, automation scripts, and web servers with Flask.",
                projects: ["College Bus System", "Automation Scripts", "Flask APIs"]
            },
            {
                name: "Flask", icon: "devicon-flask-original", levelPct: 74,
                what: "A lightweight Python micro web framework for building RESTful APIs and server-side web applications.",
                use:  "Used to create the backend of my College Bus Management System with route handling, templates, and database integration.",
                projects: ["College Bus Management System"]
            },
            {
                name: "Node.js", icon: "devicon-nodejs-plain", levelPct: 70,
                what: "A JavaScript runtime built on Chrome's V8 engine, enabling server-side JavaScript execution.",
                use:  "Used to build real-time features like chat and notifications, and to serve REST APIs for front-end applications.",
                projects: ["Real-time Chat App", "E-Commerce Backend"]
            },
            {
                name: "REST API", icon: "fas fa-network-wired", levelPct: 75,
                what: "An architectural style for designing networked applications using HTTP methods (GET, POST, PUT, DELETE).",
                use:  "Designed and consumed RESTful APIs to connect front-end clients with back-end services and databases.",
                projects: ["College Bus System", "Unified Auth Service"]
            }
        ]
    },
    {
        category: "Database", color: "#f0a500",
        skills: [
            {
                name: "MySQL", icon: "devicon-mysql-plain", levelPct: 85,
                what: "A popular open-source relational database management system using structured tables and SQL queries.",
                use:  "Used to design and manage relational schemas, write complex queries, and handle persistent data storage.",
                projects: ["College Bus System", "Inventory Manager"]
            },
            {
                name: "SQL", icon: "fas fa-database", levelPct: 85,
                what: "Structured Query Language — the standard language for managing and querying relational databases.",
                use:  "Used to write optimized queries with JOINs, subqueries, aggregations and indexes for data-heavy applications.",
                projects: ["College Bus System", "Reporting Tool"]
            }
        ]
    },
    {
        category: "Tools", color: "#e05a7a",
        skills: [
            {
                name: "Git", icon: "devicon-git-plain", levelPct: 90,
                what: "A distributed version control system that tracks changes in source code and enables team collaboration.",
                use:  "Used daily for branching, committing, merging, and managing code history across all my projects.",
                projects: ["All Projects"]
            },
            {
                name: "GitHub", icon: "devicon-github-original", levelPct: 88,
                what: "A cloud-based hosting platform for Git repositories with collaboration, issue tracking, and CI/CD features.",
                use:  "Used to host all my projects, manage pull requests, and automate deployments via GitHub Actions.",
                projects: ["Open Source Contributions", "Portfolio"]
            },
            {
                name: "Render", icon: "devicon-render-plain", levelPct: 70,
                what: "A modern cloud platform for deploying web apps, APIs, and databases with zero-config deployment.",
                use:  "Used to deploy my College Bus System backend with automatic builds on every Git push.",
                projects: ["College Bus System Deployment"]
            }
        ]
    }
];

// ────────────────────────────────────────────────────────────────────────────
// SCROLLING MARQUEE
// ────────────────────────────────────────────────────────────────────────────
(function buildMarquee() {
    const container = document.getElementById('marquee-container');
    if (!container) return;

    // Flatten all skills
    const all = [];
    SKILLS_DATA.forEach(cat => {
        cat.skills.forEach(skill => all.push({ ...skill, color: cat.color, category: cat.category }));
    });

    // 3 slightly offset tracks, each doubled for seamless loop
    const offsets = [0, 3, 7];
    const durations = [32, 25, 40];
    const directions = [false, true, false];

    offsets.forEach((off, ti) => {
        const rotated = [...all.slice(off), ...all.slice(0, off)];
        const doubled = [...rotated, ...rotated];

        const trackEl = document.createElement('div');
        trackEl.className = 'mq-track';

        const inner = document.createElement('div');
        inner.className = 'mq-inner';
        inner.style.animationDuration = `${durations[ti]}s`;
        inner.style.animationDirection = directions[ti] ? 'reverse' : 'normal';

        doubled.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'mq-card';
            card.style.setProperty('--card-color', skill.color);
            card.setAttribute('data-skill', skill.name);
            card.innerHTML = `
                <div class="mq-card-icon"><i class="${skill.icon}" style="color:${skill.color}"></i></div>
                <div class="mq-card-info">
                    <span class="mq-card-name">${skill.name}</span>
                    <span class="mq-card-cat" style="color:${skill.color}">${skill.category}</span>
                </div>
                <div class="mq-card-click-hint"><i class="fas fa-arrow-up-right-from-square"></i></div>
            `;

            card.addEventListener('click', () => openSkillPopup(skill));
            inner.appendChild(card);
        });

        trackEl.appendChild(inner);
        container.appendChild(trackEl);

        // Pause row on hover
        trackEl.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
        trackEl.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
    });
})();

// ────────────────────────────────────────────────────────────────────────────
// SKILL DETAIL POPUP
// ────────────────────────────────────────────────────────────────────────────
function openSkillPopup(skill) {
    const popup   = document.getElementById('skill-detail-popup');
    if (!popup) return;

    document.getElementById('sdp-icon').innerHTML     = `<i class="${skill.icon}" style="color:${skill.color}"></i>`;
    document.getElementById('sdp-name').textContent   = skill.name;
    document.getElementById('sdp-name').style.color   = skill.color;
    document.getElementById('sdp-category').textContent = skill.category;
    document.getElementById('sdp-category').style.color = skill.color;
    document.getElementById('sdp-what').textContent   = skill.what;
    document.getElementById('sdp-use').textContent    = skill.use;

    const tagsEl = document.getElementById('sdp-projects');
    tagsEl.innerHTML = '';
    skill.projects.forEach(p => {
        const tag = document.createElement('span');
        tag.className = 'sdp-project-tag';
        tag.textContent = p;
        tag.style.borderColor = skill.color + '66';
        tag.style.color = skill.color;
        tagsEl.appendChild(tag);
    });

    // Tint the card accent
    popup.querySelector('.sdp-card').style.borderColor = skill.color + '55';

    popup.classList.remove('sdp-hidden');
    popup.classList.add('sdp-visible');
}

function closeSkillPopup() {
    const popup = document.getElementById('skill-detail-popup');
    if (popup) {
        popup.classList.remove('sdp-visible');
        popup.classList.add('sdp-hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('sdp-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeSkillPopup);

    const popup = document.getElementById('skill-detail-popup');
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) closeSkillPopup();
        });
    }
});
