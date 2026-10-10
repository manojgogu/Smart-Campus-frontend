import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const SocketContext = createContext({ socket: null, notifications: [], unread: 0, markAllRead: () => {} });
export const useSocketCtx = () => useContext(SocketContext);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('cs_token');
    if (!user || !token) return;
    const s = io(SOCKET_URL, { auth: { token } });
    setSocket(s);
    s.on('notification', (n) => {
      setNotifications(prev => [n, ...prev].slice(0, 50));
      toast.info(n.title || 'New notification');
    });
    s.on('incident:new', (inc) => {
      if (user.role === 'security' || user.role === 'admin') toast.error(`New ${inc.priority} incident: ${inc.incidentId}`);
    });
    s.on('incident:updated', (inc) => toast.info(`Incident ${inc.incidentId} → ${inc.status}`));
    return () => { s.disconnect(); setSocket(null); };
  }, [user]);

  // Polling fallback: fetch notifications every 30s
  useEffect(() => {
    if (!user) return;
    const t = setInterval(async () => {
      try {
        const token = localStorage.getItem('cs_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications?limit=20`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const j = await res.json();
          setNotifications(prev => {
            if (prev.length === 0 && j.notifications?.length) return j.notifications;
            return prev;
          });
        }
      } catch {}
    }, 30000);
    return () => clearInterval(t);
  }, [user]);

  const unread = notifications.filter(n => !n.read).length;
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return <SocketContext.Provider value={{ socket, notifications, unread, markAllRead, setNotifications }}>{children}</SocketContext.Provider>;
}
