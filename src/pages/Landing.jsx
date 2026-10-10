import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Zap, MapPin, BellRing, Radar, Users, BarChart3, ArrowRight, Siren, CheckCircle2, Clock, Sparkles, PhoneCall, ChevronRight } from 'lucide-react';
import { fadeUp, stagger } from '../animations/variants.js';
import { SectionHeading, Reveal, HeroBackdrop, AnimatedNumber } from '../components/ui.jsx';

const FEATURES = [
  { icon: Zap, title: 'Instant Emergency Reporting', desc: 'One-click SOS with category, priority, location and photo. Unique incident ID generated instantly.', tint: 'bg-red-50 text-red-600 dark:bg-red-500/15' },
  { icon: MapPin, title: 'Campus Location Mapping', desc: 'OpenStreetMap markers color-coded by priority with popups and responder routing.', tint: 'bg-navy-50 text-navy-600 dark:bg-navy-500/15 dark:text-cyan-300' },
  { icon: BellRing, title: 'Real-Time Security Alerts', desc: 'Socket.IO live push to security queue with polling fallback when offline.', tint: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15' },
  { icon: Radar, title: 'Emergency Status Tracking', desc: 'Reported → Acknowledged → Assigned → In Progress → Resolved with full audit trail.', tint: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15' },
  { icon: Users, title: 'Response Team Coordination', desc: 'Assign teams, add response notes, and track acknowledgment and resolution timestamps.', tint: 'bg-purple-50 text-purple-600 dark:bg-purple-500/15' },
  { icon: BarChart3, title: 'Incident Analytics', desc: 'Reports over time, category mix, location hotspots and resolution distribution.', tint: 'bg-green-50 text-green-600 dark:bg-green-500/15' }
];

const STEPS = [
  { title: 'Report an emergency', desc: 'Student submits category, location and description in seconds.' },
  { title: 'Security receives alert', desc: 'Live notification lands in the security queue, critical first.' },
  { title: 'Response team takes action', desc: 'Responder acknowledges, is assigned, and posts field notes.' },
  { title: 'Incident resolved & recorded', desc: 'Resolution timestamped; history and analytics updated.' }
];

function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const stats = [
    { label: 'Incidents reported (demo)', value: 1284, suffix: '+' },
    { label: 'Incidents resolved (demo)', value: 1159, suffix: '+' },
    { label: 'Avg. response time (demo)', value: 8, suffix: ' min' }
  ];
  return (
    <div ref={ref} className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((s, i) => (
        <motion.div key={s.label} variants={fadeUp} custom={i} whileHover={{ y: -6 }}
          className="glass relative overflow-hidden rounded-2xl p-6 text-center">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy-600 via-cyan-400 to-navy-600" />
          <p className="font-display text-3xl font-extrabold text-navy-700 dark:text-white">
            {inView ? <AnimatedNumber value={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
          </p>
          <p className="mt-1 text-sm text-slate-500">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function Landing() {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="overflow-hidden">
      {/* HERO */}
      <section className="relative px-4 pb-16 pt-28 sm:px-6 sm:pt-36">
        <HeroBackdrop />
        {/* floating particles */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {[...Array(16)].map((_, i) => (
            <motion.span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-navy-300 dark:bg-cyan-400/60"
              style={{ left: `${(i * 61) % 100}%`, top: `${(i * 37) % 75}%` }}
              animate={{ y: [0, -16, 0], opacity: [0.25, 1, 0.25], scale: [1, 1.4, 1] }}
              transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.22 }} />
          ))}
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white/70 px-4 py-1.5 text-xs font-bold text-navy-700 shadow-card backdrop-blur dark:border-cyan-400/20 dark:bg-white/5 dark:text-cyan-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-red-500" />
                <span className="h-2 w-2 rounded-full bg-red-500" />
              </span>
              LIVE CAMPUS SAFETY PLATFORM
              <span className="rounded-full bg-navy-600 px-2 py-0.5 text-[10px] text-white">v2 PREMIUM</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              A Safer Campus Starts With <span className="bg-gradient-to-r from-navy-600 via-red-500 to-cyan-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">One Click.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 max-w-lg text-lg text-slate-600 dark:text-slate-300">
              Report emergencies instantly. Connect with campus security. Help create a safer environment for everyone.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register" className="btn-danger glow-btn !px-8 !py-4 !text-base"><Siren size={19} /> Report an Emergency</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <a href="#features" className="btn-ghost !px-6 !py-4">Explore Features <ArrowRight size={17} /></a>
              </motion.div>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> Real-time alerts</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> Live map</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> Analytics</span>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-3 text-xs text-slate-400">Demo statistics shown below are clearly labeled sample data.</motion.p>
          </div>

          {/* Dashboard preview with parallax float */}
          <motion.div variants={fadeUp} className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-navy-600/15 via-cyan-400/15 to-red-500/10 blur-2xl" />
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}
              className="glass-strong relative overflow-hidden rounded-3xl">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 flex items-center gap-1 text-xs font-medium text-slate-400"><Sparkles size={12} /> campussafe · security console · live</span>
                <span className="ml-auto flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" /> ONLINE</span>
              </div>
              <div className="grid grid-cols-3 gap-3 p-4">
                {[{ l: 'Active', v: '12', c: 'text-red-600', bg: 'from-red-500/10 to-red-500/5' }, { l: 'Responding', v: '7', c: 'text-orange-500', bg: 'from-orange-500/10 to-orange-500/5' }, { l: 'Resolved', v: '1.1k', c: 'text-green-600', bg: 'from-green-500/10 to-green-500/5' }].map(k => (
                  <motion.div key={k.l} whileHover={{ scale: 1.04 }} className={`rounded-2xl bg-gradient-to-br ${k.bg} border border-slate-100 p-3 text-center dark:border-slate-800`}>
                    <p className={`font-display text-xl font-extrabold ${k.c}`}>{k.v}</p><p className="text-[11px] text-slate-500">{k.l}</p>
                  </motion.div>
                ))}
              </div>
              <div className="space-y-2 p-4 pt-0">
                {[{ t: 'Medical — Library', p: 'Critical', c: 'bg-red-500', pulse: true }, { t: 'Fire alarm — Cafeteria', p: 'High', c: 'bg-orange-500' }, { t: 'Suspicious activity — Parking', p: 'Medium', c: 'bg-yellow-500' }].map((r, idx) => (
                  <motion.div key={r.t} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + idx * 0.15 }}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/60 px-3 py-2.5 text-sm backdrop-blur dark:border-slate-800 dark:bg-slate-800/60">
                    <span className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        {r.pulse && <span className={`absolute h-full w-full animate-ping rounded-full ${r.c}`} />}
                        <span className={`h-2.5 w-2.5 rounded-full ${r.c}`} />
                      </span>{r.t}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold dark:bg-slate-700">{r.p}</span>
                  </motion.div>
                ))}
              </div>
              {/* live ticker */}
              <div className="overflow-hidden border-t border-slate-100 bg-slate-50/60 py-2 dark:border-slate-800 dark:bg-slate-800/40">
                <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} className="flex w-max gap-8 whitespace-nowrap text-[11px] text-slate-500">
                  {[0, 1].map(k => <span key={k}>● Team Alpha dispatched · Library (ETA 4 min) &nbsp;&nbsp; ● Fire drill completed · Auditorium &nbsp;&nbsp; ● New SOS verified · Parking Lot &nbsp;&nbsp; ● Patrol check-in · Hostel A &nbsp;&nbsp;</span>)}
                </motion.div>
              </div>
            </motion.div>
            {/* floating cards */}
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity }}
              className="glass absolute -left-4 top-8 flex items-center gap-2 rounded-2xl px-4 py-3 shadow-pop">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white">
                <Siren size={18} />
                <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-red-400" />
              </span>
              <div><p className="text-xs font-bold">SOS received</p><p className="text-[11px] text-slate-500">Library · just now</p></div>
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 0.6 }}
              className="glass absolute -right-3 bottom-12 flex items-center gap-2 rounded-2xl px-4 py-3 shadow-pop">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-cyan-500 text-white">
                <ShieldCheck size={20} />
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
              </span>
              <div><p className="flex items-center gap-1 text-xs font-bold">Team dispatched <CheckCircle2 size={13} className="text-green-500" /></p><p className="flex items-center gap-1 text-[11px] text-slate-500"><Clock size={11} /> ETA 4 min (demo)</p></div>
            </motion.div>
          </motion.div>
        </div>

        <div className="mx-auto mt-14 max-w-5xl"><Stats /></div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-slate-100 bg-white/60 py-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/40">
        <div className="section-pad flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-semibold text-slate-500">
          {['Socket.IO Realtime', 'OpenStreetMap Live', 'JWT Secured', 'Role-based Access', 'Mobile Ready'].map(t => (
            <span key={t} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-navy-600 to-cyan-400" />{t}</span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section-pad py-20">
        <SectionHeading eyebrow="Features" title="Everything campus safety needs" desc="Report-to-resolution workflow with live alerts, maps and analytics." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} i={i}>
              <motion.div whileHover={{ y: -8, scale: 1.01 }} className="card card-hover group h-full">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${f.tint}`}><f.icon size={22} /></span>
                <h3 className="mt-4 font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-navy-600 opacity-0 transition group-hover:opacity-100 dark:text-cyan-300">Learn more <ChevronRight size={13} /></span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative overflow-hidden border-y border-slate-100 bg-gradient-to-b from-slate-50/80 to-white py-20 dark:border-slate-800 dark:from-slate-900/60 dark:to-slate-950">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[50rem] -translate-x-1/2 rounded-full bg-navy-200/40 blur-3xl dark:bg-navy-600/10" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading eyebrow="How it works" title="From report to resolution" desc="Four steps, fully tracked and timestamped." />
          <div className="relative mt-10 space-y-6 before:absolute before:bottom-4 before:left-[27px] before:top-4 before:w-0.5 before:bg-gradient-to-b before:from-navy-500 before:via-cyan-400 before:to-green-400">
            {STEPS.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="relative flex gap-4">
                <motion.span whileHover={{ scale: 1.1, rotate: -4 }} className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-600 to-cyan-500 font-display font-extrabold text-white shadow-pop">{i + 1}</motion.span>
                <div className="card card-hover flex-1 !py-4"><h3 className="font-bold">{s.title}</h3><p className="text-sm text-slate-500">{s.desc}</p></div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary !px-8 !py-3.5">Get started free <ArrowRight size={17} /></Link>
            <a href="tel:112" className="btn-ghost !px-6 !py-3.5"><PhoneCall size={17} /> Emergency: 112 (demo)</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 p-10 text-center text-white shadow-pop sm:p-14">
            <div className="absolute inset-0 hero-grid opacity-40" />
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-red-500/20 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">Join CampusSafe</p>
              <h2 className="font-display mx-auto mt-3 max-w-2xl text-3xl font-extrabold sm:text-5xl">Help make your campus safer tonight.</h2>
              <p className="mx-auto mt-3 max-w-xl text-white/70">Create an account in seconds. Report, track and stay informed — security responds in real time.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/register" className="btn-danger glow-btn !px-8 !py-4">Create free account</Link>
                <Link to="/login" className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold backdrop-blur transition hover:bg-white/20">Sign in</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </motion.div>
  );
}
