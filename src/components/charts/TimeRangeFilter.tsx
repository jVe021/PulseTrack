'use client';

interface TimeRangeOption {
    key: string;
    label: string;
    points: number;
}

const TIME_RANGES: TimeRangeOption[] = [
    { key: '1m', label: '1m', points: 30 },
    { key: '5m', label: '5m', points: 150 },
    { key: '15m', label: '15m', points: 450 },
    { key: '30m', label: '30m', points: 900 },
    { key: '1h', label: '1h', points: 1800 },
];

interface TimeRangeFilterProps {
    selected: string;
    onSelect: (key: string, points: number) => void;
}

export function TimeRangeFilter({ selected, onSelect }: TimeRangeFilterProps) {
    return (
        <div className="flex gap-1">
            {TIME_RANGES.map((range) => (
                <button
                    key={range.key}
                    onClick={() => onSelect(range.key, range.points)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${selected === range.key
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                        : 'text-text-muted hover:bg-[var(--color-glass-bg)] hover:text-text-secondary'
                        }`}
                >
                    {range.label}
                </button>
            ))}
        </div>
    );
}

export { TIME_RANGES };
