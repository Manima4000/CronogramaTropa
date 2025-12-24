import { Icon } from '../ui/Icon/Icon';
import { type ReactNode } from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-military-khaki-light p-6">
            <Icon name={icon} className="text-military-dark" size="lg" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-military-dark mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-military-gray mb-6">
            {description}
          </p>
        )}
        {action && (
          <div className="flex justify-center">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};
