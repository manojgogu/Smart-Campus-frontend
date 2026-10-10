import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Siren, FileText, Flame, CheckCircle2, Bell, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocketCtx } from '../context/SocketContext.jsx';
import { priorityColor, statusColor, timeAgo } from '../utils/helpers.js';
import { Page, Stagger, StatCard, EmptyState, SkeletonGrid } from '../components/ui.jsx';
import { fadeUp } from '../animations/variants.js';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { notifications } = useSocketCtx();
  const [data, setData] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [{ data: s }, { data: r }] = await Promise.all([
          api.get('/incidents/my/stats'),
          api.get('/incidents/my?limit=5')
        ]);
        setData(s.stats);
        setRecent(r.incidents || []);
      } catch { setError('Could not load dashboard. Is the backend running?'); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Page><SkeletonGrid n={3} /><div className="skeleton mt-4 h-64" /></Page>;
  if (error) return <Page><div className="card mx-auto max-w-md text-center"><p className="text-red-600">{error}</p><Link to="/report" className="btn-danger mt-4">Report Emergency</Link></div></Page>;

  const cards = [
    { label: 'Total reports', value: data?.total ?? 0, icon: FileText, tint: 'text-navy-600 bg-navy-50 dark:bg-navy-500/20 dark:text-cyan-200' },
    { label: 'Active incidents', value: data?.active ?? 0, icon: Flame, tint: 'text-orange-600 bg-orange-50 dark:bg-orange-500/15' },
    { label: 'Resolved', value: data?.resolved ?? 0, icon: CheckCircle2, tint: 'text-green-600 bg-green-50 dark:bg-green-500/15' }
  ];

  return (
    <Page className="space-y-6">
      {/* Hero banner */}
      <motion.div variants={fadeUp} className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy-950 via-navy-800 to-slate-900 p-6 text-white shadow-pop sm:p-8">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-red-500/25 blur-3xl" />
        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 7, repeat: Infinity }} className="absolute -bottom-12 left-1/3 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wide backdrop-blur"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" /> SAFETY ACTIVE · 24/7 MONITORING</p>
            <h1 className="font-display mt-3 text-2xl font-extrabold sm:text-4xl">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="mt-1.5 text-white/70">Stay safe. Help is one tap away — security is alerted instantly with live tracking.</p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-green-300" /> Verified responders</span>
              <span className="flex items-center gap-1"><MapPin size={14} className="text-cyan-300" /> Live campus map</span>
              <span className="flex items-center gap-1"><Bell size={14} className="text-amber-300" /> Real-time updates</span>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }} className="relative">
            <motion.span animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-2xl bg-red-500/50 blur-xl" />
            <Link to="/report" className="btn-danger glow-btn relative !px-8 !py-4 !text-lg"><Siren className="animate-pulse" /> Report Emergency</Link>
          </motion.div>
        </div>
      </motion.div>

      <Stagger className="grid gap-4 sm:grid-cols-3">
        {cards.map((k, i) => <StatCard key={k.label} {...k} i={i} />)}
      </Stagger>

      <div className="grid gap-4 lg:grid-cols-5">
        <motion.div variants={fadeUp} className="card card-hover lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display font-bold">Recent reports</h2>
            <Link to="/report" className="group inline-flex items-center gap-1 text-sm font-bold text-navy-600 dark:text-cyan-300">+ New <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" /></Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState title="No reports yet" desc="If you face an emergency, tap Report Emergency — it takes under 30 seconds." action={<Link to="/report" className="btn-danger !py-2.5"><Siren size={16} /> Report now</Link>} />
          ) : (
            <div className="space-y-2">
              {recent.map((r, i) => (
                <motion.div key={r._id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link to={`/track/${r.incidentId}`} className="group flex items-center justify-between gap-2 rounded-2xl border border-slate-100 p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-card hover:ring-1 hover:ring-navy-200 dark:border-slate-700 dark:hover:ring-cyan-400/30">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold group-hover:text-navy-600 dark:group-hover:text-cyan-200">{r.incidentId} · {r.category}</p>
                      <p className="text-xs text-slate-500">{r.locationName} · {timeAgo(r.createdAt)}</p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <span className={`chip border ${priorityColor(r.priority)}`}>{r.priority}</span>
                      <span className={`chip ${statusColor(r.status)}`}>{r.status}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        <motion.div variants={fadeUp} className="card card-hover lg:col-span-2">
          <h2 className="font-display mb-3 flex items-center gap-2 font-bold">
            <span className="relative"><Bell size={18} />{notifications.length > 0 && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-ping rounded-full bg-red-500" />}</span>
            Live Notifications
          </h2>
          {notifications.length === 0
            ? <EmptyState icon={Bell} title="All quiet" desc="Status changes will appear here in real time with a glow + sound-free pulse." />
            : <div className="max-h-72 space-y-2 overflow-auto pr-1">{notifications.slice(0, 6).map((n, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-3 text-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/60">
                <p className="font-semibold">{n.title}</p><p className="text-slate-500">{n.message}</p>
              </motion.div>
            ))}</div>}
        </motion.div>
      </div>

      {/* quick actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[{ to: '/report', icon: Siren, t: 'New SOS report', d: 'Under 30 seconds', grad: 'from-red-500 to-orange-500' }, { to: '/map', icon: MapPin, t: 'Live campus map', d: 'See hotspots', grad: 'from-navy-600 to-cyan-500' }, { to: '/profile', icon: ShieldCheck, t: 'Safety profile', d: 'Keep info updated', grad: 'from-purple-600 to-indigo-500' }].map((a, i) => (
          <motion.div key={a.t} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }} whileHover={{ y: -5, scale: 1.02 }}>
            <Link to={a.to} className={`flex items-center gap-3 rounded-2xl bg-gradient-to-br ${a.grad} p-4 text-white shadow-pop`}>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur"><a.icon size={20} /></span>
              <span><span className="block font-bold">{a.t}</span><span className="text-xs text-white/70">{a.d}</span></span>
              <ArrowRight size={18} className="ml-auto opacity-70" />
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-xs leading-relaxed text-amber-800 dark:border-amber-500/30 dark:from-amber-500/10 dark:to-orange-500/10 dark:text-amber-200">
        Emergency disclaimer: CampusSafe supplements, rather than replaces, local emergency services. In life-threatening situations, call your local emergency number immediately.
      </motion.p>
    </Page>
  );
}
