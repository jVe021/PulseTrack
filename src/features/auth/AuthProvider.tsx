'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/features/auth/authSlice';
import { getTokens } from '@/lib/tokens';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const [isInitializing, setIsInitializing] = useState(true);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            const tokens = getTokens();

            if (tokens) {
                dispatch(
                    setCredentials({
                        user: {
                            id: 'usr_001',
                            name: 'Demo User',
                            email: 'demo@example.com',
                            avatar: 'https://i.pravatar.cc/150?u=demo@example.com'
                        },
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                    })
                );
            }

            // To avoid synchronous setState in effect, we use setTimeout
            setTimeout(() => {
                setIsInitializing(false);
            }, 0);
        }
    }, [dispatch]);

    if (isInitializing) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="skeleton h-8 w-32" />
            </div>
        );
    }

    return <>{children}</>;
}
