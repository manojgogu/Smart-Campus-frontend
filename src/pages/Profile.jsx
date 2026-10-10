import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, ShieldCheck, Phone, Save, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Page } from '../components/ui.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.patch('/auth/profile', form);
      setUser(data.user);
      localStorage.setItem('cs_user', JSON.stringify(data.user));
      toast.success('Profile updated');
    } catch { toast.error('Update failed'); }
    finally { setBusy(false); }
  };

  return (
    <Page className="mx-auto max-w-2xl">
      {/* Header card */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy-900 via-navy-800 to-cyan-900 p-7 text-white shadow-pop">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <motion.span whileHover={{ scale: 1.06, rotate: 3 }} className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 font-display text-3xl font-extrabold backdrop-blur">
            {user?.name?.[0]?.toUpperCase() || 'C'}
          </motion.span>
          <div>
            <h1 className="font-display text-2xl font-extrabold">{user?.name}</h1>
            <p className="flex items-center gap-1.5 text-sm text-white/70"><Mail size={13} /> {user?.email}</p>
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-400 to-green-400 px-3 py-1 text-[11px] font-extrabold uppercase text-navy-950"><ShieldCheck size={12} /> {user?.role}</span>
          </div>
        </div>
      </motion.div>

      <motion.form onSubmit={save} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="card mt-4 space-y-4">
        <h2 className="font-display flex items-center gap-2 font-bold"><User size={18} className="text-navy-600 dark:text-cyan-300" /> Profile settings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="label">Full name</label>
            <div className="relative"><User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input !pl-10" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></div></div>
          <div><label className="label">Email (locked)</label>
            <div className="relative"><Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input !pl-10 opacity-60" value={user?.email || ''} disabled /></div></div>
          <div><label className="label">Role (locked)</label>
            <div className="relative"><ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input !pl-10 capitalize opacity-60" value={user?.role || ''} disabled /></div></div>
          <div className="sm:col-span-2"><label className="label">Phone</label>
            <div className="relative"><Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input !pl-10" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91…" /></div></div>
        </div>
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} disabled={busy} className="btn-primary w-full !py-3.5">
          {busy ? <><Loader2 className="animate-spin" size={18} /> Saving…</> : <><Save size={17} /> Save changes</>}
        </motion.button>
        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400"><CheckCircle2 size={13} className="text-green-500" /> Changes apply instantly across dashboards.</p>
      </motion.form>
    </Page>
  );
}
