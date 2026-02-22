'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    updateVitals,
    setRealtimeHistory,
    setConnectionStatus,
} from '@/features/health/healthSlice';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { MockWebSocket } from '@/services/socket';
import { generateRecentReadings } from '@/utils/generators';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function useHealthStream() {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isOnline = useOnlineStatus();
    const socketRef = useRef<MockWebSocket | null>(null);

    // Initial load of dummy data (only on first mount/auth)
    useEffect(() => {
        if (isAuthenticated) {
            const initialData = generateRecentReadings(60);
            dispatch(setRealtimeHistory(initialData));
        }
    }, [isAuthenticated, dispatch]);

    // Handle WebSocket connection based on auth and online status
    useEffect(() => {
        if (!isAuthenticated || !isOnline) {
            // Disconnect if not authenticated or offline
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            // Ensure Redux knows it's disconnected immediately if offline
            if (!isOnline && isAuthenticated) {
                dispatch(setConnectionStatus('disconnected'));
            }
            return;
        }

        // Create and connect socket
        const socket = new MockWebSocket();
        socketRef.current = socket;

        socket.connect(
            (vitals) => {
                dispatch(updateVitals(vitals));
            },
            (status) => {
                dispatch(setConnectionStatus(status));
            }
        );

        // Cleanup on unmount or when dependencies change
        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [isAuthenticated, isOnline, dispatch]);
}
