import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Loader2, MapPin, User, Clock, Send } from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { STATUSES, priorityColor, statusColor, formatDate } from '../utils/helpers.js';
import IncidentMap from '../components/IncidentMap.jsx';
import { Page } from '../components/ui.jsx';

export default function IncidentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [inc, setInc] = useState(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [assignee, setAssignee] = useState('');
  const [teams, setTeams] = useState([]);
  const [busy, setBusy] = useState(false);
  const canManage = user?.role === 'security' || user?.role === 'admin';

  useEffect(() => {
    api.get(`/incidents/${id}`).then(({ data }) => { setInc(data.incident); setStatus(data.incident.status); setAssignee(data.incident.assignedTo || ''); })
      .catch(() => toast.error('Could not load incident'));
    if (canManage) api.get('/teams').then(({ data }) => setTeams(data.teams || [])).catch(() => {});
  }, [id]);

  const save = async () => {
    if (!inc) return;
    setBusy(true);
    try {
      const { data } = await api.patch(`/incidents/${inc.incidentId}/status`, { status, note, assignedTo: assignee || undefined });
      setInc(data.incident); setNote('');
      toast.success(`Updated to ${status}`);
    } catch (e) { toast.error(e.response?.data?.message || 'Update failed'); }
    finally { setBusy(false); }
  };

  if (!inc) return <Page><div className="skeleton h-64" /><div className="skeleton mt-4 h-40" /></Page>;

  return (
    <Page className="mx-auto max-w-4xl space-y-4">
      <Link to={canManage ? '/security' : '/dashboard'} className="group inline-flex items-center gap-1.5 text-sm font-bold text-navy-600 dark:text-cyan-300"><ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" /> Back to queue</Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card relative overflow-hidden">
        <div className={`absolute inset-x-0 top-0 h-1.5 ${inc.priority === 'Critical' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-navy-600 to-cyan-400'}`} />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-extrabold sm:text-2xl">{inc.incidentId} · {inc.category}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin size={12} /> {inc.locationName}</span> ·
              <span className="flex items-center gap-1"><Clock size={12} /> {formatDate(inc.createdAt)}</span>
            </p>
          </div>
          <div className="flex gap-1.5">
            <span className={`chip border ${priorityColor(inc.priority)}`}>{inc.priority}</span>
            <span className={`chip ${statusColor(inc.status)}`}>{inc.status}</span>
          </div>
        </div>
        <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed dark:bg-slate-800">{inc.description}</p>
        {inc.imageUrl && <motion.img initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} src={inc.imageUrl.startsWith('http') ? inc.imageUrl : `${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}${inc.imageUrl}`} alt="evidence" className="mt-3 max-h-80 w-full rounded-2xl border object-cover shadow-card" />}
        <div className="mt-4 grid gap-2.5 text-xs sm:grid-cols-3">
          <span className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800"><User size={14} className="text-navy-500" /> Reporter: <b>{inc.reporter?.name || '—'}</b></span>
          {canManage && <span className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800"><Phone size={14} className="text-green-600" /> {inc.contactNumber || inc.reporter?.phone || 'No contact'}</span>}
          <span className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800"><Clock size={14} className="text-amber-500" /> Ack: {formatDate(inc.acknowledgedAt)} · Res: {formatDate(inc.resolvedAt)}</span>
        </div>
      </motion.div>

      {inc.coordinates?.lat && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card"><h2 className="font-display mb-2 font-bold">Incident location</h2><div className="overflow-hidden rounded-2xl border shadow-card dark:border-slate-700"><IncidentMap height="300px" incidents={[inc]} /></div></motion.div>}

      {canManage && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card relative overflow-hidden border-navy-100 dark:border-cyan-400/20">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-navy-500/10 blur-2xl" />
          <h2 className="font-display relative flex items-center gap-2 font-bold"><Send size={17} className="text-navy-600 dark:text-cyan-300" /> Respond & update</h2>
          <div className="relative mt-3 grid gap-3 sm:grid-cols-2">
            <div><label className="label">Status</label>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map(s => <button key={s} type="button" onClick={() => setStatus(s)} className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${status === s ? 'border-navy-600 bg-navy-600 text-white shadow-soft' : 'border-slate-200 dark:border-slate-700'}`}>{s}</button>)}
              </div>
            </div>
            <div><label className="label">Assign team / responder</label>
              <select className="input" value={assignee} onChange={e => setAssignee(e.target.value)}>
                <option value="">Unassigned</option>
                {teams.map(t => <option key={t._id} value={t.name}>{t.name} ({t.members?.length || 0} members)</option>)}
              </select></div>
          </div>
          <div className="relative mt-3"><label className="label">Response note</label>
            <textarea className="input min-h-20" value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Team Alpha on site, area cordoned…" /></div>
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={save} disabled={busy} className="btn-primary relative mt-3">{busy ? <><Loader2 className="animate-spin" size={17} /> Saving…</> : 'Save update →'}</motion.button>
        </motion.div>
      )}

      <div className="card">
        <h2 className="font-display font-bold">History & audit trail</h2>
        <div className="mt-3 space-y-2">{(inc.history || []).map((h, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 text-sm dark:bg-slate-800">
            <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r from-navy-600 to-cyan-400" />
            <div><p><b>{h.status}</b> — {h.note || '—'}</p><p className="text-xs text-slate-500">{formatDate(h.at)}</p></div>
          </motion.div>
        ))}
        {(!inc.history || inc.history.length === 0) && <p className="text-sm text-slate-400">No history yet.</p>}
        </div>
      </div>
    </Page>
  );
}
