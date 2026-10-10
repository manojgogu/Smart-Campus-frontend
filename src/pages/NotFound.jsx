import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { HeroBackdrop } from '../components/ui.jsx';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden p-6 text-center">
      <HeroBackdrop />
      <motion.span animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }} transition={{ duration: 4, repeat: Infinity }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-navy-600 to-cyan-500 text-white shadow-pop">
        <ShieldAlert size={40} />
      </motion.span>
      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="font-display text-7xl font-extrabold tracking-tight">404</motion.h1>
      <p className="max-w-sm text-slate-500">This page took a wrong turn across campus. Let's get you back to safety.</p>
      <div className="flex gap-2">
        <Link to="/" className="btn-primary"><Home size={17} /> Back home</Link>
        <button onClick={() => window.history.back()} className="btn-ghost"><ArrowLeft size={17} /> Go back</button>
      </div>
    </div>
  );
}
