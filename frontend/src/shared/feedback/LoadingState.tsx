import { Spinner } from '../ui/Spinner/Spinner';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Carregando...',
  size = 'lg',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner size={size} />
      <p className="mt-4 text-military-gray">{message}</p>
    </div>
  );
};
