import { useEffect } from 'react';
import { Icon } from '../Icon/Icon';
import type { Toast as ToastType } from '../../../contexts/ToastContext';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const variantConfig = {
    success: {
      icon: 'check-circle-fill',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
    },
    error: {
      icon: 'x-circle-fill',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-800',
    },
    warning: {
      icon: 'exclamation-triangle-fill',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-800',
    },
    info: {
      icon: 'info-circle-fill',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800',
    },
  };

  const config = variantConfig[toast.type];

  return (
    <div
      className={`
        ${config.bgColor} ${config.borderColor}
        border rounded-lg p-4 shadow-military-md
        flex items-center space-x-3
        min-w-75 max-w-md
        animate-slide-in
      `.trim()}
    >
      <Icon name={config.icon} className={config.iconColor} size="lg" />
      <p className={`${config.textColor} flex-1 text-sm font-medium`}>
        {toast.message}
      </p>
      <button
        onClick={() => onClose(toast.id)}
        className={`${config.iconColor} hover:opacity-70 transition-opacity`}
        aria-label="Fechar notificação"
      >
        <Icon name="x" />
      </button>
    </div>
  );
};
