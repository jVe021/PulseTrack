'use client';

import { useState, useCallback } from 'react';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { OfflineBanner } from '@/components/layout/OfflineBanner';
import { useHealthStream } from '@/features/health/useHealthStream';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Start the mock WebSocket data stream
    useHealthStream();

    const handleSidebarToggle = useCallback(() => {
        setSidebarCollapsed(prev => !prev);
    }, []);

    const handleMobileClose = useCallback(() => {
        setMobileOpen(false);
    }, []);

    const handleMobileOpen = useCallback(() => {
        setMobileOpen(true);
    }, []);

    return (
        <AuthGuard>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={handleSidebarToggle}
                    mobileOpen={mobileOpen}
                    onMobileClose={handleMobileClose}
                />

                {/* Main content area */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Skip to Content Link */}
                    <a
                        href="#main-content"
                        className="sr-only focus:not-sr-only focus:absolute focus:z-[var(--z-toast)] focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]"
                    >
                        Skip to main content
                    </a>

                    <OfflineBanner />
                    <Topbar
                        onMenuClick={handleMobileOpen}
                    />

                    {/* Scrollable content */}
                    <main id="main-content" className="flex-1 overflow-y-auto p-4 lg:p-6" tabIndex={-1}>
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
