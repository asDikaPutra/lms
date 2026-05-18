import { motion } from 'framer-motion';
import { pulse } from '@/lib/animations';
import { cn } from '@/lib/utils';

/**
 * Animated Badge with optional pulse effect
 */
export function AnimatedBadge({ 
  children, 
  className,
  variant = 'default',
  animate: shouldAnimate = false,
  ...props 
}) {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={shouldAnimate ? pulse.animate : { opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: [0.68, -0.55, 0.265, 1.55],
      }}
      className={cn(
        'inline-flex items-center gap-1.5',
        'px-2.5 py-1 rounded-full',
        'text-sm font-medium border',
        'transition-all duration-200',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.span>
  );
}

export function AnimatedDot({ variant = 'default', className }) {
  const colors = {
    default: 'bg-neutral-500',
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  };

  return (
    <motion.span
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={cn(
        'inline-block w-2 h-2 rounded-full',
        colors[variant],
        className
      )}
    />
  );
}
