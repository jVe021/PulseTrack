'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    setCredentials,
    logout as logoutAction,
    selectIsAuthenticated,
    selectUser,
} from '@/features/auth/authSlice';
import { clearHealthData } from '@/features/health/healthSlice';
import { useLoginMutation } from '@/features/auth/authApi';
import { setTokens, clearTokens } from '@/lib/tokens';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();

    const login = useCallback(
        async (email: string, password: string) => {
            const result = await loginMutation({ email, password }).unwrap();
            setTokens({
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            });
            dispatch(
                setCredentials({
                    user: result.user,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                })
            );
            router.push('/dashboard');
        },
        [loginMutation, dispatch, router]
    );

    const logout = useCallback(() => {
        clearTokens();
        dispatch(logoutAction());
        dispatch(clearHealthData());
        router.push('/login');
    }, [dispatch, router]);

    return { login, logout, isAuthenticated, user, isLoggingIn };
}
