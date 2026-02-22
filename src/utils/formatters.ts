/** Format heart rate: "72 bpm" */
export function formatBPM(value: number): string {
    return `${Math.round(value)} bpm`;
}

/** Format HRV: "45 ms" */
export function formatHRV(value: number): string {
    return `${Math.round(value)} ms`;
}

/** Format blood pressure: "120/80" */
export function formatBloodPressure(systolic: number, diastolic: number): string {
    return `${Math.round(systolic)}/${Math.round(diastolic)}`;
}

/** Format SpO2 percentage: "98%" */
export function formatSpO2(value: number): string {
    return `${Math.round(value)}%`;
}

/** Format temperature: "36.6°C" */
export function formatTemperature(value: number): string {
    return `${value.toFixed(1)}°C`;
}

/** Format respiratory rate: "16/min" */
export function formatRespiratoryRate(value: number): string {
    return `${Math.round(value)}/min`;
}

/** Format large numbers with commas: 8432 → "8,432" */
export function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
}

/** Format compact numbers: 12500 → "12.5K" */
export function formatCompact(value: number): string {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}

/** Format ISO timestamp to time string: "14:32:05" */
export function formatTime(isoString: string): string {
    return new Date(isoString).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

/** Format ISO timestamp to date string: "Feb 21, 2026" */
export function formatDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/** Format ISO timestamp to short date-time: "Feb 21, 14:32" */
export function formatDateTime(isoString: string): string {
    const d = new Date(isoString);
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const time = d.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${date}, ${time}`;
}

/** Format trend value with sign: "+3" or "-2" or "0" */
export function formatTrend(value: number): string {
    if (value > 0) return `+${Math.round(value)}`;
    if (value < 0) return `${Math.round(value)}`;
    return '0';
}

/** Format duration in seconds to "Xm Ys" */
export function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
}
