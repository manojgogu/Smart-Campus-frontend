import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff, Loader2, Siren, Zap, BellRing, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Page } from '../components/ui.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email address.');
    if (!password) return setErr('Enter your password.');
    setBusy(true);
    try {
      const d = await login(email.trim(), password);
      toast.success(`Welcome back, ${d.user.name}!`);
      nav(d.user.role === 'admin' ? '/admin' : d.user.role === 'security' ? '/security' : '/dashboard');
    } catch (e2) {
      const m = e2.response?.data?.message || 'Login failed. Check your credentials.';
      setErr(m); toast.error(m);
    } finally { setBusy(false); }
  };

  const fillDemo = (role) => {
    const map = { student: 'student@campus.edu', security: 'security@campus.edu', admin: 'admin@campus.edu' };
    setEmail(map[role]); setPassword(role === 'admin' ? '' : 'Password@123');
  };

  return (
    <Page className="relative mx-auto flex min-h-[85vh] w-full max-w-6xl items-center px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-navy-300/30 blur-3xl dark:bg-navy-600/20" />
        <div className="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-500/10" />
      </div>
      <div className="grid w-full overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white shadow-pop dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2">
        {/* Left showcase */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-navy-950 via-navy-800 to-slate-900 p-10 text-white md:block">
          <div className="absolute inset-0 hero-grid opacity-30" />
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -right-10 top-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative">
            <motion.span animate={{ rotate: [0, 6, 0] }} transition={{ duration: 4, repeat: Infinity }} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-glowred">
              <ShieldCheck size={28} />
            </motion.span>
            <h2 className="font-display mt-6 text-3xl font-extrabold leading-tight">Welcome back to CampusSafe</h2>
            <p className="mt-2 text-white/70">Sign in to report, track and respond to campus emergencies — in real time.</p>
            <div className="mt-6 space-y-2.5">
              {[{ icon: Siren, t: 'One-tap SOS with live tracking' }, { icon: Zap, t: 'Critical-first security queue' }, { icon: BellRing, t: 'Instant push notifications' }].map((r, i) => (
                <motion.div key={r.t} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12 }} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <r.icon size={18} className="text-cyan-300" /><span className="text-sm font-medium">{r.t}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-white/70 backdrop-blur">
              <p className="font-bold text-white">Demo accounts (after seeding)</p>
              student@campus.edu · faculty@campus.edu · security@campus.edu<br />Password: <b>Password@123</b>
              <div className="mt-2 flex gap-2">
                {['student', 'security', 'admin'].map(r => <button key={r} type="button" onClick={() => fillDemo(r)} className="rounded-lg bg-white/10 px-2.5 py-1 font-bold capitalize hover:bg-white/20">{r}</button>)}
              </div>
            </div>
          </div>
        </div>
        {/* Form */}
        <motion.form onSubmit={submit} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white p-8 dark:bg-slate-900 sm:p-10">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-3 py-1 text-[11px] font-bold text-navy-700 dark:bg-navy-500/15 dark:text-cyan-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" /> SECURE SIGN-IN</p>
          <h1 className="font-display mt-3 text-3xl font-extrabold">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">New here? <Link to="/register" className="group font-bold text-navy-600 dark:text-cyan-300">Create an account <ArrowRight size={13} className="inline transition-transform group-hover:translate-x-0.5" /></Link></p>
          {err && <motion.p initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{err}</motion.p>}
          <label className="label mt-6">Email</label>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@campus.edu" autoComplete="email" />
          <label className="label mt-4">Password</label>
          <div className="relative">
            <input className="input pr-11" type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:text-navy-600" aria-label="Toggle password">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} disabled={busy} className="btn-primary mt-6 w-full !py-3.5">
            {busy ? <><Loader2 className="animate-spin" size={18} /> Signing in…</> : 'Sign in →'}
          </motion.button>
          <p className="mt-4 text-center text-xs text-slate-400">Protected by JWT · Role-checked on every request</p>
        </motion.form>
      </div>
    </Page>
  );
}
