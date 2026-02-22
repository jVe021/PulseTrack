import type { Variants, Transition } from 'framer-motion';

export const springTransition: Transition = {
    type: 'spring',
    stiffness: 100,
    damping: 30,
    mass: 1,
};

export const easeOutTransition: Transition = {
    duration: 0.4,
    ease: 'easeOut',
};

export const fastTransition: Transition = {
    duration: 0.15,
    ease: 'easeInOut',
};

/** Page mount: fadeIn + slideUp(20px) over 400ms. */
export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: easeOutTransition },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

/** Parent container: staggers children by 50ms. */
export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

/** Card mount: fadeIn + slideUp(10px) over 300ms. */
export const cardVariant: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

/** Card hover: lift by 2px. */
export const hoverLift: Variants = {
    rest: { y: 0 },
    hover: { y: -2, transition: fastTransition },
};

/** Button press: slight scale down. */
export const pressScale: Variants = {
    rest: { scale: 1 },
    tap: { scale: 0.98, transition: fastTransition },
};

/** Slide down from top (for banners). */
export const slideDown: Variants = {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { y: '-100%', opacity: 0, transition: { duration: 0.2 } },
};

/** Slide in from right (for toasts). */
export const slideInRight: Variants = {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } },
};

/** Simple fade in/out. */
export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

/** Check if user prefers reduced motion. */
export function shouldReduceMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Returns the variant or an empty object if user prefers reduced motion.
 * Use: `<motion.div {...motionSafe(fadeInUp)}>`
 */
export function motionSafe(variants: Variants): {
    variants: Variants;
    initial: string;
    animate: string;
    exit?: string;
} | Record<string, never> {
    if (shouldReduceMotion()) return {};
    return {
        variants,
        initial: 'initial',
        animate: 'animate',
        exit: 'exit',
    };
}
