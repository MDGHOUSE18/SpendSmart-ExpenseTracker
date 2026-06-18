import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, emailConfirmed } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // If no user, redirect to landing page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user exists but email not confirmed, redirect to login with state
  if (!emailConfirmed) {
    return <Navigate to="/login" replace state={{ emailNotConfirmed: true, email: user.email }} />;
  }

  return <>{children}</>;
}
