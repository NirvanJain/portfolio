// ===== PREMIUM CUSTOM CURSOR WITH PHYSICS =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

// Cursor physics state
let cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let followerPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cursorVelocity = { x: 0, y: 0 };

// Easing constants for smooth interpolation
const CURSOR_LERP = 0.35;      // Main cursor follows mouse (higher = snappier)
const FOLLOWER_LERP = 0.12;    // Follower lags behind (lower = more drag)
const DAMPING = 0.85;          // Velocity damping for natural deceleration

// Create cursor trail dots
function createCursorTrail() {
    const trailDots = [];
    const trailLength = 8;

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        document.body.appendChild(dot);
        trailDots.push({
            element: dot,
            x: mousePos.x,
            y: mousePos.y,
            opacity: 0
        });
    }
    return trailDots;
}

const trailDots = window.matchMedia('(pointer: fine)').matches ? createCursorTrail() : [];

// Smooth cursor animation loop
function animateCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    // Calculate velocity
    cursorVelocity.x = (mousePos.x - cursorPos.x) * 0.1;
    cursorVelocity.y = (mousePos.y - cursorPos.y) * 0.1;

    // Apply easing with velocity-based smoothing
    cursorPos.x += (mousePos.x - cursorPos.x) * CURSOR_LERP;
    cursorPos.y += (mousePos.y - cursorPos.y) * CURSOR_LERP;

    // Follower follows with more delay for premium feel
    followerPos.x += (cursorPos.x - followerPos.x) * FOLLOWER_LERP;
    followerPos.y += (cursorPos.y - followerPos.y) * FOLLOWER_LERP;

    // Apply transforms with sub-pixel precision
    cursor.style.transform = `translate3d(${cursorPos.x - 6}px, ${cursorPos.y - 6}px, 0)`;
    cursorFollower.style.transform = `translate3d(${followerPos.x - 25}px, ${followerPos.y - 25}px, 0)`;

    // Animate trail dots
    trailDots.forEach((dot, index) => {
        const prevDot = index === 0 ? { x: cursorPos.x, y: cursorPos.y } : trailDots[index - 1];
        const targetX = prevDot.x;
        const targetY = prevDot.y;

        dot.x += (targetX - dot.x) * 0.4;
        dot.y += (targetY - dot.y) * 0.4;

        // Fade out trail
        dot.opacity = Math.max(0, 1 - index * 0.12 - Math.abs(cursorVelocity.x + cursorVelocity.y) * 0.02);

        dot.element.style.transform = `translate3d(${dot.x - 2}px, ${dot.y - 2}px, 0)`;
        dot.element.style.opacity = dot.opacity;
    });

    requestAnimationFrame(animateCursor);
}

if (window.matchMedia('(pointer: fine)').matches) {
    animateCursor();

    document.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });

    // Click effect
    document.addEventListener('mousedown', () => document.body.classList.add('clicking'));
    document.addEventListener('mouseup', () => document.body.classList.remove('clicking'));

    // Enhanced interactive elements detection
    const interactiveSelector = 'a, button, .project-card, .skill-item, .project-link, .nav-links a, .contact-email, .social-links a, input, textarea';
    const interactiveElements = document.querySelectorAll(interactiveSelector);

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });
}

// ===== SMOOTH SCROLL PROGRESS BAR WITH GLOW =====
const scrollProgress = document.querySelector('.scroll-progress');
let scrollProgressValue = 0;
let scrollProgressTarget = 0;

window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    scrollProgressTarget = (window.pageYOffset / documentHeight) * 100;
});

function animateScrollProgress() {
    // Smooth interpolation for progress bar
    scrollProgressValue += (scrollProgressTarget - scrollProgressValue) * 0.15;
    scrollProgress.style.width = scrollProgressValue + '%';

    // Add glow effect based on scroll velocity
    const velocity = Math.abs(scrollProgressTarget - scrollProgressValue);
    if (velocity > 2) {
        scrollProgress.style.boxShadow = '0 0 20px rgba(249, 53, 73, 0.6), 0 0 40px rgba(249, 53, 73, 0.3)';
    } else {
        scrollProgress.style.boxShadow = '';
    }

    requestAnimationFrame(animateScrollProgress);
}
animateScrollProgress();

// ===== PREMIUM NAVIGATION SCROLL EFFECT WITH SMOOTH TRANSITION =====
const nav = document.querySelector('.nav');
let navScrolled = false;
let lastScrollForNav = 0;

