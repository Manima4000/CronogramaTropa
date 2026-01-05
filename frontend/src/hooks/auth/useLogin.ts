import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import type { LoginRequestDTO } from '../../dtos/auth/LoginDTO';

interface UseLoginReturn {
  isLoading: boolean;
  login: (credentials: LoginRequestDTO) => Promise<void>;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const login = async (credentials: LoginRequestDTO) => {
    setIsLoading(true);

    try {
      await authLogin(credentials);
      addToast({ message: 'Login realizado com sucesso!', type: 'success' });
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao fazer login. Verifique suas credenciais.';
      addToast({ message: errorMessage, type: 'error' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    login,
  };
};
