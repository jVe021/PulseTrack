'use client';

import type { VitalStatus } from '@/features/health/healthTypes';

type FilterValue = VitalStatus | 'all';

interface TableFilterProps {
    value: FilterValue;
    onChange: (value: FilterValue) => void;
}

const OPTIONS: { value: FilterValue; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: 'normal', label: '🟢 Normal' },
    { value: 'warning', label: '🟡 Warning' },
    { value: 'critical', label: '🔴 Critical' },
];

export function TableFilter({ value, onChange }: TableFilterProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as FilterValue)}
            className="h-9 rounded-lg border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] px-3 text-sm text-text-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg-primary)] appearance-none cursor-pointer min-w-[140px]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 8px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px',
                paddingRight: '32px',
            }}
        >
            {OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[var(--color-bg-secondary)] text-text-primary">
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
