import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingOverlay } from '../../shared/feedback/LoadingOverlay';

export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingOverlay message="Carregando..." />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
