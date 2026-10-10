import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Siren, Loader2, MapPin, CheckCircle2, TriangleAlert, Camera, Phone } from 'lucide-react';
import api from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { CATEGORIES, PRIORITIES, BUILDINGS } from '../utils/helpers.js';
import IncidentMap from '../components/IncidentMap.jsx';
import { Page } from '../components/ui.jsx';

const PRIORITY_META = {
  Critical: 'bg-red-500 text-white border-red-500 shadow-glowred',
  High: 'bg-orange-500 text-white border-orange-500',
  Medium: 'bg-yellow-400 text-yellow-950 border-yellow-400',
  Low: 'bg-green-500 text-white border-green-500'
};

export default function ReportEmergency() {
  const [form, setForm] = useState({ category: 'Medical', priority: 'High', locationName: BUILDINGS[0], description: '', contactNumber: '', lat: '', lng: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const [geoNote, setGeoNote] = useState('');
  const toast = useToast();
  const nav = useNavigate();

  const useGPS = () => {
    if (!navigator.geolocation) return setGeoNote('GPS not available in this browser. You can tap the map instead.');
    navigator.geolocation.getCurrentPosition(
      (p) => { setForm(f => ({ ...f, lat: p.coords.latitude.toFixed(6), lng: p.coords.longitude.toFixed(6) })); setGeoNote('GPS location captured. Accuracy varies by device.'); },
      () => setGeoNote('Location permission denied. Please pick a point on the map or choose a building.'),
      { timeout: 8000 }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setErr('');
    if (form.description.trim().length < 10) return setErr('Describe the incident in at least 10 characters.');
    if (!form.locationName.trim()) return setErr('Enter a building / location name.');
    if (form.contactNumber && !/^[+\d][\d\s-]{6,15}$/.test(form.contactNumber)) return setErr('Enter a valid contact number or leave it blank.');
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      const { data } = await api.post('/incidents', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setDone(data.incident);
      toast.success(`Report submitted: ${data.incident.incidentId}`);
    } catch (e2) {
      const m = e2.response?.data?.message || 'Submission failed. Try again.';
      setErr(m); toast.error(m);
    } finally { setBusy(false); }
  };

  if (done) {
    return (
      <Page className="mx-auto max-w-lg">
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }} className="card relative overflow-hidden text-center">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-400" />
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 16 }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-pop">
            <CheckCircle2 size={38} />
          </motion.span>
          <h1 className="font-display mt-4 text-2xl font-extrabold">Report received</h1>
          <p className="mt-1 text-sm text-slate-500">Security has been notified in real time. Track progress below.</p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-4 rounded-2xl border border-navy-100 bg-gradient-to-br from-navy-50 to-cyan-50 p-5 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
            <p className="text-[11px] font-bold tracking-widest text-slate-400">INCIDENT ID</p>
            <p className="font-display text-3xl font-extrabold tracking-wide text-navy-700 dark:text-white">{done.incidentId}</p>
            <p className="mt-1.5 text-sm">Status: <b>{done.status}</b> · Priority: <b>{done.priority}</b></p>
          </motion.div>
          <div className="mt-5 flex gap-2">
            <button onClick={() => nav(`/track/${done.incidentId}`)} className="btn-primary flex-1 !py-3.5">Track progress →</button>
            <button onClick={() => { setDone(null); setForm(f => ({ ...f, description: '' })); }} className="btn-ghost">New report</button>
          </div>
        </motion.div>
      </Page>
    );
  }

  return (
    <Page className="mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-red-600 via-red-600 to-navy-900 p-6 text-white shadow-pop sm:p-7">
        <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.55, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display flex items-center gap-2 text-2xl font-extrabold sm:text-3xl"><Siren className="animate-pulse" /> Report Emergency</h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">Fill this form — security is alerted instantly. For life-threatening danger, call local emergency services first.</p>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur">● LIVE DISPATCH</span>
        </div>
      </div>

      <AnimatePresence>
        {err && <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{err}</motion.p>}
      </AnimatePresence>

      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card mt-4 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Category *</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(c => (
                <button key={c} type="button" onClick={() => setForm({ ...form, category: c })}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${form.category === c ? 'border-navy-600 bg-navy-600 text-white shadow-soft' : 'border-slate-200 hover:border-navy-300 dark:border-slate-700'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div><label className="label">Priority *</label>
            <div className="flex flex-wrap gap-1.5">
              {PRIORITIES.map(c => (
                <motion.button key={c} whileTap={{ scale: 0.94 }} type="button" onClick={() => setForm({ ...form, priority: c })}
                  className={`rounded-xl border px-3.5 py-1.5 text-xs font-extrabold transition ${form.priority === c ? PRIORITY_META[c] : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700'}`}>{c}</motion.button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">Critical pages the on-duty team immediately.</p>
          </div>
        </div>
        <div><label className="label">Campus building / location *</label>
          <input className="input" list="bldgs" value={form.locationName} onChange={e => setForm({ ...form, locationName: e.target.value })} placeholder="e.g. Library, 2nd floor" />
          <datalist id="bldgs">{BUILDINGS.map(b => <option key={b} value={b} />)}</datalist></div>
        <div><label className="label">What is happening? * (min 10 chars)</label>
          <textarea className="input min-h-28" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe people involved, hazards, injuries…" />
          <p className={`mt-1 text-right text-[11px] ${form.description.length >= 10 ? 'text-green-600' : 'text-slate-400'}`}>{form.description.length}/10 minimum</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label flex items-center gap-1.5"><Phone size={14} /> Contact number (optional)</label>
            <input className="input" value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} placeholder="+91…" /></div>
          <div><label className="label flex items-center gap-1.5"><Camera size={14} /> Photo evidence (optional, ≤5MB)</label>
            <input type="file" accept="image/*" className="input !p-2 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-600 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white" onChange={e => {
              const f = e.target.files[0];
              if (f && f.size > 5 * 1024 * 1024) { setErr('Image must be 5MB or smaller.'); return; }
              setImage(f || null);
              setPreview(f ? URL.createObjectURL(f) : null);
            }} />
            {preview && <motion.img initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} src={preview} alt="preview" className="mt-2 h-24 w-full rounded-xl border object-cover" />}
          </div>
        </div>
        <div>
          <label className="label">Map location (optional — tap map or use GPS)</label>
          <div className="overflow-hidden rounded-2xl border shadow-card dark:border-slate-700">
            <IncidentMap height="260px" incidents={form.lat ? [{ _id: 'draft', incidentId: 'DRAFT', category: form.category, priority: form.priority, status: 'Reported', locationName: form.locationName, coordinates: { lat: +form.lat, lng: +form.lng } }] : []}
              onSelect={(c) => setForm(f => ({ ...f, lat: c.lat.toFixed(6), lng: c.lng.toFixed(6) }))} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={useGPS} className="btn-ghost !py-2 text-sm"><MapPin size={15} /> Use my GPS</motion.button>
            {form.lat && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">📍 {form.lat}, {form.lng}</motion.span>}
            {geoNote && <span className="text-xs text-amber-600">{geoNote}</span>}
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} disabled={busy} className="btn-danger glow-btn w-full !py-4 !text-lg">
          {busy ? <><Loader2 className="animate-spin" /> Sending alert…</> : <><Siren className="animate-pulse" /> Send Emergency Alert</>}
        </motion.button>
        <p className="flex items-start gap-2 rounded-2xl bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800 dark:bg-amber-500/10 dark:text-amber-200"><TriangleAlert size={14} className="mt-0.5 shrink-0" /> False reports waste responder time and may violate campus policy. Only submit genuine emergencies.</p>
      </motion.form>
    </Page>
  );
}
