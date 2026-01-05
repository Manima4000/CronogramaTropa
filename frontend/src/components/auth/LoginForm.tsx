import { useState, type FormEvent } from 'react';
import { Button } from '../../shared/ui/Button/Button';
import { Spinner } from '../../shared/ui/Spinner/Spinner';
import type { LoginRequestDTO } from '../../dtos/auth/LoginDTO';

interface LoginFormProps {
  onSubmit: (credentials: LoginRequestDTO) => Promise<void>;
  isLoading: boolean;
}

export const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    await onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-military-green focus:border-transparent outline-none transition"
          placeholder="seu@email.com"
          disabled={isLoading}
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-military-green focus:border-transparent outline-none transition"
          placeholder="••••••••"
          disabled={isLoading}
          autoComplete="current-password"
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" />
            Entrando...
          </span>
        ) : (
          'Entrar'
        )}
      </Button>
    </form>
  );
};
