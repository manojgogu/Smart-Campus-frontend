import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function PublicLayout() {
  return (
    <div className="relative min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
