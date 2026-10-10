import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ requiredRole }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="auth-loading">Loading RoadGuard…</div>;
  if (!user) return <Navigate to="/login" replace />;
  const isAdmin = (user.role === 'admin' || user.role === 'authority') && user.isApproved;
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/citizen" replace />;
  }
  if (requiredRole === 'citizen' && user.role !== 'citizen') return <Navigate to="/admin" replace />;
  return <Outlet />;
}
