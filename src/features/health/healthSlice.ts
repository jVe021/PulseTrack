import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
    VitalSigns,
    HealthRecord,
    ConnectionStatus,
    HealthState,
} from '@/features/health/healthTypes';
import { MAX_REALTIME_POINTS } from '@/utils/constants';

const initialState: HealthState = {
    currentVitals: null,
    realtimeHistory: [],
    historicalData: [],
    connectionStatus: 'disconnected',
    lastUpdated: null,
    isLoading: false,
    error: null,
};

const healthSlice = createSlice({
    name: 'health',
    initialState,
    reducers: {
        updateVitals(state, action: PayloadAction<VitalSigns>) {
            state.currentVitals = action.payload;
            state.realtimeHistory.push(action.payload);
            if (state.realtimeHistory.length > MAX_REALTIME_POINTS) {
                state.realtimeHistory.shift();
            }
            state.lastUpdated = action.payload.timestamp;
        },

        /** Bulk-load realtime history (e.g. on initial dashboard load). */
        setRealtimeHistory(state, action: PayloadAction<VitalSigns[]>) {
            state.realtimeHistory = action.payload;
            if (action.payload.length > 0) {
                state.currentVitals = action.payload[action.payload.length - 1];
                state.lastUpdated = action.payload[action.payload.length - 1].timestamp;
            }
        },

        /** Set historical data (fetched from API). */
        setHistoricalData(state, action: PayloadAction<HealthRecord[]>) {
            state.historicalData = action.payload;
        },

        /** Update WebSocket connection status. */
        setConnectionStatus(state, action: PayloadAction<ConnectionStatus>) {
            state.connectionStatus = action.payload;
        },

        /** Set loading state. */
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },

        /** Set error message. */
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },

        /** Clear all health data (e.g. on logout). */
        clearHealthData(state) {
            Object.assign(state, initialState);
        },
    },
});

export const {
    updateVitals,
    setRealtimeHistory,
    setHistoricalData,
    setConnectionStatus,
    setLoading,
    setError,
    clearHealthData,
} = healthSlice.actions;

export default healthSlice.reducer;

export const selectCurrentVitals = (state: { health: HealthState }) =>
    state.health.currentVitals;

export const selectRealtimeHistory = (state: { health: HealthState }) =>
    state.health.realtimeHistory;

export const selectHistoricalData = (state: { health: HealthState }) =>
    state.health.historicalData;

export const selectConnectionStatus = (state: { health: HealthState }) =>
    state.health.connectionStatus;

export const selectLastUpdated = (state: { health: HealthState }) =>
    state.health.lastUpdated;

export const selectIsLoading = (state: { health: HealthState }) =>
    state.health.isLoading;

export const selectError = (state: { health: HealthState }) =>
    state.health.error;