function updateNav() {
    const scrollY = window.pageYOffset;

    // Add hysteresis to prevent flickering at threshold
    if (scrollY > 150 && !navScrolled) {
        navScrolled = true;
        nav.classList.add('scrolled');
    } else if (scrollY < 100 && navScrolled) {
        navScrolled = false;
        nav.classList.remove('scrolled');
    }

    lastScrollForNav = scrollY;
    requestAnimationFrame(updateNav);
}
updateNav();

// ===== NAVIGATION LINK UNDERLINE ANIMATION =====
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.textShadow = '0 0 20px rgba(249, 53, 73, 0.5)';
    });
    link.addEventListener('mouseleave', () => {
        link.style.textShadow = '';
    });
});

// ===== HERO TITLE REVEAL ANIMATION =====
const heroTitle = document.getElementById('heroTitle');
const heroSubtitle = document.querySelector('.hero-subtitle');
const heroDescription = document.querySelector('.hero-description');

window.addEventListener('load', () => {
    setTimeout(() => {
        heroSubtitle?.classList.add('reveal-up', 'visible');
    }, 200);
    setTimeout(() => {
        heroTitle?.classList.add('revealed');
    }, 500);
    setTimeout(() => {
        heroDescription?.classList.add('reveal-up', 'visible');
    }, 800);
});

// ===== SMOOTH SCROLL-LINKED BACKDROP EFFECT =====
const backdropGrid = document.getElementById('backdropGrid');
let lastScrollY = window.pageYOffset;
let backdropProgress = 0;

// Smooth interpolation for backdrop animation
function updateBackdrop() {
    const targetScroll = window.pageYOffset;
    // Smooth scroll following with interpolation
    backdropProgress += (targetScroll - backdropProgress) * 0.08;

    if (backdropGrid && backdropProgress < window.innerHeight * 1.5) {
        const parallaxOffset = backdropProgress * 0.4;
        const rotateAngle = 60 + (backdropProgress / window.innerHeight) * 5;
        backdropGrid.style.transform = `perspective(500px) rotateX(${rotateAngle}deg) translateY(${parallaxOffset}px)`;
        backdropGrid.style.backgroundPosition = `center, center ${parallaxOffset}px, center`;
    }

    lastScrollY = targetScroll;
    requestAnimationFrame(updateBackdrop);
}
updateBackdrop();

// ===== ENHANCED PARTICLE SYSTEM WITH MOUSE INTERACTION =====
const particlesContainer = document.getElementById('particles');
const particleArray = [];

// Particle configuration
const PARTICLE_CONFIG = {
    count: 50,
    mouseRadius: 200,          // Radius around mouse for interaction
    repelForce: 0.6,           // How strongly particles flee from cursor
    attractForce: 0.02,        // Gentle attraction after repel
    friction: 0.95,            // Velocity damping
    baseSpeed: 0.3             // Minimum floating speed
};

// Particle class for physics-based animation
class Particle {
    constructor() {
        this.element = document.createElement('div');
        this.reset();
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';

        // Random particle type
        const types = ['particle--small', 'particle--medium', 'particle--large'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        this.element.classList.add('particle', randomType);

        particlesContainer.appendChild(this.element);

        // Physics state
        this.vx = (Math.random() - 0.5) * PARTICLE_CONFIG.baseSpeed;
        this.vy = (Math.random() - 0.5) * PARTICLE_CONFIG.baseSpeed;
    }

    reset() {
        this.element = document.createElement('div');
        this.element.style.animation = `particleFloat ${15 + Math.random() * 20}s ease-in-out infinite`;
        this.element.style.animationDelay = Math.random() * 20 + 's';
        this.element.style.opacity = Math.random() * 0.5 + 0.3;
    }

    update(mouseX, mouseY) {
        // Apply base velocity
        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction - repel effect
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < PARTICLE_CONFIG.mouseRadius) {
            const force = (PARTICLE_CONFIG.mouseRadius - distance) / PARTICLE_CONFIG.mouseRadius;
            const angle = Math.atan2(dy, dx);
            const repelX = Math.cos(angle) * force * PARTICLE_CONFIG.repelForce;
            const repelY = Math.sin(angle) * force * PARTICLE_CONFIG.repelForce;

            this.vx += repelX;
            this.vy += repelY;
        }

        // Apply friction
        this.vx *= PARTICLE_CONFIG.friction;
        this.vy *= PARTICLE_CONFIG.friction;

        // Maintain minimum movement
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed < PARTICLE_CONFIG.baseSpeed && speed > 0.01) {
            this.vx = (this.vx / speed) * PARTICLE_CONFIG.baseSpeed;
            this.vy = (this.vy / speed) * PARTICLE_CONFIG.baseSpeed;
        }

