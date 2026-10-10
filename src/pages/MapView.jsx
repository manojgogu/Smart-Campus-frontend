import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, LocateFixed, Layers } from 'lucide-react';
import api from '../services/api.js';
import IncidentMap from '../components/IncidentMap.jsx';
import { Page, SkeletonGrid } from '../components/ui.jsx';

export default function MapView() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  useEffect(() => { api.get('/incidents?limit=200').then(({ data }) => setIncidents(data.incidents || [])).catch(() => {}).finally(() => setLoading(false)); }, []);
  const filtered = filter === 'All' ? incidents : incidents.filter(i => i.priority === filter);
  const mapped = filtered.filter(i => i.coordinates?.lat);
  return (
    <Page className="space-y-4">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy-950 via-navy-800 to-cyan-900 p-6 text-white shadow-pop sm:p-7">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display flex items-center gap-2 text-2xl font-extrabold"><MapPin className="text-cyan-300" /> Live Campus Map</h1>
            <p className="mt-1 text-sm text-white/70">Red = Critical · Orange = High · Yellow = Medium · Green = Low · {mapped.length} of {incidents.length} incidents have coordinates.</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Critical', 'High', 'Medium', 'Low'].map(p => (
              <button key={p} onClick={() => setFilter(p)} className={`rounded-xl px-3.5 py-1.5 text-xs font-bold backdrop-blur transition ${filter === p ? 'bg-white text-navy-800 shadow-pop' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
      {loading ? <SkeletonGrid n={1} h="h-[60vh]" /> : (
        <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className="overflow-hidden rounded-[1.5rem] border border-slate-200/70 shadow-pop dark:border-slate-700">
          <IncidentMap incidents={mapped} height="60vh" />
        </motion.div>
      )}
      <div className="grid gap-2.5 sm:grid-cols-4">
        {[['Critical', 'bg-red-500', incidents.filter(i => i.priority === 'Critical').length], ['High', 'bg-orange-500', incidents.filter(i => i.priority === 'High').length], ['Medium', 'bg-yellow-400', incidents.filter(i => i.priority === 'Medium').length], ['Low', 'bg-green-500', incidents.filter(i => i.priority === 'Low').length]].map(([l, c, n]) => (
          <motion.button key={l} whileHover={{ y: -3 }} onClick={() => setFilter(l)} className="card flex items-center gap-3 !p-4 text-left">
            <span className={`h-3.5 w-3.5 rounded-full ${c} shadow-pop`} /><span><span className="font-display block text-lg font-extrabold leading-none">{n}</span><span className="text-xs text-slate-500">{l}</span></span>
          </motion.button>
        ))}
      </div>
      <p className="flex items-center gap-1.5 text-xs text-slate-400"><Layers size={13} /> Map tiles © OpenStreetMap · <LocateFixed size={13} /> Tap markers for incident details.</p>
    </Page>
  );
}
