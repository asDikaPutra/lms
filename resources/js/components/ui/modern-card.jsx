import { cn } from '@/lib/utils';

/**
 * Modern Card Component with interactive states
 * Features: hover effects, smooth transitions, better shadows
 */
export function ModernCard({ 
  children, 
  className, 
  hover = true,
  interactive = false,
  onClick,
  ...props 
}) {
  return (
    <div
      className={cn(
        // Base styles
        'rounded-xl bg-white border border-neutral-200',
        'transition-all duration-200 ease-out',
        
        // Shadow
        'shadow-sm',
        
        // Hover effects
        hover && 'hover:shadow-md hover:border-neutral-300',
        
        // Interactive (clickable)
        interactive && 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
        
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function ModernCardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-neutral-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ModernCardBody({ children, className, ...props }) {
  return (
    <div
      className={cn('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function ModernCardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-neutral-100 bg-neutral-50/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