        // Boundary wrapping
        if (this.x < -50) this.x = window.innerWidth + 50;
        if (this.x > window.innerWidth + 50) this.x = -50;
        if (this.y < -50) this.y = window.innerHeight + 50;
        if (this.y > window.innerHeight + 50) this.y = -50;

        // Update DOM
        this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
    }

    // Add glow effect when near mouse
    setGlow(active) {
        this.element.style.boxShadow = active
            ? '0 0 20px rgba(249, 53, 73, 0.8), 0 0 40px rgba(249, 53, 73, 0.4)'
            : '';
    }
}

// Initialize particles
function initParticles() {
    for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
        particleArray.push(new Particle());
    }
}

// Mouse position for particle interaction
let particleMouseX = -1000;
let particleMouseY = -1000;

document.addEventListener('mousemove', (e) => {
    particleMouseX = e.clientX;
    particleMouseY = e.clientY;
});

// Animate particles
function animateParticles() {
    particleArray.forEach(particle => {
        particle.update(particleMouseX, particleMouseY);

        // Check distance for glow effect
        const dx = particle.x - particleMouseX;
        const dy = particle.y - particleMouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        particle.setGlow(distance < PARTICLE_CONFIG.mouseRadius * 0.5);
    });

    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Resize handler
window.addEventListener('resize', () => {
    particleArray.forEach(p => {
        if (p.x > window.innerWidth) p.x = window.innerWidth - 50;
        if (p.y > window.innerHeight) p.y = window.innerHeight - 50;
    });
});

// ===== SMOOTH SCROLL REVEAL ANIMATIONS WITH THRESHOLD GRADATION =====
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealThresholds = new WeakMap();

// Initialize reveal thresholds for staggered animations
revealElements.forEach((el, index) => {
    revealThresholds.set(el, {
        baseThreshold: 0.15,
        delay: (index % 5) * 50  // Stagger by position
    });
});

let lastRevealCheck = 0;
function revealOnScroll() {
    const now = performance.now();
    // Throttle checks for performance
    if (now - lastRevealCheck < 50) return;
    lastRevealCheck = now;

    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const threshold = revealThresholds.get(el) || { baseThreshold: 0.15, delay: 0 };

        // Use a more generous threshold for earlier triggering
        const revealPoint = windowHeight * (1 - threshold.baseThreshold);

        if (rect.top < revealPoint && !el.classList.contains('visible')) {
            // Add delay for staggered effect
            setTimeout(() => {
                el.classList.add('visible');
            }, threshold.delay);
        }
    });
}

// Use requestAnimationFrame for smooth scroll-linked reveals
function animateReveals() {
    revealOnScroll();
    requestAnimationFrame(animateReveals);
}
animateReveals();

// ===== PROJECT CARDS REVEAL WITH STAGGERED SMOOTH ANIMATION =====
const projectCards = document.querySelectorAll('.project-card');
const projectCardStates = new WeakMap();

// Initialize card states for smooth reveal
projectCards.forEach((card, index) => {
    projectCardStates.set(card, {
        index,
        revealed: false,
        progress: 0
    });
});

function revealProjects() {
    projectCards.forEach((card) => {
        const state = projectCardStates.get(card);
        if (state.revealed) return;

        const rect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.75;

        if (rect.top < triggerPoint) {
            state.revealed = true;
            // Progressive stagger based on index
            setTimeout(() => {
                card.classList.add('visible');
            }, state.index * 120); // Reduced delay for snappier feel
        }
    });
}

// Smooth scroll-linked reveal
function animateProjectReveals() {
    revealProjects();
    requestAnimationFrame(animateProjectReveals);
}
animateProjectReveals();

// ===== SMOOTH PARALLAX EFFECTS WITH LERP =====
const parallaxElements = document.querySelectorAll('[data-parallax]');
const parallaxStates = new WeakMap();

// Initialize parallax state
parallaxElements.forEach(el => {
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
    parallaxStates.set(el, {
        speed,
        currentY: 0,
        targetY: 0
    });
});

function animateParallax() {
    parallaxElements.forEach(el => {
        const state = parallaxStates.get(el);
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
            const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
            state.targetY = scrollProgress * 40 * state.speed; // Increased multiplier for more visible effect
        } else if (rect.bottom <= 0) {
            state.targetY = 40 * state.speed;
        } else {
            state.targetY = 0;
        }

        // Smooth interpolation for buttery parallax
        state.currentY += (state.targetY - state.currentY) * 0.08;
        el.style.transform = `translate3d(0, ${state.currentY}px, 0)`;
    });

    requestAnimationFrame(animateParallax);
}
animateParallax();

