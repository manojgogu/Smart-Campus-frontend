import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Siren, RefreshCw, Wifi, WifiOff, Search, MapPin, ShieldAlert } from 'lucide-react';
import api from '../services/api.js';
import { useSocketCtx } from '../context/SocketContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { CATEGORIES, PRIORITIES, STATUSES, priorityColor, statusColor, timeAgo } from '../utils/helpers.js';
import { Page, EmptyState, SkeletonGrid } from '../components/ui.jsx';

const rank = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export default function SecurityDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [f, setF] = useState({ priority: '', status: 'Active', category: '', q: '' });
  const { socket } = useSocketCtx();
  const toast = useToast();
  const live = !!socket?.connected;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (f.priority) params.priority = f.priority;
      if (f.category) params.category = f.category;
      if (f.status === 'Active') params.active = 'true';
      else if (f.status && f.status !== 'All') params.status = f.status;
      if (f.q) params.q = f.q;
      const { data } = await api.get('/incidents', { params });
      setIncidents([...(data.incidents || [])].sort((a, b) => rank[a.priority] - rank[b.priority] || new Date(b.createdAt) - new Date(a.createdAt)));
    } catch { toast.error('Failed to load queue'); }
    finally { setLoading(false); }
  }, [f]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (!socket) return;
    const onNew = (inc) => {
      setIncidents(prev => [inc, ...prev]);
      toast.success(`New ${inc.priority} incident: ${inc.incidentId}`);
    };
    const onUpd = (inc) => setIncidents(prev => prev.map(x => (x.incidentId === inc.incidentId ? inc : x)));
    socket.on('incident:new', onNew);
    socket.on('incident:updated', onUpd);
    return () => { socket.off('incident:new', onNew); socket.off('incident:updated', onUpd); };
  }, [socket]);

  const quickAck = async (inc) => {
    try {
      const { data } = await api.patch(`/incidents/${inc.incidentId}/status`, { status: 'Acknowledged' });
      setIncidents(prev => prev.map(x => (x.incidentId === inc.incidentId ? data.incident : x)));
      toast.success(`${inc.incidentId} acknowledged`);
    } catch { toast.error('Update failed'); }
  };

  const critical = incidents.filter(i => i.priority === 'Critical' && i.status !== 'Resolved').length;

  return (
    <Page className="space-y-4">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-red-600 via-navy-800 to-navy-950 p-6 text-white shadow-pop sm:p-7">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-red-400/30 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display flex items-center gap-2.5 text-2xl font-extrabold sm:text-3xl">
              <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Siren size={22} />
                <span className="absolute -right-1 -top-1 flex h-3 w-3"><span className="absolute h-full w-full animate-ping rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-red-400" /></span>
              </span>
              Active Emergency Queue
            </h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-white/70">
              {live
                ? <span className="inline-flex items-center gap-1.5 rounded-full bg-green-400/15 px-3 py-1 text-xs font-bold text-green-300"><Wifi size={13} /> Live via Socket.IO</span>
                : <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300"><WifiOff size={13} /> Realtime unavailable — fallback every 20s</span>}
              {critical > 0 && <motion.span animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.4, repeat: Infinity }} className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-extrabold"><ShieldAlert size={13} /> {critical} CRITICAL</motion.span>}
              <span className="text-xs">{incidents.length} in view</span>
            </p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={fetchAll} className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 font-semibold backdrop-blur transition hover:bg-white/25">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass sticky top-[101px] z-20 flex flex-wrap gap-2 rounded-2xl p-3">
        <div className="relative min-w-48 flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input !pl-10" placeholder="Search ID / location…" value={f.q} onChange={e => setF({ ...f, q: e.target.value })} />
        </div>
        <select className="input !w-36" value={f.priority} onChange={e => setF({ ...f, priority: e.target.value })}>
          <option value="">All priorities</option>{PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
        <select className="input !w-40" value={f.category} onChange={e => setF({ ...f, category: e.target.value })}>
          <option value="">All types</option>{CATEGORIES.map(p => <option key={p}>{p}</option>)}
        </select>
        <select className="input !w-36" value={f.status} onChange={e => setF({ ...f, status: e.target.value })}>
          {['Active', 'All', ...STATUSES].map(p => <option key={p}>{p}</option>)}
        </select>
      </motion.div>

      {loading ? <SkeletonGrid n={4} h="h-40" />
        : incidents.length === 0 ? (
          <EmptyState icon={ShieldAlert} title="All clear 🎉" desc="No incidents match the current filters. New SOS reports will slide in here live." />
        ) : (
          <motion.div layout className="grid gap-3 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {incidents.map((r, i) => (
                <motion.div key={r._id} layout initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.4 }}
                  whileHover={{ y: -4 }}
                  className={`card relative overflow-hidden !p-5 ${r.priority === 'Critical' && r.status !== 'Resolved' ? 'ring-2 ring-red-500/60 shadow-glowred' : 'card-hover'}`}>
                  {r.priority === 'Critical' && r.status !== 'Resolved' && (
                    <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.6, repeat: Infinity }} className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-orange-400 to-red-500" />
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-display font-extrabold">{r.incidentId} · {r.category}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><MapPin size={12} /> {r.locationName} · {timeAgo(r.createdAt)} · by {r.reporter?.name || 'reporter'}</p>
                    </div>
                    <motion.span whileHover={{ scale: 1.08 }} className={`chip border ${priorityColor(r.priority)}`}>{r.priority}</motion.span>
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{r.description}</p>
                  <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span className={`chip ${statusColor(r.status)}`}><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />{r.status}</span>
                    <div className="flex gap-2">
                      {r.status === 'Reported' && <motion.button whileTap={{ scale: 0.95 }} onClick={() => quickAck(r)} className="rounded-xl bg-gradient-to-r from-navy-600 to-cyan-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-soft transition hover:brightness-110">Acknowledge</motion.button>}
                      <Link to={`/incidents/${r.incidentId}`} className="btn-ghost !px-3.5 !py-1.5 !text-xs">Open details →</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
    </Page>
  );
}
