import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Animated sun/moon toggle button.
 * Compact — fits in the top header bar.
 */
export default function ThemeToggle({ className = '' }) {
    const { isDark, toggle } = useTheme();

    return (
        <motion.button
            type="button"
            onClick={toggle}
            aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={`relative flex size-[36px] items-center justify-center overflow-hidden rounded-full border transition-all duration-300 ${
                isDark
                    ? 'border-white/10 bg-white/8 text-amber-300 hover:border-amber-400/40 hover:bg-amber-400/10'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'
            } ${className}`}
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.span
                        key="moon"
                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute"
                    >
                        <Moon className="size-[16px]" strokeWidth={1.75} />
                    </motion.span>
                ) : (
                    <motion.span
                        key="sun"
                        initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute"
                    >
                        <Sun className="size-[16px]" strokeWidth={1.75} />
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
