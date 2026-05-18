import { motion } from 'framer-motion';
import { hoverLift } from '@/lib/animations';
import { cn } from '@/lib/utils';

/**
 * Animated Card with fluid hover effects
 * Academic Fluidity design system
 */
export function AnimatedCard({ 
  children, 
  className,
  interactive = false,
  delay = 0,
  ...props 
}) {
  const Component = interactive ? motion.article : motion.div;
  
  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      variants={interactive ? hoverLift : undefined}
      whileHover={interactive ? 'hover' : undefined}
      whileTap={interactive ? 'tap' : undefined}
      className={cn(
        'rounded-xl bg-white border border-neutral-200/60',
        'shadow-sm backdrop-blur-sm',
        'transition-shadow duration-300',
        interactive && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function AnimatedCardGlow({ 
  children, 
  className,
  glowColor = 'blue',
  ...props 
}) {
  const glowColors = {
    blue: 'shadow-blue-500/20 hover:shadow-blue-500/40',
    green: 'shadow-green-500/20 hover:shadow-green-500/40',
    amber: 'shadow-amber-500/20 hover:shadow-amber-500/40',
    purple: 'shadow-purple-500/20 hover:shadow-purple-500/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className={cn(
        'rounded-xl bg-white border border-neutral-200/60',
        'shadow-lg transition-all duration-300',
        glowColors[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
