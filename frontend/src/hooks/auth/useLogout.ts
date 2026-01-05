import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ROUTES } from '../../utils/constants/routes';

interface UseLogoutReturn {
  isLoading: boolean;
  logout: () => Promise<void>;
}

export const useLogout = (): UseLogoutReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { logout: authLogout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const logout = async () => {
    setIsLoading(true);

    try {
      await authLogout();
      addToast({ message: 'Logout realizado com sucesso!', type: 'success' });
      navigate(ROUTES.login);
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao fazer logout';
      addToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    logout,
  };
};
