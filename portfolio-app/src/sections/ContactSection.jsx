import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import ScrollSection from '../components/ScrollSection'
import { SOCIAL_LINKS } from '../data/socialLinks'

/* ─── Particle Background ──────────────────────────────────────── */
function ParticleBackground({ isDark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Track mouse
    let mouse = { x: -1000, y: -1000, radius: 200 }; // Larger interact radius
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Adjust particle count for the smaller area
    const particleCount = Math.min(Math.floor(window.innerWidth / 4), 200);
    const particles = [];
    
    // Increased opacity for visibility
    const colors = isDark 
      ? ['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.4)', 'rgba(138, 110, 220, 0.8)', 'rgba(138, 110, 220, 0.5)']
      : ['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.4)', 'rgba(100, 70, 200, 0.8)', 'rgba(100, 70, 200, 0.5)'];

    for (let i = 0; i < particleCount; i++) {
      // Natural distribution in the bottom 15% (below the X button)
      const yTargetRatio = Math.pow(Math.random(), 1.8); 
      const baseY = canvas.height - (yTargetRatio * canvas.height * 0.15) - 10;
      const baseX = Math.random() * window.innerWidth;
      
      particles.push({
        x: baseX,
        y: baseY + Math.random() * 50,
        baseX: baseX,
        baseY: baseY,
        size: Math.random() * 2.5 + 1.5, // Larger shapes so they are visible
        shape: ['circle', 'triangle', 'cross', 'dot'][Math.floor(Math.random() * 4)],
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        flowOffset: Math.random() * Math.PI * 2,
        flowSpeed: Math.random() * 0.0004 + 0.0002,
        vx: 0,
        vy: 0
      });
    }

    const drawShape = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      if (p.shape === 'circle' || p.shape === 'dot') {
        ctx.arc(0, 0, p.shape === 'dot' ? p.size * 0.6 : p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'triangle') {
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size, p.size);
        ctx.lineTo(-p.size, p.size);
        ctx.closePath();
        if (p.size > 2) ctx.stroke(); else ctx.fill();
      } else if (p.shape === 'cross') {
        ctx.moveTo(-p.size, 0);
        ctx.lineTo(p.size, 0);
        ctx.moveTo(0, -p.size);
        ctx.lineTo(0, p.size);
        ctx.stroke();
      }
      ctx.restore();
    };

    const render = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        // Subtle floating 
        const flowX = Math.sin(time * p.flowSpeed + p.flowOffset) * 12;
        const flowY = Math.cos(time * p.flowSpeed * 0.8 + p.flowOffset) * 10;
        
        const targetX = p.baseX + flowX;
        let targetY = p.baseY + flowY;
        
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Stronger mouse repel physics
        if (dist < mouse.radius) {
          const force = Math.pow((mouse.radius - dist) / mouse.radius, 1.2);
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 1.5; // Reduced push
          p.vy += Math.sin(angle) * force * 1.5;
        }

        // Snappier spring physics pulling back to target
        const spring = 0.05;
        const friction = 0.86;

        p.vx += (targetX - p.x) * spring;
        p.vy += (targetY - p.y) * spring;

        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;
        
        // Rotation reacting to movement
        p.rotation += p.rotationSpeed + (Math.abs(p.vx) + Math.abs(p.vy)) * 0.005;

        drawShape(p);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

/* ─── Icons ────────────────────────────────────────────────────── */
const ICONS = {
  github: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 11.6A9.65 9.65 0 0 1 16.5 10" />
      <path d="M8.5 14.5A6.5 6.5 0 0 1 15 13" />
      <path d="M9 17.3A3.5 3.5 0 0 1 13.5 16" />
    </svg>
  ),
  linkedin: ( 
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
}

/* ─── Contact card ─────────────────────────────────────────────── */
function ContactCard({ link, index, scrollProgress, isDark }) {
  const [hovered, setHovered] = useState(false)

  const start = 0.83 + index * 0.028
  const end   = 0.95 + index * 0.008

  const rawOpacity = useTransform(scrollProgress, [start, end], [0, 1])
  const rawY       = useTransform(scrollProgress, [start, end], [28, 0])
  const opacity    = useSpring(rawOpacity, { stiffness: 85, damping: 20 })
  const y          = useSpring(rawY,       { stiffness: 85, damping: 20 })

  return (
    <motion.a
      layoutId={`social-pill-${link.id}`}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex items-center justify-between rounded-xl overflow-hidden"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{
        background: hovered
          ? (isDark ? 'rgba(22, 18, 36, 0.96)' : 'rgba(248, 245, 255, 0.96)')
          : (isDark ? 'rgba(14, 14, 18, 0.92)' : 'rgba(255, 255, 255, 0.92)'),
        borderColor: hovered
          ? (isDark ? 'rgba(130, 100, 210, 0.35)' : 'rgba(60, 40, 80, 0.35)')
          : (isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.08)'),
        boxShadow: hovered
          ? (isDark
              ? '0 0 0 1px rgba(130,100,210,0.15), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(130,100,210,0.1)'
              : '0 0 0 1px rgba(60,40,80,0.15), 0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(60,40,80,0.08)')
          : (isDark
              ? '0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)'
              : '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)'),
      }}
      transition={{ duration: 0.22, ease: 'easeOut',
        layout: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
      }}
      whileHover={{ scale: 1.009 }}
      style={{
        opacity, y,
        padding: '14px 20px',
        border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        backdropFilter: 'blur(16px)',
      }}
      data-hoverable
    >
      {/* Purple-red left accent bar — slides in on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="accent"
            className="pointer-events-none absolute left-0 top-0 bottom-0"
            style={{ width: 2, borderRadius: '0 2px 2px 0' }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="block w-full h-full"
              style={{
                background: 'linear-gradient(to bottom, rgba(100,70,200,0.1), rgba(138, 110, 220,0.9), rgba(100,70,200,0.1))',
                boxShadow: '0 0 12px rgba(138, 110, 220,0.6), 0 0 24px rgba(138, 110, 220,0.2)',
              }}
            />
          </motion.span>
        )}
      </AnimatePresence>

      {/* red underpaint wash */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="wash"
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              background: isDark
                ? 'radial-gradient(ellipse at 0% 50%, rgba(130,100,210,0.12) 0%, transparent 60%)'
                : 'radial-gradient(ellipse at 0% 50%, rgba(60,40,80,0.09) 0%, transparent 60%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Sheen sweep */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="sheen"
            className="pointer-events-none absolute inset-0"
            initial={{ x: '-100%' }}
            animate={{ x: '120%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            style={{
              background: 'linear-gradient(105deg, transparent 30%, rgba(138, 110, 220,0.07) 50%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Icon box + text */}
      <div className="flex items-center gap-4 relative z-10">
        <motion.span
          className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
          animate={{
            background: hovered 
              ? (isDark ? 'rgba(30, 22, 50, 0.9)' : 'rgba(245, 240, 255, 0.9)')
              : (isDark ? 'rgba(16, 16, 20, 0.85)' : 'rgba(250, 250, 255, 0.85)'),
            borderColor: hovered 
              ? (isDark ? 'rgba(138, 110, 220, 0.3)' : 'rgba(60, 40, 80, 0.3)')
              : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
            color: hovered 
              ? (isDark ? 'rgba(200, 190, 248, 0.95)' : 'rgba(60, 40, 80, 0.95)')
              : (isDark ? 'rgba(110, 105, 130, 0.65)' : 'rgba(80, 75, 100, 0.65)'),
            boxShadow: hovered 
              ? (isDark ? '0 0 0 1px rgba(138, 110, 220,0.15), 0 0 14px rgba(138, 110, 220,0.12)' : '0 0 0 1px rgba(60, 40, 80,0.15), 0 0 14px rgba(60,40,80,0.08)')
              : 'none',
          }}
          transition={{ duration: 0.2 }}
          style={{ border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}
        >
          {ICONS[link.id]}
        </motion.span>

        <div>
          <div className="font-mono text-[8px] tracking-[0.38em] mb-1"
            style={{ color: 'rgba(100, 95, 120, 0.7)' }}>
            {link.label}
          </div>
          <motion.div
            className="font-body text-sm"
            animate={{ color: hovered 
            ? (isDark ? 'rgba(225, 220, 255, 0.92)' : 'rgba(40, 20, 80, 0.92)')
            : (isDark ? 'rgba(160, 155, 175, 0.6)' : 'rgba(80, 75, 100, 0.6)') }}
            transition={{ duration: 0.18 }}
          >
            {link.value}
          </motion.div>
        </div>
      </div>

      {/* Animated arrow */}
      <motion.span
        className="relative z-10 font-mono text-xs"
        animate={{
          color: hovered 
            ? (isDark ? 'rgba(160, 130, 240, 0.85)' : 'rgba(60, 40, 80, 0.85)')
            : (isDark ? 'rgba(100, 95, 115, 0.3)' : 'rgba(80, 75, 100, 0.3)'),
          x: hovered ? 4 : 0,
        }}
        transition={{ duration: 0.18 }}
      >
        →
      </motion.span>
    </motion.a>
  )
}

/* ─── Section ──────────────────────────────────────────────────── */
export default function ContactSection({ scrollContainer }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-60px' })
  const { scrollYProgress } = useScroll({ container: scrollContainer })
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const check = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light')
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return (
    <ScrollSection scrollContainer={scrollContainer} scaleRange={[0.9, 1, 1]} opacityRange={[0, 1, 1]} yRange={[100, 0, 0]} blurRange={[8, 0, 0]} entryOnly>
      <section id="contact" data-section ref={ref} className="relative min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-20 py-24 sm:py-32 overflow-hidden">
        
        <div className="max-w-4xl mx-auto w-full text-center" style={{ zIndex: 10 }}>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <h2 className="text-5xl sm:text-6xl md:text-[7rem] lg:text-[8.5rem] font-display font-bold tracking-tighter leading-[0.9]"
                style={{ color: isDark ? '#ffffff' : '#000000' }}>
              Let&apos;s work<br/>together!
            </h2>
          </motion.div>

          <motion.p
            className="font-body text-sm sm:text-base mt-8 max-w-md mx-auto leading-relaxed"
            style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            Got an idea? Want to collaborate? Or just passing through? I&apos;m always open to interesting conversations.
          </motion.p>

          <motion.div
            className="mt-8 mx-auto h-px max-w-[80px]"
            style={{ background: 'rgba(120, 110, 160, 0.2)' }}
            initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.8, duration: 1 }}
          />

          {/* Social rows */}
          <div className="mt-10 max-w-md mx-auto text-left">
            <motion.div
              className="mb-5 flex items-center justify-between"
              initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.85 }}
            >
              <span className="font-mono text-[8px] tracking-[0.4em]"
                style={{ color: 'rgba(100, 95, 120, 0.55)' }}>SOCIALS</span>
              <span className="font-mono text-[8px] tracking-[0.28em]"
                style={{ color: 'rgba(100, 95, 120, 0.35)' }}>CONNECT WITH ME</span>
            </motion.div>

            <div className="space-y-2">
              {SOCIAL_LINKS.map((link, i) => (
                <ContactCard
                  key={link.id}
                  link={link}
                  index={i}
                  scrollProgress={scrollYProgress}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>

          <motion.div
            className="mt-20 font-mono text-[9px] tracking-[0.28em]"
            style={{ color: 'rgba(90, 86, 108, 0.4)' }}
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
          >
            DESIGNED &amp; BUILT BY NIRVAN JAIN / {new Date().getFullYear()}
          </motion.div>

        </div>
      </section>
    </ScrollSection>
  )
}
