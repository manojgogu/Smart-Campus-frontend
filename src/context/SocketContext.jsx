import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const SocketContext = createContext({ socket: null, notifications: [], unread: 0, markAllRead: () => {} });
export const useSocketCtx = () => useContext(SocketContext);

// Spring Boot serves notifications over the existing REST API; poll it for live updates.
export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) { setNotifications([]); return; }
    let alive = true;
    const refresh = async () => {
      try {
        const { data } = await api.get('/notifications?limit=20');
        if (alive) setNotifications(data.notifications || []);
      } catch {}
    };
    refresh();
    const timer = setInterval(refresh, 10000);
    return () => { alive = false; clearInterval(timer); };
  }, [user]);

  const markAllRead = async () => {
    try { await api.patch('/notifications/read'); } catch {}
    setNotifications(previous => previous.map(item => ({ ...item, read: true })));
  };
  const unread = notifications.filter(item => !item.read).length;
  return <SocketContext.Provider value={{ socket: null, notifications, unread, markAllRead, setNotifications }}>{children}</SocketContext.Provider>;
}
