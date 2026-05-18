/**
 * Animation Utilities for Academic Fluidity Design System
 * Smooth, organic animations that feel natural and purposeful
 */

// Easing functions - organic, not robotic
export const easings = {
  // Smooth entrance
  smooth: [0.25, 0.1, 0.25, 1],
  // Bouncy but subtle
  bounce: [0.68, -0.55, 0.265, 1.55],
  // Natural deceleration
  decel: [0.16, 1, 0.3, 1],
  // Gentle acceleration
  accel: [0.7, 0, 0.84, 0],
  // Fluid both ways
  fluid: [0.45, 0, 0.55, 1],
};

// Stagger children animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Fade up animation - cards, content blocks
export const fadeUp = {
  hidden: { 
    opacity: 0, 
    y: 24,
  },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
    },
  },
};

// Scale fade - badges, small elements
export const scaleFade = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
  },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easings.bounce,
    },
  },
};

// Slide in from side - modals, sidebars
export const slideIn = (direction = 'right') => ({
  hidden: { 
    opacity: 0, 
    x: direction === 'right' ? 100 : -100,
  },
  show: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      ease: easings.fluid,
    },
  },
});

// Expand - collapsible sections
export const expand = {
  hidden: { 
    opacity: 0,
    height: 0,
  },
  show: { 
    opacity: 1,
    height: 'auto',
    transition: {
      height: {
        duration: 0.4,
        ease: easings.fluid,
      },
      opacity: {
        duration: 0.3,
        delay: 0.1,
      },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: {
        duration: 0.3,
        ease: easings.fluid,
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
};

// Hover lift - interactive cards
export const hoverLift = {
  rest: { 
    y: 0,
    scale: 1,
  },
  hover: { 
    y: -4,
    scale: 1.01,
    transition: {
      duration: 0.2,
      ease: easings.decel,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

// Shimmer loading effect
export const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

// Pulse - notification badges
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      ease: easings.fluid,
      repeat: Infinity,
    },
  },
};

// Page transition
export const pageTransition = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  show: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: easings.accel,
    },
  },
};

// Modal backdrop
export const modalBackdrop = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      delay: 0.1,
    },
  },
};

// Modal content
export const modalContent = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  show: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easings.bounce,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};
