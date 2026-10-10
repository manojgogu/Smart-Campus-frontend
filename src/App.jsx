import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PublicLayout from './layouts/PublicLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import ReportEmergency from './pages/ReportEmergency.jsx';
import TrackIncident from './pages/TrackIncident.jsx';
import SecurityDashboard from './pages/SecurityDashboard.jsx';
import IncidentDetails from './pages/IncidentDetails.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import MapView from './pages/MapView.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';
import { useAuth } from './context/AuthContext.jsx';

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'security') return <Navigate to="/security" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/home" element={<RoleRedirect />} />
            <Route path="/dashboard" element={<ProtectedRoute roles={['student', 'faculty']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute roles={['student', 'faculty']}><ReportEmergency /></ProtectedRoute>} />
            <Route path="/track/:id" element={<TrackIncident />} />
            <Route path="/security" element={<ProtectedRoute roles={['security', 'admin']}><SecurityDashboard /></ProtectedRoute>} />
            <Route path="/incidents/:id" element={<IncidentDetails />} />
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/map" element={<MapView />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
