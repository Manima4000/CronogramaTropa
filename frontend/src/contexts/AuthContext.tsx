import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { LoginRequestDTO } from '../dtos/auth/LoginDTO';
import type { UserDTO } from '../dtos/auth/UserDTO';

interface AuthContextData {
  user: UserDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequestDTO) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // User is not authenticated or token is invalid
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginRequestDTO) => {
    const response = await authService.login(credentials);
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
