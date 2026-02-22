import type { Middleware } from '@reduxjs/toolkit';
import { bufferRealtimeReading } from '@/lib/idb';
import { updateVitals } from '@/features/health/healthSlice';

export const offlineMiddleware: Middleware = (_store) => (next) => (action) => {

    const result = next(action);

    if (
        typeof navigator !== 'undefined' &&
        !navigator.onLine &&
        updateVitals.match(action)
    ) {
        bufferRealtimeReading(action.payload).catch((err) => {
            console.error('[OfflineMiddleware] Failed to buffer reading:', err);
        });
    }

    return result;
};
