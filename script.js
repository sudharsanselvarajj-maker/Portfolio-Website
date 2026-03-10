document.addEventListener('DOMContentLoaded', () => {
    // Vanta.js Hero Background
    if (typeof VANTA !== 'undefined') {
        VANTA.NET({
            el: "#hero-vanta",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x6c63ff,
            backgroundColor: 0x020202,
            points: 7.00,
            maxDistance: 15.00,
            spacing: 20.00
        });
    }

    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const cursorOutline = document.querySelector('.custom-cursor-outline');

    if (cursor && cursorOutline && window.innerWidth > 900) {
        window.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            cursorOutline.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
        });

        document.querySelectorAll('a, button, .project-card, .id-card-glass, .nav-link').forEach(item => {
            item.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
            item.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
        });
    }

    // Vanilla Tilt
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".project-card"), {
            max: 8, speed: 400, glare: true, "max-glare": 0.15
        });
        VanillaTilt.init(document.querySelectorAll(".img-card"), {
            max: 10, speed: 400
        });
    }

    // Typing Effect
    const typingText = document.querySelector('.typing-text');
    const roles = ['Full Stack Developer', 'Python Developer', 'Prompt Engineer'];
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
        if (!typingText) return;
        if (roleIndex >= roles.length) roleIndex = 0;
        const cur = roles[roleIndex];

        typingText.textContent = isDeleting
            ? cur.substring(0, charIndex - 1)
            : cur.substring(0, charIndex + 1);

        isDeleting ? charIndex-- : charIndex++;

        let delay = isDeleting ? 50 : 100;
        if (!isDeleting && charIndex === cur.length) { isDeleting = true; delay = 2000; }
        else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex++; delay = 500; }

        setTimeout(type, delay);
    }
    if (typingText) type();

    // Mobile Menu Toggle (guarded)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Active Link Scroll Highlight & Header Background
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', () => {
            header.style.background = window.scrollY > 50
                ? 'rgba(10,10,10,0.95)'
                : 'rgba(10,10,10,0.9)';
            header.style.boxShadow = window.scrollY > 50
                ? '0 5px 20px rgba(0,0,0,0.5)'
                : 'none';

            let current = '';
            sections.forEach(section => {
                if (pageYOffset >= (section.offsetTop - section.clientHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') && item.getAttribute('href').includes(current)) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ── Scroll Reveal (hidden-bottom / hidden-left / hidden-right) ──────────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('show');
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    document.querySelectorAll('.hidden-left, .hidden-right, .hidden-bottom, .hidden-dark-reveal')
        .forEach(el => observer.observe(el));

    // ── Project Cards: always visible, subtle entrance via CSS ───────────────
    // Removed GSAP from() call that was setting opacity:0 and blocking cards.
    // The project-card CSS handles hover and transitions natively.

    // ── GSAP: About section parallax only ───────────────────────────────────
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to(".about-img", {
            scrollTrigger: {
                trigger: ".about",
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -50,
            ease: "none"
        });
    }
});
