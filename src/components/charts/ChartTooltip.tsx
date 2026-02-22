import { formatTime } from '@/utils/formatters';

interface TooltipPayloadItem {
    name: string;
    value: number;
    color: string;
    unit?: string;
}

interface ChartTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-bg-secondary)]/95 px-4 py-3 shadow-xl backdrop-blur-xl">
            {label && (
                <p className="mb-2 text-xs font-medium text-text-muted">
                    {formatTime(label)}
                </p>
            )}
            <div className="space-y-1">
                {payload.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs text-text-secondary">{item.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-text-primary">
                            {Math.round(item.value)}{item.unit ? ` ${item.unit}` : ''}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
