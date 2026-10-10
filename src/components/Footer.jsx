import { motion } from 'framer-motion';
import { ShieldCheck, Phone, Mail, TriangleAlert, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="about" className="relative overflow-hidden border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white dark:border-slate-800 dark:from-slate-950 dark:to-slate-950">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[40rem] -translate-x-1/2 rounded-full bg-navy-200/40 blur-3xl dark:bg-navy-600/10" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-cyan-500 text-white shadow-pop"><ShieldCheck size={20} /></span>
            <span className="font-display text-lg font-extrabold">Campus<span className="text-navy-600 dark:text-cyan-300">Safe</span></span>
          </div>
          <p className="mt-3 text-sm text-slate-500">Smart campus emergency reporting and response management. Report incidents instantly and help security respond faster.</p>
          <motion.p whileHover={{ scale: 1.01 }} className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" /> Safety disclaimer: CampusSafe supplements — it does not replace — local emergency services. In life-threatening situations always call your local emergency number first.
          </motion.p>
        </div>
        <div>
          <h4 className="font-bold">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            {[['Features', '#features'], ['How it works', '#how'], ['Get started', '/register'], ['Sign in', '/login']].map(([l, h]) => (
              <li key={l}><a href={h} className="group inline-flex items-center gap-1 transition hover:text-navy-600">{l}<ArrowUpRight size={13} className="opacity-0 transition group-hover:opacity-100" /></a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Campus Safety</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>Emergency: 112 / 911 (demo placeholder)</li>
            <li>Security desk: +91-XXXXXXXXXX (placeholder)</li>
            <li>Incident response SLA: demo data</li>
            <li><Link to="/map" className="text-navy-600 dark:text-cyan-300">View live map →</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Contact (placeholder)</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li className="flex items-center gap-2"><Mail size={14} /> safety@campus.edu</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +91-XXXXXXXXXX</li>
          </ul>
          <div className="mt-4 flex gap-2">
            <Link to="/register" className="btn-primary !px-4 !py-2 !text-sm">Join now</Link>
            <Link to="/login" className="btn-ghost !px-4 !py-2 !text-sm">Login</Link>
          </div>
        </div>
      </div>
      <div className="relative border-t border-slate-200 py-4 text-center text-xs text-slate-400 dark:border-slate-800">© 2026 CampusSafe · B.Tech demo project · Demo data is clearly labeled.</div>
    </footer>
  );
}
