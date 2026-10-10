import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);
let id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, type = 'info') => {
    const t = { id: ++id, message, type };
    setToasts(prev => [...prev, t]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 4000);
  }, []);
  const toast = { success: m => push(m, 'success'), error: m => push(m, 'error'), info: m => push(m, 'info') };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0 }}
              className="glass flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg">
              {t.type === 'success' ? <CheckCircle2 className="text-green-500" size={20} /> :
               t.type === 'error' ? <AlertTriangle className="text-red-500" size={20} /> :
               <Info className="text-navy-500" size={20} />}
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{t.message}</span>
              <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}><X size={16} className="text-slate-400" /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
