import type { ButtonProps } from './Button.types';
import { Icon } from '../Icon/Icon';
import { Spinner } from '../Spinner/Spinner';

// Open/Closed Principle: Open for extension via props, closed for modification
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded transition-all duration-200 inline-flex items-center justify-center';

  const variantClasses = {
    primary: 'bg-[#4a5d23] hover:bg-[#3a4a1a] !text-white shadow-md hover:shadow-lg font-bold',
    secondary: 'bg-military-khaki hover:bg-military-khaki-dark text-military-dark shadow-sm',
    danger: 'bg-red-600 hover:bg-red-700 !text-white shadow-md',
    ghost: 'bg-transparent hover:bg-military-green/10 text-military-green border border-military-green',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" className="mr-2" />}
      {!loading && icon && iconPosition === 'left' && (
        <Icon name={icon} className="mr-2" />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <Icon name={icon} className="ml-2" />
      )}
    </button>
  );
};
