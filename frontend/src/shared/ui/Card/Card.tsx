import { type ReactNode, type MouseEvent } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

/**
 * Componente Card reutilizável
 * Responsabilidade: Fornecer container visual consistente
 * Open/Closed Principle: Aberto para extensão via props, fechado para modificação
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
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
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim();

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};
