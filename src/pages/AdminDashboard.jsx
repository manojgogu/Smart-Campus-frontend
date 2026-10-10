import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts';
import { Users, Siren, CheckCircle2, Clock, Download, Search, TrendingUp, MapPin } from 'lucide-react';
import api from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { downloadCSV, timeAgo } from '../utils/helpers.js';
import { Page, Stagger, StatCard, EmptyState, SkeletonGrid } from '../components/ui.jsx';

const COLORS = ['#2547eb', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [tab, setTab] = useState('overview');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const toast = useToast();

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data)).catch(() => toast.error('Stats failed — is backend running?'));
    api.get('/admin/users?limit=100').then(({ data }) => setUsers(data.users || [])).catch(() => {});
    api.get('/incidents?limit=100').then(({ data }) => setIncidents(data.incidents || [])).catch(() => {});
  }, []);

  const filteredUsers = useMemo(() => users.filter(u => (u.name + u.email + u.role).toLowerCase().includes(q.toLowerCase())), [users, q]);
  const paged = filteredUsers.slice((page - 1) * 10, page * 10);

  const toggleUser = async (u) => {
    try {
      const { data } = await api.patch(`/admin/users/${u._id}/toggle`);
      setUsers(prev => prev.map(x => (x._id === u._id ? data.user : x)));
      toast.success(`${u.name} ${data.user.isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Action failed'); }
  };

  const exportCSV = () => {
    downloadCSV('campussafe-incidents.csv', [
      ['incidentId', 'category', 'priority', 'status', 'location', 'reporter', 'createdAt', 'resolvedAt'],
      ...incidents.map(i => [i.incidentId, i.category, i.priority, i.status, i.locationName, i.reporter?.email || '', i.createdAt, i.resolvedAt || ''])
    ]);
    toast.success('CSV exported');
  };

  const cards = [
    { label: 'Total incidents', value: stats?.counts?.total ?? 0, icon: Siren, tint: 'text-navy-600 bg-navy-50 dark:bg-navy-500/20 dark:text-cyan-200', sub: 'All time' },
    { label: 'Active now', value: stats?.counts?.active ?? 0, icon: Clock, tint: 'text-orange-600 bg-orange-50 dark:bg-orange-500/15', sub: 'Needs response' },
    { label: 'Resolved', value: stats?.counts?.resolved ?? 0, icon: CheckCircle2, tint: 'text-green-600 bg-green-50 dark:bg-green-500/15', sub: 'Closed loop' },
    { label: 'Users', value: stats?.counts?.users ?? users.length, icon: Users, tint: 'text-purple-600 bg-purple-50 dark:bg-purple-500/15', sub: 'Across roles' }
  ];

  const chartCard = 'card card-hover overflow-hidden';

  return (
    <Page className="space-y-5">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy-950 via-indigo-900 to-slate-900 p-6 text-white shadow-pop sm:p-8">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <motion.div animate={{ x: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -top-12 right-20 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold backdrop-blur"><TrendingUp size={13} className="text-green-300" /> COMMAND CENTER</p>
            <h1 className="font-display mt-2 text-2xl font-extrabold sm:text-3xl">Admin Console</h1>
            <p className="mt-1 text-sm text-white/70">Avg. response time: <b className="text-white">{stats?.avgResponseMinutes != null ? `${stats.avgResponseMinutes} min (actual timestamps)` : '—'}</b></p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={exportCSV} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-bold text-navy-800 shadow-pop transition hover:-translate-y-0.5">
            <Download size={16} /> Export CSV
          </motion.button>
        </div>
      </div>

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((k, i) => <StatCard key={k.label} {...k} i={i} />)}
      </Stagger>

      {/* Tabs */}
      <div className="glass inline-flex gap-1.5 rounded-2xl p-1.5">
        {['overview', 'users', 'incidents'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`relative rounded-xl px-5 py-2 text-sm font-bold capitalize transition ${tab === t ? 'text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>
            {tab === t && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-xl bg-gradient-to-r from-navy-600 to-cyan-500 shadow-soft" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
            <span className="relative">{t}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          {tab === 'overview' && (
            !stats ? <SkeletonGrid n={4} h="h-64" /> : (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className={chartCard}>
                  <h3 className="font-display font-bold">Reports over time</h3>
                  <p className="text-xs text-slate-500">Volume trend — spot spikes early</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={stats.overTime || []}>
                      <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2547eb" stopOpacity={0.35} /><stop offset="100%" stopColor="#2547eb" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.4} /><XAxis dataKey="_id" fontSize={11} /><YAxis fontSize={11} /><Tooltip contentStyle={{ borderRadius: 12 }} />
                      <Area type="monotone" dataKey="count" stroke="#2547eb" strokeWidth={2.5} fill="url(#g1)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className={chartCard}>
                  <h3 className="font-display font-bold">By category</h3>
                  <p className="text-xs text-slate-500">What is happening most</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={stats.byCategory || []}><XAxis dataKey="_id" fontSize={11} /><YAxis fontSize={11} /><Tooltip contentStyle={{ borderRadius: 12 }} /><Bar dataKey="count" fill="#2547eb" radius={[8, 8, 0, 0]} /></BarChart>
                  </ResponsiveContainer>
                </div>
                <div className={chartCard}>
                  <h3 className="font-display flex items-center gap-1.5 font-bold"><MapPin size={16} /> By location</h3>
                  <p className="text-xs text-slate-500">Top hotspot buildings</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={(stats.byLocation || []).slice(0, 8)} layout="vertical"><XAxis type="number" fontSize={11} /><YAxis type="category" dataKey="_id" width={110} fontSize={11} /><Tooltip contentStyle={{ borderRadius: 12 }} /><Bar dataKey="count" fill="#06b6d4" radius={[0, 8, 8, 0]} /></BarChart>
                  </ResponsiveContainer>
                </div>
                <div className={chartCard}>
                  <h3 className="font-display font-bold">Resolution status</h3>
                  <p className="text-xs text-slate-500">Pipeline distribution</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart><Pie data={stats.byStatus || []} dataKey="count" nameKey="_id" outerRadius={90} label strokeWidth={2}>{(stats.byStatus || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12 }} /></PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )
          )}

          {tab === 'users' && (
            <div className="card">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy-600 dark:bg-navy-500/15 dark:text-cyan-200"><Search size={16} /></span>
                <input className="input" placeholder="Search users by name, email, role…" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
              </div>
              {paged.length === 0 ? <EmptyState title="No users found" desc="Try a different search term." /> : (
                <>
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-xs uppercase tracking-wide text-slate-400"><th className="py-2">Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
                      <tbody>{paged.map((u, i) => (
                        <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-t transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 font-semibold">{u.name}</td><td className="text-slate-500">{u.email}</td>
                          <td><span className="chip bg-navy-50 capitalize text-navy-700 dark:bg-navy-500/15 dark:text-cyan-200">{u.role}</span></td>
                          <td>{u.isActive ? <span className="chip bg-green-100 text-green-700">● Active</span> : <span className="chip bg-slate-100 text-slate-500">○ Off</span>}</td>
                          <td className="text-right"><motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleUser(u)} className="rounded-xl border px-3.5 py-1.5 text-xs font-bold transition hover:-translate-y-0.5 hover:shadow-card dark:border-slate-700">{u.isActive ? 'Deactivate' : 'Activate'}</motion.button></td>
                        </motion.tr>
                      ))}</tbody>
                    </table>
                  </div>
                  <div className="space-y-2 md:hidden">{paged.map(u => (
                    <div key={u._id} className="rounded-2xl border p-3.5 dark:border-slate-700"><p className="font-bold">{u.name}</p><p className="text-xs text-slate-500">{u.email} · {u.role}</p>
                      <button onClick={() => toggleUser(u)} className="mt-2 rounded-xl border px-3 py-1.5 text-xs font-bold">{u.isActive ? 'Deactivate' : 'Activate'}</button></div>
                  ))}</div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Page {page} of {Math.max(1, Math.ceil(filteredUsers.length / 10))}</span>
                    <div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-ghost !py-1.5">Prev</button><button disabled={page * 10 >= filteredUsers.length} onClick={() => setPage(p => p + 1)} className="btn-ghost !py-1.5">Next</button></div>
                  </div>
                </>
              )}
            </div>
          )}

          {tab === 'incidents' && (
            <div className="card">
              <h3 className="font-display font-bold">Incident history ({incidents.length})</h3>
              <div className="mt-3 space-y-2">{incidents.slice(0, 20).map((i, idx) => (
                <motion.div key={i._id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 p-3 text-sm transition hover:-translate-y-0.5 hover:shadow-card dark:border-slate-700">
                  <span><b>{i.incidentId}</b> · {i.category} · {i.locationName} · <span className="text-slate-500">{timeAgo(i.createdAt)}</span></span>
                  <span className="chip bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">{i.status}</span>
                </motion.div>
              ))}</div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Page>
  );
}
