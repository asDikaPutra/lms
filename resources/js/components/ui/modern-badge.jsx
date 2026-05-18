import { cn } from '@/lib/utils';

/**
 * Modern Badge Component
 * Variants: default, primary, success, warning, danger
 */
export function ModernBadge({ 
  children, 
  variant = 'default',
  size = 'md',
  className,
  ...props 
}) {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        'transition-all duration-150',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function ModernBadgeDot({ variant = 'default', className }) {
  const colors = {
    default: 'bg-neutral-500',
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  };

  return (
    <span
      className={cn(
        'inline-block w-1.5 h-1.5 rounded-full',
        colors[variant],
        className
      )}
    />
  );
}
