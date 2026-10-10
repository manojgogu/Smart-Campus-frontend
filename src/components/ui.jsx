import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Inbox, Loader2 } from 'lucide-react';
import { fadeUp, stagger, pageTransition } from '../animations/variants.js';

/* ---------- Page wrapper with smooth transition ---------- */
export function Page({ children, className = '' }) {
  return (
    <motion.div {...pageTransition} className={className}>
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className = '' }) {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className={className}>
      {children}
    </motion.div>
  );
}

export function Reveal({ children, i = 0, className = '', y = 24 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: Math.min(i * 0.07, 0.5), ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Animated counter ---------- */
export function useCountUp(target, run, duration = 1600) {
  const [val, setVal] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!run) return;
    if (reduce) { setVal(target); return; }
    let start; let raf;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration, reduce]);
  return val;
}

export function AnimatedNumber({ value, suffix = '', duration }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const v = useCountUp(Number(value) || 0, inView, duration);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

/* ---------- Section heading ---------- */
export function SectionHeading({ eyebrow, title, desc, align = 'center' }) {
  const cls = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <Reveal className={`max-w-2xl ${cls}`}>
      {eyebrow && <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-navy-600 dark:text-cyan-300">{eyebrow}</p>}
      <h2 className="font-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {desc && <p className="mt-2 text-slate-500 dark:text-slate-400">{desc}</p>}
    </Reveal>
  );
}

/* ---------- Glow buttons (wired to existing actions) ---------- */
export function GlowDanger({ children, className = '', ...props }) {
  return (
    <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} className={`btn-danger glow-btn ${className}`} {...props}>
      {children}
    </motion.button>
  );
}

export function GlowPrimary({ children, className = '', ...props }) {
  return (
    <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }} className={`btn-primary ${className}`} {...props}>
      {children}
    </motion.button>
  );
}

/* ---------- Stat card with stagger + hover ---------- */
export function StatCard({ label, value, suffix, icon: Icon, tint = 'text-navy-600 bg-navy-50 dark:bg-navy-500/15', i = 0, sub }) {
  return (
    <motion.div variants={fadeUp} custom={i} whileHover={{ y: -6, scale: 1.01 }} className="card card-hover relative overflow-hidden">
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-navy-500/10 to-cyan-400/10 blur-2xl" />
      <div className="flex items-center gap-4">
        {Icon && <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tint}`}><Icon size={22} /></span>}
        <div className="min-w-0">
          <p className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {typeof value === 'number' ? <AnimatedNumber value={value} suffix={suffix || ''} /> : <>{value}{suffix}</>}
          </p>
          <p className="truncate text-sm text-slate-500">{label}</p>
          {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Empty / loading states ---------- */
export function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', desc = '', action }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center dark:border-slate-700 dark:bg-slate-800/40">
      <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }} className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-navy-600 shadow-card dark:bg-slate-900 dark:text-cyan-300">
        <Icon size={26} />
      </motion.span>
      <p className="mt-3 font-bold">{title}</p>
      {desc && <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}

export function SkeletonGrid({ n = 3, h = 'h-28' }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[ ...Array(n)].map((_, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }} className={`skeleton ${h}`} />
      ))}
    </div>
  );
}

export function LoadingDots({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
      <Loader2 className="animate-spin" size={18} /> {label}
      <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity }}>…</motion.span>
    </div>
  );
}

/* ---------- Animated modal ---------- */
export function Modal({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.94, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } }} exit={{ opacity: 0, scale: 0.96, y: 10 }}
            onClick={(e) => e.stopPropagation()} className="glass-strong w-full max-w-lg rounded-3xl p-6">
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Gradient page hero background ---------- */
export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 hero-grid dark:hero-grid-dark" />
      <div className="absolute -top-32 left-1/2 h-[28rem] w-[62rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-navy-200 via-cyan-200 to-navy-200 opacity-70 blur-3xl dark:from-navy-800/70 dark:via-cyan-900/40 dark:to-navy-800/70" />
      <motion.div animate={{ y: [0, -18, 0], x: [0, 12, 0] }} transition={{ duration: 9, repeat: Infinity }}
        className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-500/10" />
      <motion.div animate={{ y: [0, 16, 0], x: [0, -14, 0] }} transition={{ duration: 11, repeat: Infinity }}
        className="absolute -right-20 top-64 h-80 w-80 rounded-full bg-navy-400/25 blur-3xl dark:bg-navy-500/20" />
    </div>
  );
}
