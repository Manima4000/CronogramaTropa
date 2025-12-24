import { Modal } from './Modal';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false,
}) => {
  const variantConfig = {
    danger: {
      icon: 'exclamation-triangle',
      iconColor: 'text-red-600',
      buttonVariant: 'danger' as const,
    },
    warning: {
      icon: 'exclamation-circle',
      iconColor: 'text-yellow-600',
      buttonVariant: 'secondary' as const,
    },
    info: {
      icon: 'info-circle',
      iconColor: 'text-blue-600',
      buttonVariant: 'primary' as const,
    },
  };

  const config = variantConfig[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Icon name={config.icon} size="lg" className={config.iconColor} />
          <p className="text-military-gray flex-1">{message}</p>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
