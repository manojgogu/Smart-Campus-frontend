import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowLeft, MapPin, Clock, Loader2 } from 'lucide-react';
import api from '../services/api.js';
import { STATUSES, priorityColor, statusColor, formatDate } from '../utils/helpers.js';
import IncidentMap from '../components/IncidentMap.jsx';
import { Page, SkeletonGrid } from '../components/ui.jsx';

export default function TrackIncident() {
  const { id } = useParams();
  const [inc, setInc] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/incidents/track/${id}`)
      .then(({ data }) => setInc(data.incident))
      .catch(() => setErr('Incident not found or you do not have access.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Page><SkeletonGrid n={1} h="h-64" /><div className="skeleton mt-4 h-48" /></Page>;
  if (err) return <Page><div className="card mx-auto max-w-md text-center"><p className="font-bold text-red-600">{err}</p><Link to="/dashboard" className="btn-ghost mt-4">Back to dashboard</Link></div></Page>;

  const idx = STATUSES.indexOf(inc.status);
  const pct = Math.round(((idx + 1) / STATUSES.length) * 100);

  return (
    <Page className="mx-auto max-w-3xl space-y-4">
      <Link to="/dashboard" className="group inline-flex items-center gap-1.5 text-sm font-bold text-navy-600 dark:text-cyan-300"><ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" /> Back to dashboard</Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-navy-600 via-cyan-400 to-green-400" />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-display text-xl font-extrabold">{inc.incidentId} · {inc.category}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span className="flex items-center gap-1"><MapPin size={12} /> {inc.locationName}</span> · <span className="flex items-center gap-1"><Clock size={12} /> Reported {formatDate(inc.createdAt)}</span></p>
          </div>
          <div className="flex gap-1.5">
            <span className={`chip border ${priorityColor(inc.priority)}`}>{inc.priority}</span>
            <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className={`chip ${statusColor(inc.status)}`}>{inc.status}</motion.span>
          </div>
        </div>
        <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed dark:bg-slate-800">{inc.description}</p>
        {/* progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-bold"><span>Resolution progress</span><span>{pct}%</span></div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full bg-gradient-to-r from-navy-600 via-cyan-400 to-green-400" />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
        <h2 className="font-display font-bold">Progress timeline</h2>
        <div className="mt-4 space-y-0">
          {STATUSES.map((s, i) => {
            const done = i <= idx; const current = i === idx;
            return (
              <div key={s} className="relative flex gap-4 pb-6 last:pb-0">
                {i < STATUSES.length - 1 && <span className={`absolute left-[13px] top-8 h-full w-0.5 ${i < idx ? 'bg-green-400' : 'bg-slate-200 dark:bg-slate-700'}`} />}
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 400, damping: 20 }}
                  className={`z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${done ? 'bg-green-500 text-white shadow-pop' : 'border-2 border-slate-200 bg-white text-slate-300 dark:border-slate-700 dark:bg-slate-900'}`}>
                  {done ? <CheckCircle2 size={16} /> : <Circle size={14} />}
                </motion.span>
                <div className={`rounded-2xl border px-4 py-2.5 text-sm transition ${current ? 'border-navy-200 bg-navy-50/60 shadow-card dark:border-cyan-400/30 dark:bg-cyan-400/5' : 'border-transparent'}`}>
                  <span className={`${done ? 'font-bold' : 'text-slate-400'}`}>{s}</span>
                  {current && <span className="ml-2 rounded-full bg-navy-600 px-2 py-0.5 text-[10px] font-bold text-white">CURRENT</span>}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {inc.coordinates?.lat ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card">
          <h2 className="font-display mb-2 font-bold">Incident location</h2>
          <div className="overflow-hidden rounded-2xl border shadow-card dark:border-slate-700"><IncidentMap height="280px" incidents={[inc]} /></div>
        </motion.div>
      ) : null}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card">
        <h2 className="font-display font-bold">Response timeline</h2>
        <div className="mt-3 space-y-2">
          {(inc.history || []).map((h, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }} className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-3.5 text-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/60">
              <p><b>{h.status}</b> — {h.note || 'Status updated'}</p>
              <p className="mt-0.5 text-xs text-slate-500">{formatDate(h.at)} {h.by ? `· by ${h.by?.name || 'team'}` : ''}</p>
            </motion.div>
          ))}
          {(!inc.history || inc.history.length === 0) && (
            <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="flex items-center gap-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
              <Loader2 size={16} className="animate-spin" /> Waiting for security to acknowledge — you will be notified live.
            </motion.p>
          )}
        </div>
      </motion.div>
    </Page>
  );
}
