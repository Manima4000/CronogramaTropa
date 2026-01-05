import { useLogin } from '../../hooks/auth/useLogin';
import { LoginForm } from '../../components/auth/LoginForm';
import { LoginHeader } from '../../components/auth/LoginHeader';
import { Card } from '../../shared/ui/Card/Card';

export const LoginPage = () => {
  const { isLoading, login } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-military-green-dark">
      <div className="w-full max-w-md px-6">
        <Card padding="lg">
          <LoginHeader />
          <LoginForm onSubmit={login} isLoading={isLoading} />
        </Card>

        <p className="text-center text-white mt-6 text-sm">
          Sistema de uso restrito
        </p>
      </div>
    </div>
  );
};
