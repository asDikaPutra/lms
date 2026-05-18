import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Loading States with fluid animations
 */
export function LoadingSpinner({ size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={cn(
        'rounded-full border-blue-600 border-t-transparent',
        sizes[size],
        className
      )}
    />
  );
}

export function LoadingDots({ className }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -8, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
          className="w-2 h-2 rounded-full bg-blue-600"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'rounded-xl bg-neutral-100 overflow-hidden',
        className
      )}
    >
      <motion.div
        animate={{
          backgroundPosition: ['200% 0', '-200% 0'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="h-full w-full"
        style={{
          backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
          backgroundSize: '200% 100%',
        }}
      />
    </motion.div>
  );
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={cn(
            'h-4 bg-neutral-200 rounded',
            i === lines - 1 && 'w-3/4'
          )}
        >
          <motion.div
            animate={{
              backgroundPosition: ['200% 0', '-200% 0'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="h-full w-full rounded"
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
              backgroundSize: '200% 100%',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
