'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideDown } from '@/utils/animations';

export function OfflineBanner() {
    const [isOffline, setIsOffline] = useState(
        typeof window !== 'undefined' ? !navigator.onLine : false
    );

    useEffect(() => {

        const goOffline = () => setIsOffline(true);
        const goOnline = () => setIsOffline(false);

        window.addEventListener('offline', goOffline);
        window.addEventListener('online', goOnline);

        return () => {
            window.removeEventListener('offline', goOffline);
            window.removeEventListener('online', goOnline);
        };
    }, []);

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    className="flex w-full items-center justify-center gap-2 bg-[var(--color-bg-secondary)] px-4 py-2 text-sm font-medium text-warning shadow-md border-b border-[var(--color-glass-border)] z-[var(--z-banner)] relative"
                    variants={slideDown}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    role="alert"
                    aria-live="assertive"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 1l14 14M11.5 5.5A7.5 7.5 0 008 4c-1.5 0-2.8.4-4 1M14.5 8.5a11.9 11.9 0 00-2-1.5M4.5 11a4.5 4.5 0 01-1-2.5M2 14v1h1M14 2V1h-1" strokeLinecap="round" />
                    </svg>
                    You are currently offline. Data is being saved locally.
                </motion.div>
            )}
        </AnimatePresence>
    );
}
