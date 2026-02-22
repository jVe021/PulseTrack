'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { MetricTrend } from './MetricTrend';
import type { VitalStatus } from '@/features/health/healthTypes';


interface MetricCardProps {
    label: string;
    value: number;
    unit: string;
    icon: React.ReactNode;
    trend: 'up' | 'down' | 'stable';
    trendValue: number;
    status: VitalStatus;
    sparklineData: number[];
    sparklineColor?: string;
    formatter?: (v: number) => string;
}


const statusConfig: Record<VitalStatus, { color: string; bgColor: string; label: string }> = {
    normal: { color: 'bg-success', bgColor: 'bg-success/10', label: 'Normal' },
    warning: { color: 'bg-warning', bgColor: 'bg-warning/10', label: 'Warning' },
    critical: { color: 'bg-danger', bgColor: 'bg-danger/10', label: 'Critical' },
};


function MiniSparkline({ data, color = 'var(--color-chart-1)' }: { data: number[]; color?: string }) {
    if (data.length < 2) return null;

    const width = 120;
    const height = 32;
    const padding = 2;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((v, i) => {
        const x = padding + (i / (data.length - 1)) * (width - padding * 2);
        const y = height - padding - ((v - min) / range) * (height - padding * 2);
        return `${x},${y}`;
    });

    const pathD = `M${points.join(' L')}`;
    const areaD = `${pathD} L${width - padding},${height} L${padding},${height} Z`;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
            <defs>
                <linearGradient id={`spark-grad-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaD} fill={`url(#spark-grad-${color.replace(/[^a-zA-Z0-9]/g, '')})`} />
            <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}


export const MetricCard = React.memo(function MetricCard({
    label,
    value,
    unit,
    icon,
    trend,
    trendValue,
    status,
    sparklineData,
    sparklineColor = 'var(--color-chart-1)',
    formatter,
}: MetricCardProps) {
    const statusInfo = statusConfig[status];
    const defaultFormatter = (v: number) => Math.round(v).toLocaleString();

    return (
        <GlassCard
            hover
            animate
            padding="md"
            role="region"
            aria-label={`${label} Metric: ${formatter ? formatter(value) : defaultFormatter(value)} ${unit}, Status: ${statusInfo.label}`}
        >
            {/* Header: Icon + Label + Trend */}
            <div className="flex items-start justify-between mb-3" aria-hidden="true">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-glass-bg-active)]">
                        {icon}
                    </div>
                    <span className="text-sm font-medium text-text-secondary">{label}</span>
                </div>
                <MetricTrend trend={trend} value={trendValue} />
            </div>

            <div className="flex item-center justify-between">
                {/* Value */}
                <div
                    className="mb-3 flex items-baseline gap-1.5"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <AnimatedNumber
                        value={value}
                        formatter={formatter ?? defaultFormatter}
                        className="text-2xl font-bold text-text-primary"
                    />
                    <span className="text-sm text-text-muted">{unit}</span>
                </div>

                {/* Sparkline */}
                <div className="mb-3" aria-hidden="true">
                    <MiniSparkline data={sparklineData} color={sparklineColor} />
                </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2" aria-hidden="true">
                <span className={`h-2 w-2 rounded-full ${statusInfo.color}`} />
                <span className={`text-xs font-medium ${statusInfo.bgColor} rounded-full px-2 py-0.5`}>
                    {statusInfo.label}
                </span>
            </div>
        </GlassCard>
    );
}, (prevProps, nextProps) => {
    // Custom comparison for complex props
    return (
        prevProps.label === nextProps.label &&
        prevProps.value === nextProps.value &&
        prevProps.trendValue === nextProps.trendValue &&
        prevProps.status === nextProps.status &&
        prevProps.sparklineData.length === nextProps.sparklineData.length &&
        // Quick array content check
        prevProps.sparklineData[prevProps.sparklineData.length - 1] === nextProps.sparklineData[nextProps.sparklineData.length - 1]
    );
});
