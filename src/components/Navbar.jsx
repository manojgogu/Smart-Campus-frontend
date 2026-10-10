import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const nav = useNavigate();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const links = [['Features', '/#features'], ['How It Works', '/#how'], ['About', '#about']];
  return (
    <motion.nav initial={{ y: -64, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-pop' : 'bg-transparent'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-600 to-cyan-500 text-white shadow-pop transition-transform group-hover:scale-105 group-hover:rotate-3">
            <ShieldCheck size={22} />
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-red-500" />
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white bg-red-500" />
            </span>
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Campus<span className="bg-gradient-to-r from-navy-600 to-cyan-500 bg-clip-text text-transparent">Safe</span></span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([l, h]) => <a key={l} href={h} className="relative text-sm font-semibold text-slate-600 transition hover:text-navy-600 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded after:bg-gradient-to-r after:from-navy-600 after:to-cyan-400 after:transition-all hover:after:w-full dark:text-slate-300">{l}</a>)}
          <button onClick={toggle} className="rounded-xl border border-slate-200 p-2 transition hover:-translate-y-0.5 dark:border-slate-700" aria-label="Theme">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
          <Link to="/login" className="btn-ghost !py-2">Login</Link>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/register" className="btn-primary !py-2.5">Get Started</Link>
          </motion.div>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={toggle} className="rounded-xl border p-2 dark:border-slate-700" aria-label="Theme">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="rounded-xl border p-2 dark:border-slate-700">
            <motion.span animate={{ rotate: open ? 90 : 0 }} className="block">{open ? <X size={18} /> : <Menu size={18} />}</motion.span>
          </button>
        </div>
      </div>
      {open && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="glass mx-4 mb-3 flex flex-col gap-2 rounded-2xl p-4 md:hidden">
          {links.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">{l}</a>)}
          <div className="flex gap-2"><Link to="/login" className="btn-ghost flex-1">Login</Link><Link to="/register" className="btn-primary flex-1">Register</Link></div>
        </motion.div>
      )}
    </motion.nav>
  );
}
