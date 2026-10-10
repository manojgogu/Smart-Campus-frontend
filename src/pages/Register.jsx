import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Page } from '../components/ui.jsx';

function strength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'student' });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const s = useMemo(() => strength(form.password), [form.password]);
  const colors = ['bg-slate-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.name.trim().length < 2) return setErr('Enter your full name.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErr('Enter a valid email.');
    if (form.password.length < 8) return setErr('Password must be at least 8 characters.');
    if (!['student', 'faculty', 'security'].includes(form.role)) return setErr('Invalid role.');
    setBusy(true);
    try {
      const d = await register({ ...form, email: form.email.trim() });
      toast.success(`Account created. Welcome, ${d.user.name}!`);
      nav(d.user.role === 'security' ? '/security' : '/dashboard');
    } catch (e2) {
      const m = e2.response?.data?.message || 'Registration failed.';
      setErr(m); toast.error(m);
    } finally { setBusy(false); }
  };

  return (
    <Page className="relative mx-auto flex min-h-[85vh] w-full max-w-6xl items-center px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-10 h-64 w-64 rounded-full bg-red-300/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-64 w-64 rounded-full bg-navy-300/30 blur-3xl dark:bg-navy-600/20" />
      </div>
      <div className="grid w-full overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white shadow-pop dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-red-600 via-navy-800 to-navy-950 p-10 text-white md:block">
          <div className="absolute inset-0 hero-grid opacity-30" />
          <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -left-8 bottom-20 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur"><ShieldCheck size={28} /></span>
            <h2 className="font-display mt-6 text-3xl font-extrabold leading-tight">Join a safer campus</h2>
            <p className="mt-2 text-white/70">Students, faculty and security staff coordinate in one place.</p>
            <div className="mt-6 space-y-2.5">
              {['One-click emergency SOS', 'Live status tracking', 'Real-time security alerts', 'Campus map + analytics'].map((t, i) => (
                <motion.div key={t} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.1 }} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 size={18} className="text-green-300" /> {t}
                </motion.div>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">Pick your role</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[{ v: 'student', l: 'Student' }, { v: 'faculty', l: 'Faculty' }, { v: 'security', l: 'Security' }].map(r => (
                  <button key={r.v} type="button" onClick={() => setForm({ ...form, role: r.v })}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-bold backdrop-blur transition ${form.role === r.v ? 'border-cyan-300 bg-cyan-400/20 text-white' : 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10'}`}>{r.l}</button>
                ))}
              </div>
            </div>
            <p className="mt-6 text-xs text-white/50">Administrator accounts cannot self-register — they are created via a secure seed script.</p>
          </div>
        </div>
        <motion.form onSubmit={submit} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white p-8 dark:bg-slate-900 sm:p-10">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-navy-600 to-cyan-500 px-3 py-1 text-[11px] font-bold text-white">FREE · 30-SECOND SIGNUP</p>
          <h1 className="font-display mt-3 text-3xl font-extrabold">Create account</h1>
          <p className="mt-1 text-sm text-slate-500">Have an account? <Link to="/login" className="font-bold text-navy-600 dark:text-cyan-300">Sign in <ArrowRight size={13} className="inline" /></Link></p>
          {err && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{err}</motion.p>}
          <label className="label mt-5">Full name</label>
          <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Aarav Sharma" />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@campus.edu" /></div>
            <div><label className="label">Phone (optional)</label>
              <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91…" /></div>
          </div>
          <label className="label mt-4">Password</label>
          <div className="relative">
            <input className="input pr-11" type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          {form.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">{[1, 2, 3, 4].map(i => <motion.span key={i} animate={{ scale: i <= s ? 1 : 0.95 }} className={`h-1.5 flex-1 rounded-full ${i <= s ? colors[s] : 'bg-slate-200 dark:bg-slate-700'}`} />)}</div>
              <span className="text-xs font-semibold">{labels[s]}</span>
            </div>
          )}
          <label className="label mt-4">I am a…</label>
          <div className="grid grid-cols-3 gap-2 md:hidden">
            {['student', 'faculty', 'security'].map(r => (
              <button key={r} type="button" onClick={() => setForm({ ...form, role: r })} className={`rounded-xl border px-2 py-2 text-xs font-bold capitalize ${form.role === r ? 'border-navy-500 bg-navy-50 text-navy-700 dark:bg-navy-500/20 dark:text-white' : 'border-slate-200 dark:border-slate-700'}`}>{r}</button>
            ))}
          </div>
          <select className="input hidden md:block" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="student">Student</option>
            <option value="faculty">Faculty / Staff</option>
            <option value="security">Security Personnel</option>
          </select>
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} disabled={busy} className="btn-primary mt-6 w-full !py-3.5">
            {busy ? <><Loader2 className="animate-spin" size={18} /> Creating…</> : 'Create account →'}
          </motion.button>
        </motion.form>
      </div>
    </Page>
  );
}
