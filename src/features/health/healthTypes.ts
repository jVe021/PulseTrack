export interface VitalSigns {
    heartRate: number;
    hrv: number;
    bloodPressure: {
        systolic: number;
        diastolic: number;
    };
    spO2: number;
    temperature: number;
    respiratoryRate: number;
    steps: number;
    calories: number;
    timestamp: string;
}

/** A persisted health record with unique ID. */
export interface HealthRecord extends VitalSigns {
    id: string;
    date: string;
}

/** WebSocket / data stream connection status. */
export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';

/** Shape of a single metric card's data. */
export interface MetricCardData {
    id: string;
    label: string;
    value: number;
    unit: string;
    icon: string;
    trend: 'up' | 'down' | 'stable';
    trendValue: number;
    status: VitalStatus;
    sparklineData: number[];
}

/** Vital sign status classification. */
export type VitalStatus = 'normal' | 'warning' | 'critical';

/** Threshold definition for a single vital metric. */
export interface VitalThreshold {
    min: number;
    max: number;
    criticalMin: number;
    criticalMax: number;
    unit: string;
}

/** Auth user profile. */
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

/** Auth state shape. */
export interface AuthState {
    user: UserProfile | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
}

/** Health slice state shape. */
export interface HealthState {
    currentVitals: VitalSigns | null;
    realtimeHistory: VitalSigns[];
    historicalData: HealthRecord[];
    connectionStatus: ConnectionStatus;
    lastUpdated: string | null;
    isLoading: boolean;
    error: string | null;
}

/** Time range filter option for charts. */
export interface TimeRange {
    key: string;
    label: string;
    points: number;
}

/** Table sort configuration. */
export interface SortConfig {
    key: string;
    direction: 'asc' | 'desc' | 'none';
}

/** Paginated table state. */
export interface PaginationState {
    currentPage: number;
    pageSize: number;
    totalItems: number;
}
