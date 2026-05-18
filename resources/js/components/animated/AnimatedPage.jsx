import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition, staggerContainer } from '@/lib/animations';

/**
 * Animated Page Wrapper
 * Provides smooth page transitions and staggered content reveal
 */
export function AnimatedPage({ children, className }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit="exit"
      variants={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer}
      transition={{ delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInWhenVisible({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
