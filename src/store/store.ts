import { configureStore } from '@reduxjs/toolkit';
import healthReducer from '@/features/health/healthSlice';
import authReducer from '@/features/auth/authSlice';
import { healthApi } from '@/features/health/healthApi';
import { authApi } from '@/features/auth/authApi';
import { offlineMiddleware } from '@/store/middleware';

export const store = configureStore({
    reducer: {
        health: healthReducer,
        auth: authReducer,
        [healthApi.reducerPath]: healthApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(healthApi.middleware)
            .concat(authApi.middleware)
            .concat(offlineMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;