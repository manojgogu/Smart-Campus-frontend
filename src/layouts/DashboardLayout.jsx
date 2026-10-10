import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, LayoutDashboard, Siren, Map as MapIcon, Bell, User, Menu, X, Sun, Moon, LogOut, TriangleAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useSocketCtx } from '../context/SocketContext.jsx';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const { unread, notifications, markAllRead } = useSocketCtx();
  const [sidebar, setSidebar] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();

  const links =
    user?.role === 'admin'
      ? [{ to: '/admin', label: 'Overview', icon: LayoutDashboard }, { to: '/security', label: 'Incidents', icon: Siren }, { to: '/map', label: 'Live Map', icon: MapIcon }, { to: '/profile', label: 'Profile', icon: User }]
      : user?.role === 'security'
      ? [{ to: '/security', label: 'Queue', icon: Siren }, { to: '/map', label: 'Live Map', icon: MapIcon }, { to: '/profile', label: 'Profile', icon: User }]
      : [{ to: '/dashboard', label: 'Home', icon: LayoutDashboard }, { to: '/report', label: 'Report', icon: Siren }, { to: '/map', label: 'Map', icon: MapIcon }, { to: '/profile', label: 'Profile', icon: User }];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Topbar */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/70 bg-white/80 shadow-card backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.9 }} className="rounded-xl border border-slate-200 p-2 dark:border-slate-700 lg:hidden" onClick={() => setSidebar(!sidebar)} aria-label="Toggle sidebar">
              {sidebar ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
            <Link to="/" className="group flex items-center gap-2">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-cyan-500 text-white shadow-pop transition-transform group-hover:rotate-3 group-hover:scale-105">
                <ShieldCheck size={19} />
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-ping rounded-full bg-red-500" />
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-white bg-red-500" />
              </span>
              <span className="font-display font-extrabold">Campus<span className="bg-gradient-to-r from-navy-600 to-cyan-500 bg-clip-text text-transparent">Safe</span></span>
            </Link>
            <span className="hidden rounded-full bg-gradient-to-r from-navy-600 to-cyan-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white sm:inline">{user?.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.9 }} onClick={toggle} className="rounded-xl border border-slate-200 p-2 transition hover:-translate-y-0.5 dark:border-slate-700" aria-label="Theme">
              <motion.span key={dark ? 'sun' : 'moon'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>{dark ? <Sun size={18} /> : <Moon size={18} />}</motion.span>
            </motion.button>
            <div className="relative">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNotif(!showNotif)} className="relative rounded-xl border border-slate-200 p-2 transition hover:-translate-y-0.5 dark:border-slate-700" aria-label="Notifications">
                <motion.span animate={unread > 0 ? { rotate: [0, 15, -15, 0] } : {}} transition={{ duration: 0.5 }}>
                  <Bell size={18} />
                </motion.span>
                <AnimatePresence>
                  {unread > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-1 text-[11px] font-bold text-white shadow-glowred">{unread}</motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <AnimatePresence>
                {showNotif && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      className="glass-strong absolute right-0 z-50 mt-2 w-80 rounded-2xl p-3">
                      <div className="mb-2 flex items-center justify-between px-1">
                        <span className="text-sm font-bold">Notifications {unread > 0 && <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] text-red-700">{unread} new</span>}</span>
                        <button onClick={markAllRead} className="text-xs font-bold text-navy-600 hover:underline dark:text-cyan-300">Mark all read</button>
                      </div>
                      <div className="max-h-72 space-y-2 overflow-auto">
                        {notifications.length === 0 && <p className="p-4 text-center text-sm text-slate-400">No notifications yet.</p>}
                        {notifications.map((n, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.05, 0.3) }} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                            <p className="font-semibold">{n.title || 'Update'}</p>
                            <p className="text-slate-500">{n.message || ''}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => { logout(); nav('/'); }} className="rounded-xl border border-slate-200 p-2 transition hover:-translate-y-0.5 hover:text-red-600 dark:border-slate-700" aria-label="Logout"><LogOut size={18} /></motion.button>
          </div>
        </div>
        {/* live status strip */}
        <div className="overflow-hidden border-t border-slate-100 bg-gradient-to-r from-navy-950 via-navy-800 to-navy-950 py-1 dark:border-slate-800">
          <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} className="flex w-max gap-10 whitespace-nowrap text-[11px] font-semibold text-white/80">
            {[0, 1].map(k => <span key={k}>● SYSTEM OPERATIONAL &nbsp;&nbsp; ● AVG RESPONSE 8 MIN (DEMO) &nbsp;&nbsp; ● 24/7 SECURITY DESK ACTIVE &nbsp;&nbsp; ● IN EMERGENCY CALL 112 FIRST &nbsp;&nbsp;</span>)}
          </motion.div>
        </div>
      </header>

      <div className="flex pt-[101px]">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebar || typeof window !== 'undefined') && (
            <motion.aside
              initial={false}
              animate={{ x: 0 }}
              className={`fixed z-30 h-[calc(100vh-101px)] w-64 shrink-0 border-r border-slate-200/70 bg-white/80 p-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 ${sidebar ? 'block' : 'hidden'} lg:block lg:sticky lg:top-[101px]`}
            >
              <motion.div whileHover={{ scale: 1.01 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-700 via-navy-800 to-slate-900 p-4 text-white shadow-pop">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />
                <div className="relative flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 font-display text-lg font-extrabold backdrop-blur">{user?.name?.[0]?.toUpperCase() || 'C'}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{user?.name}</p>
                    <p className="truncate text-xs text-white/60">{user?.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-green-400/20 px-2 py-0.5 text-[10px] font-bold text-green-300">● ACTIVE</span>
                  </div>
                </div>
              </motion.div>
              <nav className="mt-3 space-y-1.5">
                {links.map(l => {
                  const active = loc.pathname === l.to;
                  return (
                    <Link key={l.to} to={l.to} onClick={() => setSidebar(false)}
                      className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? 'bg-gradient-to-r from-navy-600 to-cyan-500 text-white shadow-pop' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                      <l.icon size={18} className={active ? '' : 'text-slate-400 group-hover:text-navy-600 dark:group-hover:text-cyan-300'} /> {l.label}
                      {active && <motion.span layoutId="nav-glow" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-600 to-cyan-500" />}
                    </Link>
                  );
                })}
                {(user?.role === 'student' || user?.role === 'faculty') && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to="/report" className="btn-danger glow-btn mt-3 flex items-center justify-center gap-2 !py-3.5 font-bold">
                      <Siren size={18} /> Report Emergency
                    </Link>
                  </motion.div>
                )}
              </nav>
              <motion.p whileHover={{ scale: 1.01 }} className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                <TriangleAlert size={15} className="mt-0.5 shrink-0" /> In life-threatening danger call local emergency services first. This app supplements official response.
              </motion.p>
            </motion.aside>
          )}
        </AnimatePresence>
        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
