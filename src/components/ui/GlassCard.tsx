'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cardVariant } from '@/utils/animations';

interface GlassCardProps {
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    animate?: boolean;
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
    role?: string;
    'aria-label'?: string;
    'aria-hidden'?: boolean | 'true' | 'false';
}

const paddingMap = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
} as const;

export const GlassCard = React.memo(function GlassCard({
    hover = false,
    padding = 'md',
    animate = false,
    className = '',
    children,
    onClick,
    role,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
}: GlassCardProps) {
    const baseClasses = `glass-card ${paddingMap[padding]} ${className}`;

    // Collect ARIA props safely
    const ariaProps = {
        ...(role && { role }),
        ...(ariaLabel && { 'aria-label': ariaLabel }),
        ...(ariaHidden !== undefined && { 'aria-hidden': ariaHidden }),
    };

    if (animate || hover) {
        return (
            <motion.div
                className={baseClasses}
                variants={cardVariant}
                initial="initial"
                animate="animate"
                whileHover={hover ? { y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.15)' } : undefined}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={onClick}
                {...ariaProps}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className={baseClasses} onClick={onClick} {...ariaProps}>
            {children}
        </div>
    );
});
