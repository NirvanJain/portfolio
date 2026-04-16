// ===== PORTFOLIO — MONCY.DEV INSPIRED =====

(function () {
    'use strict';

    // ===== PAGE LOAD — reveal hero elements =====
    function revealHeroElements() {
        const elements = document.querySelectorAll('.hero [data-reveal]');
        elements.forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), 300 + i * 200);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', revealHeroElements);
    } else {
        revealHeroElements();
    }

    // ===== CUSTOM CURSOR =====
    const cursorEl = document.getElementById('cursor');
    const followerEl = document.getElementById('cursorFollower');
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (isFinePointer && cursorEl && followerEl) {
        const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const curPos = { x: mouse.x, y: mouse.y };
        const flPos = { x: mouse.x, y: mouse.y };

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        const interactive = 'a, button, .project-card, .service-card, .tech-orb, .project-link, .contact-value, .contact-socials a, input, textarea';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactive)) document.body.classList.add('cursor-hover');
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactive)) document.body.classList.remove('cursor-hover');
        });

        (function tick() {
            curPos.x += (mouse.x - curPos.x) * 0.3;
            curPos.y += (mouse.y - curPos.y) * 0.3;
            flPos.x += (mouse.x - flPos.x) * 0.1;
            flPos.y += (mouse.y - flPos.y) * 0.1;
            cursorEl.style.transform = `translate3d(${curPos.x - 4}px, ${curPos.y - 4}px, 0)`;
            followerEl.style.transform = `translate3d(${flPos.x - 20}px, ${flPos.y - 20}px, 0)`;
            requestAnimationFrame(tick);
        })();
    }

    // ===== CARD GLOW FOLLOW MOUSE =====
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', ((e.clientX - r.left) / r.width * 100) + '%');
            card.style.setProperty('--mouse-y', ((e.clientY - r.top) / r.height * 100) + '%');
        });
    });

    // ===== NAVIGATION SCROLL =====
    const nav = document.getElementById('mainNav');
    let navTicking = false;

    if (nav) {
        window.addEventListener('scroll', () => {
            if (!navTicking) {
                requestAnimationFrame(() => {
                    if (window.pageYOffset > 100) nav.classList.add('scrolled');
                    else nav.classList.remove('scrolled');
                    navTicking = false;
                });
                navTicking = true;
            }
        }, { passive: true });
    }

    // ===== HERO CANVAS — PARTICLE CONSTELLATION =====
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w = 0, h = 0, pts = [];
        const mouseC = { x: -1000, y: -1000 };
        const COUNT = 80, LINK = 150, MR = 200;

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.parentElement.getBoundingClientRect();
            w = rect.width; h = rect.height;
            canvas.width = w * dpr; canvas.height = h * dpr;
            canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        }

        function init() {
            pts = [];
            for (let i = 0; i < COUNT; i++) {
                pts.push({
                    x: Math.random() * w, y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
                    r: Math.random() * 1.5 + 0.5, a: Math.random() * 0.4 + 0.1
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);

            // Update & draw particles
            for (const p of pts) {
                p.x += p.vx; p.y += p.vy;
                const dx = p.x - mouseC.x, dy = p.y - mouseC.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < MR && d > 0) {
                    const f = (MR - d) / MR;
                    p.vx += (dx / d) * f * 0.3;
                    p.vy += (dy / d) * f * 0.3;
                }
                p.vx *= 0.99; p.vy *= 0.99;
                if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(123,94,167,${p.a})`;
                ctx.fill();
            }

            // Connections between particles
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < LINK) {
                        const a = (1 - d / LINK) * 0.12;
                        const g = ctx.createLinearGradient(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
                        g.addColorStop(0, `rgba(123,94,167,${a})`);
                        g.addColorStop(1, `rgba(74,158,255,${a})`);
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.strokeStyle = g; ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Mouse connections
            if (mouseC.x > 0) {
                for (const p of pts) {
                    const dx = p.x - mouseC.x, dy = p.y - mouseC.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < MR) {
                        ctx.beginPath();
                        ctx.moveTo(mouseC.x, mouseC.y);
                        ctx.lineTo(p.x, p.y);
                        ctx.strokeStyle = `rgba(123,94,167,${(1 - d / MR) * 0.25})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        }

        resize(); init(); draw();
        window.addEventListener('resize', () => { resize(); init(); });

        canvas.parentElement.addEventListener('mousemove', (e) => {
            const r = canvas.parentElement.getBoundingClientRect();
            mouseC.x = e.clientX - r.left; mouseC.y = e.clientY - r.top;
        });
        canvas.parentElement.addEventListener('mouseleave', () => {
            mouseC.x = -1000; mouseC.y = -1000;
        });
    }

    // ===== ROLE TEXT CYCLING =====
    const roles = document.querySelectorAll('.role');
    if (roles.length > 0) {
        let cur = 0;
        setInterval(() => {
            roles[cur].classList.remove('active');
            cur = (cur + 1) % roles.length;
            roles[cur].classList.add('active');
        }, 2500);
    }

    // ===== SCROLL REVEAL =====
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('[data-reveal]:not(.hero [data-reveal])').forEach(el => {
        revealObs.observe(el);
    });

    // ===== TIMELINE GLOW FILL =====
    const tlFill = document.getElementById('timelineFill');
    const tlSection = document.getElementById('timeline');
    if (tlFill && tlSection) {
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const r = tlSection.getBoundingClientRect();
                const vh = window.innerHeight;
                if (r.top < vh && r.bottom > 0) {
                    const p = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh * 0.3)));
                    tlFill.style.height = (p * 100) + '%';
                }
            });
        }, { passive: true });
    }

    // ===== SMOOTH SCROLL LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            const sy = window.pageYOffset;
            const ty = target.offsetTop - 80;
            const dist = ty - sy;
            const dur = 900;
            const start = performance.now();
            const ease = t => 1 - Math.pow(1 - t, 4);

            (function step(now) {
                const p = Math.min((now - start) / dur, 1);
                window.scrollTo(0, sy + dist * ease(p));
                if (p < 1) requestAnimationFrame(step);
            })(performance.now());
        });
    });

    // ===== SOCIAL RAIL DOCKING =====
    const socialSidebar = document.getElementById('socialSidebar');
    const contactSocials = document.querySelector('.contact-socials');
    if (socialSidebar && contactSocials) {
        const setSocialDocked = (docked) => {
            document.body.classList.toggle('socials-docked', docked);
            contactSocials.classList.toggle('is-docked', docked);
        };

        const socialDockObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                setSocialDocked(entry.isIntersecting && entry.intersectionRatio >= 0.35);
            });
        }, { threshold: [0.2, 0.35, 0.55], rootMargin: '0px 0px -12% 0px' });

        socialDockObs.observe(contactSocials);
    }

    // ===== MAGNETIC HOVER =====
    document.querySelectorAll('.project-link, .nav-links a, .contact-socials a, .social-sidebar a').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
            const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
            el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
            el.style.transition = 'transform 0.15s ease-out';
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate3d(0, 0, 0)';
            el.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
        });
    });

    // ===== TEXT SCRAMBLE ON HOVER =====
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    document.querySelectorAll('.project-title, .service-card h3, .section-heading h2').forEach(el => {
        let busy = false;
        el.addEventListener('mouseenter', () => {
            if (busy) return;
            busy = true;
            const orig = el.textContent;
            let iter = 0;
            const iv = setInterval(() => {
                el.textContent = orig.split('').map((c, i) => {
                    if (c === ' ') return ' ';
                    return i < iter ? orig[i] : chars[Math.floor(Math.random() * chars.length)];
                }).join('');
                iter += 0.4;
                if (iter >= orig.length) { clearInterval(iv); el.textContent = orig; busy = false; }
            }, 40);
        });
    });

    // ===== TECH ORB FLOAT ANIMATION =====
    const orbStyle = document.createElement('style');
    orbStyle.textContent = `
        @keyframes orbFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        .tech-orb:hover { animation-play-state: paused; transform: translateY(-6px) !important; }
    `;
    document.head.appendChild(orbStyle);

    document.querySelectorAll('.tech-orb').forEach((orb) => {
        orb.style.animation = `orbFloat ${3 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`;
    });

    // ===== VIEWPORT FRAME GLOW BREATHING =====
    const corners = document.querySelectorAll('.frame-corner');
    let phase = 0;

    (function breathe() {
        phase += 0.005;
        corners.forEach((c, i) => {
            const p = phase + i * Math.PI / 2;
            const intensity = 0.3 + Math.sin(p) * 0.15;
            const s = 8 + Math.sin(p) * 4;
            const purple = `rgba(123,94,167,${intensity})`;
            const blue = `rgba(74,158,255,${intensity})`;
            const clr = (i === 0 || i === 3) ? purple : blue;
            const signs = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
            c.style.boxShadow = `${signs[i][0] * s}px ${signs[i][1] * s}px ${s * 2}px ${clr}`;
        });
        requestAnimationFrame(breathe);
    })();

    // ===== CONSOLE EASTER EGG =====
    console.log(
        '%c\n🚀 Portfolio\n%c\nBuilt with ❤️ using vanilla HTML, CSS & JavaScript\nInspired by moncy.dev\n',
        'font-size: 18px; font-weight: bold; color: #7B5EA7;',
        'font-size: 12px; color: #8a8a9a;'
    );

})();
