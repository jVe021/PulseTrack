'use client';

import { useState, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    AreaChart,
} from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';
import { ChartTooltip } from './ChartTooltip';
import { TimeRangeFilter } from './TimeRangeFilter';
import { useAppSelector } from '@/store/hooks';
import { selectRealtimeHistory } from '@/features/health/healthSlice';
import { useThrottledValue } from '@/hooks/useThrottledValue';
import { formatTime } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/Skeleton';

const CHART_LINES = [
    { key: 'heartRate', name: 'Heart Rate', color: 'var(--color-chart-4)', unit: 'bpm' },
    { key: 'hrv', name: 'HRV', color: 'var(--color-chart-1)', unit: 'ms' },
    { key: 'spO2', name: 'SpO₂', color: 'var(--color-chart-2)', unit: '%' },
] as const;

const REFERENCE_LINES = [
    { y: 60, label: 'HR Min', color: 'var(--color-chart-4)' },
    { y: 100, label: 'HR Max', color: 'var(--color-chart-4)' },
    { y: 95, label: 'SpO₂ Min', color: 'var(--color-chart-2)' },
];


export function LiveChart() {
    const [selectedRange, setSelectedRange] = useState('5m');
    const [visiblePoints, setVisiblePoints] = useState(150);

    const rawHistory = useAppSelector(selectRealtimeHistory);
    const history = useThrottledValue(rawHistory, 500);

    // Slice data to the selected time window
    const chartData = useMemo(() => {
        const sliced = history.slice(-visiblePoints);
        return sliced.map((v) => ({
            timestamp: v.timestamp,
            heartRate: v.heartRate,
            hrv: v.hrv,
            spO2: v.spO2,
        }));
    }, [history, visiblePoints]);

    const handleRangeChange = (key: string, points: number) => {
        setSelectedRange(key);
        setVisiblePoints(points);
    };

    const hasData = chartData.length > 0;

    return (
        <GlassCard padding="md">
            {/* Header */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-text-primary">Live Vitals</h2>
                    <p className="text-xs text-text-muted">
                        {hasData
                            ? `${chartData.length} data points · updated every 2s`
                            : 'Waiting for data...'}
                    </p>
                </div>
                <TimeRangeFilter
                    selected={selectedRange}
                    onSelect={handleRangeChange}
                />
            </div>

            {/* Chart */}
            {!hasData ? (
                <Skeleton width="100%" height="300px" rounded="lg" />
            ) : (
                <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                            <defs>
                                {CHART_LINES.map((line) => (
                                    <linearGradient key={line.key} id={`grad-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={line.color} stopOpacity={0.25} />
                                        <stop offset="100%" stopColor={line.color} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 6"
                                stroke="var(--color-glass-border)"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(t: string) => formatTime(t).slice(0, 5)}
                                stroke="var(--color-text-muted)"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={40}
                            />

                            <YAxis
                                stroke="var(--color-text-muted)"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                domain={['auto', 'auto']}
                            />

                            <Tooltip
                                content={<ChartTooltip />}
                                cursor={{
                                    stroke: 'var(--color-glass-border)',
                                    strokeDasharray: '4 4',
                                }}
                            />

                            {/* Reference lines */}
                            {REFERENCE_LINES.map((ref, i) => (
                                <ReferenceLine
                                    key={i}
                                    y={ref.y}
                                    stroke={ref.color}
                                    strokeDasharray="6 4"
                                    strokeOpacity={0.3}
                                    label={{
                                        value: ref.label,
                                        position: 'insideTopRight',
                                        fill: ref.color,
                                        fontSize: 9,
                                        opacity: 0.5,
                                    }}
                                />
                            ))}

                            {/* Area + Line for each metric */}
                            {CHART_LINES.map((line) => (
                                <Area
                                    key={line.key}
                                    type="monotone"
                                    dataKey={line.key}
                                    name={line.name}
                                    stroke={line.color}
                                    fill={`url(#grad-${line.key})`}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--color-bg-primary)' }}
                                    isAnimationActive={false}
                                    unit={` ${line.unit}`}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </GlassCard>
    );
}
