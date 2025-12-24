interface IconProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return <i className={`bi bi-${name} ${sizeClasses[size]} ${className}`.trim()} />;
};
