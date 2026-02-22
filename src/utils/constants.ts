import type { VitalStatus, VitalThreshold } from '@/features/health/healthTypes';

/** Health vital thresholds — values outside normal trigger warning/critical. */
export const VITAL_THRESHOLDS = {
    heartRate: { min: 60, max: 100, criticalMin: 50, criticalMax: 120, unit: 'bpm' },
    hrv: { min: 20, max: 80, criticalMin: 10, criticalMax: 100, unit: 'ms' },
    systolic: { min: 90, max: 140, criticalMin: 80, criticalMax: 180, unit: 'mmHg' },
    diastolic: { min: 60, max: 90, criticalMin: 50, criticalMax: 110, unit: 'mmHg' },
    spO2: { min: 95, max: 100, criticalMin: 90, criticalMax: 100, unit: '%' },
    temperature: { min: 36.1, max: 37.2, criticalMin: 35.0, criticalMax: 38.5, unit: '°C' },
    respiratoryRate: { min: 12, max: 20, criticalMin: 8, criticalMax: 30, unit: '/min' },
} as const satisfies Record<string, VitalThreshold>;

/** Determine vital status from a threshold key and value. */
export function getVitalStatus(
    key: keyof typeof VITAL_THRESHOLDS,
    value: number
): VitalStatus {
    const t = VITAL_THRESHOLDS[key];
    if (value < t.criticalMin || value > t.criticalMax) return 'critical';
    if (value < t.min || value > t.max) return 'warning';
    return 'normal';
}

/** Status → CSS variable color mapping. Never hardcode colors in components. */
export const STATUS_COLORS = {
    normal: {
        bg: 'var(--color-success-soft)',
        text: 'var(--color-success)',
        dot: 'var(--color-success)',
    },
    warning: {
        bg: 'var(--color-warning-soft)',
        text: 'var(--color-warning)',
        dot: 'var(--color-warning)',
    },
    critical: {
        bg: 'var(--color-danger-soft)',
        text: 'var(--color-danger)',
        dot: 'var(--color-danger)',
    },
} as const satisfies Record<VitalStatus, { bg: string; text: string; dot: string }>;

/** Chart time range options. */
export const TIME_RANGES = [
    { key: '1m', label: '1m', points: 30 },
    { key: '5m', label: '5m', points: 150 },
    { key: '15m', label: '15m', points: 450 },
    { key: '30m', label: '30m', points: 900 },
    { key: '1h', label: '1h', points: 1800 },
] as const;

/** Default time range key. */
export const DEFAULT_TIME_RANGE = '5m';

/** WebSocket simulation interval in ms. */
export const WS_INTERVAL_MS = 2000;

/** Max data points kept in the rolling realtime history window. */
export const MAX_REALTIME_POINTS = 1800;

/** Table pagination defaults. */
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

/** Debounce delay for table search (ms). */
export const SEARCH_DEBOUNCE_MS = 300;

/** Throttle delay for chart rendering (ms). */
export const CHART_THROTTLE_MS = 500;

/** Mock auth credentials for demo. */
export const MOCK_USER = {
    id: 'usr_001',
    name: 'John Doe',
    email: 'john@pulsetrack.demo',
    avatar: undefined,
} as const;

/** Token expiry durations (ms). */
export const TOKEN_EXPIRY = {
    access: 60 * 60 * 1000,
    refresh: 7 * 24 * 60 * 60 * 1000,
} as const;
