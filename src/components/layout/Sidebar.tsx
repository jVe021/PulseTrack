'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    section: 'main' | 'bottom';
}

const navItems: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        section: 'main',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="7" height="7" rx="1.5" />
                <rect x="11" y="2" width="7" height="7" rx="1.5" />
                <rect x="2" y="11" width="7" height="7" rx="1.5" />
                <rect x="11" y="11" width="7" height="7" rx="1.5" />
            </svg>
        ),
    },
    {
        label: 'Analytics',
        href: '/dashboard/analytics',
        section: 'main',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2,15 6,10 10,12 14,6 18,8" />
                <polyline points="14,6 18,6 18,10" />
            </svg>
        ),
    },
    {
        label: 'History',
        href: '/dashboard/history',
        section: 'main',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10" cy="10" r="8" />
                <polyline points="10,5 10,10 14,12" />
            </svg>
        ),
    },
    {
        label: 'Settings',
        href: '/dashboard/settings',
        section: 'bottom',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10" cy="10" r="3" />
                <path d="M10 1v2M10 17v2M3.5 3.5l1.4 1.4M15.1 15.1l1.4 1.4M1 10h2M17 10h2M3.5 16.5l1.4-1.4M15.1 4.9l1.4-1.4" />
            </svg>
        ),
    },
];

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen: boolean;
    onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
    const pathname = usePathname();

    const mainItems = navItems.filter((i) => i.section === 'main');
    const bottomItems = navItems.filter((i) => i.section === 'bottom');

    const sidebarContent = (
        <div className="flex h-full flex-col">
            {/* Brand */}
            <div className="flex h-16 items-center gap-3 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" className="shrink-0 text-brand-500">
                    <g fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.91">
                        <path d="M14.86,13h-.95l-1-1.91-1.9,3.82L9.14,10.11,7.23,13H3.41l-.33-.33A5.4,5.4,0,1,1,10.72,5L12,6.3,13.28,5a5.4,5.4,0,1,1,7.64,7.63l-.33.33L12,21.57,6.07,15.64" />
                        <line x1="15.82" y1="12.98" x2="17.73" y2="12.98" />
                    </g>
                </svg>
                {!collapsed && (
                    <motion.span
                        className="text-lg font-bold text-gradient whitespace-nowrap"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                    >
                        PulseTrack
                    </motion.span>
                )}
            </div>

            {/* Divider */}
            <div className="mx-4 h-px bg-[var(--color-glass-border)]" />

            {/* Main nav */}
            <nav className="mt-2 flex-1 space-y-1 px-3">
                {mainItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onMobileClose}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset ${active
                                ? 'bg-[var(--color-glass-bg-active)] text-brand-500'
                                : 'text-text-secondary hover:bg-[var(--color-glass-bg)] hover:text-text-primary'
                                }`}
                        >
                            <span className={`shrink-0 ${active ? 'text-brand-500' : 'text-text-muted group-hover:text-text-secondary'}`}>
                                {item.icon}
                            </span>
                            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Divider */}
            <div className="mx-4 h-px bg-[var(--color-glass-border)]" />

            {/* Bottom nav */}
            <nav className="mb-2 mt-2 space-y-1 px-3">
                {bottomItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onMobileClose}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset ${active
                                ? 'bg-[var(--color-glass-bg-active)] text-brand-500'
                                : 'text-text-secondary hover:bg-[var(--color-glass-bg)] hover:text-text-primary'
                                }`}
                        >
                            <span className={`shrink-0 ${active ? 'text-brand-500' : 'text-text-muted group-hover:text-text-secondary'}`}>
                                {item.icon}
                            </span>
                            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside
                className={`relative z-999 hidden lg:flex flex-col shrink-0 border-r border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] backdrop-blur-xl transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[240px]'}`}
            >
                {/* Collapse toggle — hidden on mobile */}
                <button
                    onClick={onToggle}
                    className={`${collapsed ? '' : 'expand'} toggle-collapse flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] p-0 text-text-muted hover:bg-[var(--color-glass-bg-hover)] hover:text-text-primary shadow-md transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-500`}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        className={`transition-transform ${collapsed ? '' : 'rotate-180'}`}
                    >
                        <polyline points="6,3 12,9 6,15" />
                    </svg>
                </button>

                {sidebarContent}
            </aside>

            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onMobileClose}
                        />
                        <motion.aside
                            className="fixed left-0 top-0 z-50 flex h-full w-[260px] flex-col border-r border-[var(--color-glass-border)] bg-[var(--color-bg-secondary)] backdrop-blur-xl lg:hidden"
                            initial={{ x: -260 }}
                            animate={{ x: 0 }}
                            exit={{ x: -260 }}
                            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
