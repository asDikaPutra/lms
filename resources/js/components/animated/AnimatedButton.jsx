import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Animated Button with micro-interactions
 * Provides tactile feedback
 */
export function AnimatedButton({ 
  children, 
  className,
  variant = 'primary',
  size = 'md',
  ...props 
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md',
    secondary: 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400',
    success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800',
    ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'rounded-lg font-medium',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function AnimatedIconButton({ 
  children, 
  className,
  ...props 
}) {
  return (
    <motion.button
      whileHover={{ 
        scale: 1.1,
        rotate: 5,
      }}
      whileTap={{ scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      className={cn(
        'inline-flex items-center justify-center',
        'w-10 h-10 rounded-lg',
        'text-neutral-600 hover:text-neutral-900',
        'hover:bg-neutral-100',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
