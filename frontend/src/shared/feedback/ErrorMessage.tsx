import { Button } from '../ui/Button/Button';
import { Icon } from '../ui/Icon/Icon';
import type { ApiErrorDTO } from '../../dtos/common/ApiErrorDTO';

interface ErrorMessageProps {
  error: ApiErrorDTO | string;
  onRetry?: () => void;
  title?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  title = 'Ocorreu um erro',
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center mb-4">
          <Icon name="exclamation-triangle" className="text-red-600 mr-2" size="lg" />
          <h3 className="text-lg font-semibold text-red-900">{title}</h3>
        </div>
        <p className="text-red-700 mb-4">{errorMessage}</p>
        {onRetry && (
          <Button
            variant="danger"
            icon="arrow-clockwise"
            onClick={onRetry}
            fullWidth
          >
            Tentar Novamente
          </Button>
        )}
      </div>
    </div>
  );
};
