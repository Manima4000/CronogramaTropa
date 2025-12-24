import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const classes = `
    bg-white rounded-lg border border-military-light-gray shadow-military-sm
    ${paddingClasses[padding]}
    ${hover ? 'hover:shadow-military-md transition-shadow duration-200' : ''}
    ${className}
  `.trim();

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
