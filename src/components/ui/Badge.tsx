type BadgeVariant = 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
    variant?: BadgeVariant;
    label: string;
    dot?: boolean;
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    danger: 'bg-danger/15 text-danger',
    info: 'bg-brand-500/15 text-brand-400',
};

const dotColors: Record<BadgeVariant, string> = {
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-brand-400',
};

export function Badge({ variant = 'info', label, dot = false, className = '' }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${variantClasses[variant]} ${className}`}
        >
            {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
            {label}
        </span>
    );
}
