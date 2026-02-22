import { formatTrend } from '@/utils/formatters';

interface MetricTrendProps {
    trend: 'up' | 'down' | 'stable';
    value: number;
    className?: string;
}

const trendConfig = {
    up: {
        color: 'text-success',
        arrow: (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2,8 6,4 10,8" />
            </svg>
        ),
    },
    down: {
        color: 'text-danger',
        arrow: (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2,4 6,8 10,4" />
            </svg>
        ),
    },
    stable: {
        color: 'text-text-muted',
        arrow: (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="6" x2="10" y2="6" />
            </svg>
        ),
    },
} as const;

export function MetricTrend({ trend, value, className = '' }: MetricTrendProps) {
    const config = trendConfig[trend];

    return (
        <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${config.color} ${className}`}>
            {config.arrow}
            {formatTrend(value)}
        </span>
    );
}