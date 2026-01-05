import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants/routes';
import { Icon } from '../ui/Icon/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { useLogout } from '../../hooks/auth/useLogout';
import { Button } from '../ui/Button/Button';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { logout, isLoading } = useLogout();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: ROUTES.home, label: 'Início', icon: 'house' },
    { path: ROUTES.schedules.list, label: 'Cronogramas', icon: 'calendar-check' },
    { path: ROUTES.schedules.create, label: 'Criar', icon: 'plus-circle' },
  ];

  return (
    <header className="bg-military-green shadow-military-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to={ROUTES.home}
            className="flex items-center space-x-2 text-white font-bold text-xl font-military"
          >
            <Icon name="shield-fill-check" size="lg" />
            <span>CronogramaTropa</span>
          </Link>

          <div className="flex items-center space-x-6">
            <nav className="flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded transition-colors duration-200
                    ${
                      isActive(link.path)
                        ? 'bg-military-khaki-light text-military-green-dark font-bold'
                        : 'text-military-khaki-light hover:bg-military-green-dark hover:text-white'
                    }
                  `.trim()}
                >
                  <Icon name={link.icon} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </nav>

            {user && (
              <div className="flex items-center space-x-3 pl-6 border-l border-military-khaki-dark">
                <span className="text-military-khaki-light text-sm">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  onClick={logout}
                  disabled={isLoading}
                  className="text-military-khaki-light hover:text-white"
                >
                  <Icon name="box-arrow-right" />
                  <span className="ml-2">Sair</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
