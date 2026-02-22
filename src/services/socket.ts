import type { VitalSigns, ConnectionStatus } from '@/features/health/healthTypes';
import { generateVitalSigns } from '@/utils/generators';

type MessageCallback = (data: VitalSigns) => void;
type StatusCallback = (status: ConnectionStatus) => void;

export class MockWebSocket {
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    private retryCount = 0;
    private maxRetries = 5;
    private previousVitals: VitalSigns | null = null;
    private _onMessage: MessageCallback | null = null;
    private _onStatus: StatusCallback | null = null;

    connect(onMessage: MessageCallback, onStatusChange: StatusCallback): void {
        this._onMessage = onMessage;
        this._onStatus = onStatusChange;
        this.retryCount = 0;

        onStatusChange('connected');

        this.intervalId = setInterval(() => {
            const newVitals = generateVitalSigns(this.previousVitals);
            this.previousVitals = newVitals;
            onMessage(newVitals);
        }, 2000);
    }

    /**
     * Stop streaming and clean up all timers.
     */
    disconnect(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        this._onStatus?.('disconnected');
        this._onMessage = null;
        this._onStatus = null;
        this.retryCount = 0;
    }

    reconnect(): void {
        if (!this._onMessage || !this._onStatus) return;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this._onStatus('reconnecting');

        const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
        this.retryCount++;

        this.reconnectTimeout = setTimeout(() => {
            if (this.retryCount <= this.maxRetries && this._onMessage && this._onStatus) {
                this.connect(this._onMessage, this._onStatus);
            } else {
                this._onStatus?.('disconnected');
            }
        }, delay);
    }

    get isConnected(): boolean {
        return this.intervalId !== null;
    }
}
