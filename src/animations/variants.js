export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } })
};
export const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
export const staggerFast = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
export const pageTransition = {
  initial: { opacity: 0, y: 16, scale: 0.995 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.22 } }
};
export const cardPop = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  show: (i = 0) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, delay: Math.min(i * 0.06, 0.5), ease: [0.22, 1, 0.36, 1] } })
};
export const modalPop = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } },
  exit: { opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.18 } }
};
export const slideInRight = {
  hidden: { opacity: 0, x: 48 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};
export const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
