'use client';

interface TableSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function TableSearch({ value, onChange, placeholder = 'Search health data...' }: TableSearchProps) {
    return (
        <div className="relative flex-1 min-w-[200px]">
            <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
                <circle cx="7" cy="7" r="5" />
                <line x1="11" y1="11" x2="14" y2="14" />
            </svg>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-9 w-full rounded-lg border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg-primary)]"
            />
        </div>
    );
}