// ===== SMOOTH TIMELINE REVEAL WITH STAGGER =====
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineStates = new WeakMap();

timelineItems.forEach((item, index) => {
    timelineStates.set(item, {
        index,
        revealed: false
    });
});

function revealTimeline() {
    timelineItems.forEach((item) => {
        const state = timelineStates.get(item);
        if (state.revealed) return;

        const rect = item.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight * 0.8) {
            state.revealed = true;
            // Tighter stagger for snappier feel
            setTimeout(() => {
                item.classList.add('visible');
            }, state.index * 100);
        }
    });
}

function animateTimeline() {
    revealTimeline();
    requestAnimationFrame(animateTimeline);
}
animateTimeline();

// ===== PREMIUM STATS COUNTER ANIMATION WITH EASING =====
const stats = document.querySelectorAll('.stat');
let statsAnimated = false;

const animateStats = () => {
    const statsSection = document.querySelector('.stats-container');
    if (!statsSection) return;

    const sectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight * 0.75 && !statsAnimated) {
        statsAnimated = true;

        stats.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-count'));
            const numberEl = stat.querySelector('.stat-number');
            const duration = 2500; // Slightly longer for more dramatic effect
            const startTime = performance.now();
            const staggerDelay = index * 150; // Stagger each stat

            // Ease-out-quart function for smooth deceleration
            const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime - staggerDelay;

                if (elapsed < 0) {
                    numberEl.textContent = '0';
                    requestAnimationFrame(updateCounter);
                    return;
                }

                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutQuart(progress);
                const current = Math.floor(target * easedProgress);

                if (progress < 1) {
                    numberEl.textContent = current;
                    requestAnimationFrame(updateCounter);
                } else {
                    numberEl.textContent = target + '+';
                    // Add glow effect on completion
                    numberEl.style.textShadow = '0 0 30px rgba(249, 53, 73, 0.5)';
                }
            };

            requestAnimationFrame(updateCounter);
        });
    }
};

function animateStatsCheck() {
    animateStats();
    requestAnimationFrame(animateStatsCheck);
}
animateStatsCheck();

// ===== SMOOTH SCROLL FOR NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== PREMIUM TEXT SCRAMBLE EFFECT WITH SMOOTH DECODE =====
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const scrambleTimeouts = new WeakMap();

const scrambleText = (element, speed = 45) => {
    // Clear any existing scramble on this element
    if (scrambleTimeouts.has(element)) {
        clearTimeout(scrambleTimeouts.get(element));
    }

    const originalText = element.textContent;
    const chars = originalText.split('');
    let iterations = 0;
    let frame = 0;

    // Skip scramble for short text or spaces
    const nonSpaceChars = chars.filter(c => c !== ' ').length;
    if (nonSpaceChars < 3) return;

    const timeoutId = setInterval(() => {
        element.textContent = chars
            .map((char, index) => {
                if (char === ' ') return ' ';
                if (index < iterations) {
                    return originalText[index];
                }
                // Use a subset of letters for cleaner scramble
                const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            })
            .join("");

        iterations += 0.35; // Slower reveal for dramatic effect

        if (iterations >= chars.length) {
            clearInterval(timeoutId);
            element.textContent = originalText;
        }

        frame++;
    }, speed);

    scrambleTimeouts.set(element, timeoutId);
};

// Apply scramble to headings
document.querySelectorAll('.project-info h3, .timeline-content h3, .section-title').forEach(title => {
    title.style.cursor = 'default';
    title.addEventListener('mouseenter', () => {
        scrambleText(title);
    });
});

// ===== PREMIUM MAGNETIC BUTTON EFFECT WITH SMOOTH RETURN =====
const magneticElements = document.querySelectorAll('.contact-email, .project-link, .nav-links a, .social-links a');
const magneticStates = new WeakMap();

