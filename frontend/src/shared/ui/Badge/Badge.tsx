interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-military-khaki-light text-military-dark',
  };

  const classes = `
    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
    ${variantClasses[variant]}
    ${className}
  `.trim();

  return <span className={classes}>{children}</span>;
};
