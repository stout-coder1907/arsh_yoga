import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, role, roles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-muted">
        <span className="font-serif text-2xl text-forest">Arsh Yoga</span>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  // support either singular `role` or plural `roles` array
  if (role && user?.role !== role && !(role === "any" )) {
    return <Navigate to="/" replace />;
  }
  if (roles && Array.isArray(roles) && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function AdminRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
