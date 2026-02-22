'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/features/auth/useAuth';
import { useAppSelector } from '@/store/hooks';
import { selectConnectionStatus } from '@/features/health/healthSlice';

interface TopbarProps {
    onMenuClick: () => void;
    pageTitle?: string;
}

export function Topbar({ onMenuClick, pageTitle = 'Dashboard' }: TopbarProps) {
    const { user, logout } = useAuth();
    const connectionStatus = useAppSelector(selectConnectionStatus);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    const handleClick = useCallback((e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setDropdownOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [handleClick]);

    const statusColors: Record<string, string> = {
        connected: 'bg-success',
        connecting: 'bg-warning animate-pulse',
        disconnected: 'bg-danger',
        error: 'bg-danger',
    };

    const statusLabels: Record<string, string> = {
        connected: 'Connected',
        connecting: 'Connecting…',
        disconnected: 'Disconnected',
        error: 'Error',
    };

    return (
        <header className="flex h-16 items-center gap-4 border-b border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] px-4 backdrop-blur-xl lg:px-6">
            {/* Mobile menu button */}
            <button
                onClick={onMenuClick}
                className="rounded-lg p-2 text-text-muted hover:bg-[var(--color-glass-bg)] hover:text-text-primary transition-colors lg:hidden focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] outline-none"
                aria-label="Open menu"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="3" y1="5" x2="17" y2="5" />
                    <line x1="3" y1="10" x2="17" y2="10" />
                    <line x1="3" y1="15" x2="17" y2="15" />
                </svg>
            </button>

            {/* Page title */}
            <h1 className="text-lg font-semibold text-text-primary">{pageTitle}</h1>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search bar */}
            <div className="hidden md:flex items-center">
                <div className="relative">
                    <svg
                        width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                    >
                        <circle cx="7" cy="7" r="5" />
                        <line x1="11" y1="11" x2="14" y2="14" />
                    </svg>
                    <input
                        type="search"
                        placeholder="Search health data..."
                        aria-label="Search health data"
                        className="h-9 w-48 rounded-lg border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all focus:w-64 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg-primary)]"
                    />
                </div>
            </div>

            {/* Notification bell */}
            <button
                className="relative rounded-lg p-2 text-text-muted hover:bg-[var(--color-glass-bg)] hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] outline-none"
                aria-label="View notifications, 1 unread"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13.5 6.5C13.5 4 11.5 2 9 2S4.5 4 4.5 6.5C4.5 11 2.5 12.5 2.5 12.5h13S13.5 11 13.5 6.5" />
                    <path d="M7.5 15.5a1.5 1.5 0 003 0" />
                </svg>
                {/* Badge */}
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-danger ring-2 ring-[var(--color-glass-bg)]" />
            </button>

            {/* Connection status */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-muted">
                <span className={`h-2 w-2 rounded-full ${statusColors[connectionStatus]}`} />
                <span className="hidden lg:inline">{statusLabels[connectionStatus]}</span>
            </div>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="menu"
                    className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-[var(--color-glass-bg)] transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] outline-none"
                >
                    {/* Avatar */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white">
                        {user?.name?.charAt(0) ?? 'U'}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-text-primary max-w-[100px] truncate">
                        {user?.name ?? 'User'}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        className={`hidden lg:block text-text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    >
                        <polyline points="3,4.5 6,7.5 9,4.5" />
                    </svg>
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                    {dropdownOpen && (
                        <motion.div
                            className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-bg-secondary)] p-1.5 shadow-xl backdrop-blur-xl"
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                        >
                            <div className="px-3 py-2 mb-1">
                                <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                                <p className="text-xs text-text-muted truncate">{user?.email}</p>
                            </div>
                            <div className="h-px bg-[var(--color-glass-border)] mx-1 mb-1" />
                            <button
                                onClick={() => {
                                    setDropdownOpen(false);
                                    logout();
                                }}
                                role="menuitem"
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-inset outline-none"
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 14H3.5A1.5 1.5 0 012 12.5v-9A1.5 1.5 0 013.5 2H6" />
                                    <polyline points="10,11 14,8 10,5" />
                                    <line x1="14" y1="8" x2="6" y2="8" />
                                </svg>
                                Sign Out
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