magneticElements.forEach(el => {
    magneticStates.set(el, {
        x: 0,
        y: 0,
        isHovering: false
    });

    el.addEventListener('mousemove', (e) => {
        const state = magneticStates.get(el);
        state.isHovering = true;

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate offset from center with stronger magnet effect
        const offsetX = (e.clientX - centerX) * 0.35;
        const offsetY = (e.clientY - centerY) * 0.35;

        state.x = offsetX;
        state.y = offsetY;

        el.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scale(1.02)`;
        el.style.transition = 'transform 0.1s ease-out';
    });

    el.addEventListener('mouseleave', () => {
        const state = magneticStates.get(el);
        state.isHovering = false;
        state.x = 0;
        state.y = 0;

        // Smooth return animation
        el.style.transform = `translate3d(0, 0, 0) scale(1)`;
        el.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
    });
});

// Animate magnetic elements smoothly
function animateMagneticElements() {
    magneticElements.forEach(el => {
        const state = magneticStates.get(el);
        if (!state) return;

        // Continue animation loop for elements being hovered
        if (state.isHovering) {
            // Already handled by mousemove
        }
    });
    requestAnimationFrame(animateMagneticElements);
}
animateMagneticElements();

// ===== INTERSECTION OBSERVER FOR PERFORMANCE =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .timeline-item, .skill-item').forEach(el => {
    observer.observe(el);
});

// ===== PREMIUM MOUSE PARALLAX FOR HERO WITH MULTI-LAYER EFFECT =====
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');
const heroTitle = document.getElementById('heroTitle');
const heroSubtitle = document.querySelector('.hero-subtitle');
const heroDescription = document.querySelector('.hero-description');

// Smooth parallax state
const heroParallaxState = {
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0
};

if (hero && heroContent) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate normalized offset (-1 to 1)
        const offsetX = (e.clientX - centerX) / (rect.width / 2);
        const offsetY = (e.clientY - centerY) / (rect.height / 2);

        // Different parallax depths for layered effect
        heroParallaxState.targetX = offsetX * 15;
        heroParallaxState.targetY = offsetY * 10;
    });

    hero.addEventListener('mouseleave', () => {
        heroParallaxState.targetX = 0;
        heroParallaxState.targetY = 0;
    });

    // Smooth parallax animation
    function animateHeroParallax() {
        // Lerp for smooth following
        heroParallaxState.currentX += (heroParallaxState.targetX - heroParallaxState.currentX) * 0.08;
        heroParallaxState.currentY += (heroParallaxState.targetY - heroParallaxState.currentY) * 0.08;

        // Apply transforms to different elements for depth
        heroContent.style.transform = `translate3d(${heroParallaxState.currentX * 0.5}px, ${heroParallaxState.currentY * 0.5}px, 0)`;

        if (heroTitle) {
            heroTitle.style.transform = `translate3d(${heroParallaxState.currentX * -0.3}px, ${heroParallaxState.currentY * -0.2}px, 0)`;
        }

        requestAnimationFrame(animateHeroParallax);
    }
    animateHeroParallax();
}

// ===== PREMIUM HOVER GLOW EFFECT FOR SKILLS AND TAGS =====
const glowElements = document.querySelectorAll('.skill-item, .project-tags span');

glowElements.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create a subtle glow gradient following the mouse
        el.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(249, 53, 73, 0.15), transparent 60%)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.background = '';
    });
});

// ===== CLICK RIPPLE EFFECT =====
function createRipple(event, element) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(249, 53, 73, 0.4) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 1;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add ripple keyframes
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Apply ripple to interactive elements
const rippleElements = document.querySelectorAll('button, a, .project-link, .contact-email, .skill-item');
rippleElements.forEach(el => {
    el.addEventListener('click', (e) => {
        if (window.matchMedia('(pointer: fine)').matches) {
            createRipple(e, el);
        }
    });
});

// ===== CONSOLE EASTER EGG =====
console.log(`%c
👋 Hey fellow developer!
%c
Interested in how this was built?
Check out the source code!

Built with ❤️ using vanilla HTML, CSS & JavaScript
Inspired by soham.sh & lusion.co
`,
    'font-size: 20px; font-weight: bold; color: #f93549;',
    'font-size: 12px; color: #888;'
);

// ===== PAGE LOAD ANIMATION SEQUENCE WITH FADE IN =====
const pageLoadStartTime = performance.now();

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');

    // Add loaded class with smooth fade-in
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1)';

    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});

// ===== PAGE TRANSITION EFFECT FOR NAVIGATION CLICKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            // Smooth scroll with custom easing
            const startY = window.pageYOffset;
            const targetY = target.offsetTop - 80;
            const distance = targetY - startY;
            const duration = 800;
            const startTime = performance.now();

            const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutQuart(progress);

                window.scrollTo(0, startY + distance * easedProgress);

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };

            requestAnimationFrame(animateScroll);
        }
    });
});
