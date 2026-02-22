// SKELETON — Shimmer loading placeholder

interface SkeletonProps {
    width?: string;
    height?: string;
    rounded?: 'sm' | 'md' | 'lg' | 'full';
    className?: string;
}

const roundedMap = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
} as const;

export function Skeleton({ width, height, rounded = 'lg', className = '' }: SkeletonProps) {
    return (
        <div
            className={`skeleton ${roundedMap[rounded]} ${className}`}
            style={{ width, height }}
        />
    );
}

/** Pre-built skeleton variants for common patterns. */
export function SkeletonCard() {
    return (
        <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton width="120px" height="16px" rounded="md" />
                <Skeleton width="40px" height="40px" rounded="full" />
            </div>
            <Skeleton width="80px" height="32px" rounded="md" />
            <Skeleton width="160px" height="12px" rounded="md" />
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton width="140px" height="20px" rounded="md" />
                <div className="flex gap-2">
                    <Skeleton width="48px" height="28px" rounded="md" />
                    <Skeleton width="48px" height="28px" rounded="md" />
                    <Skeleton width="48px" height="28px" rounded="md" />
                </div>
            </div>
            <Skeleton width="100%" height="240px" rounded="lg" />
        </div>
    );
}

export function SkeletonTable() {
    return (
        <div className="glass-card p-5 space-y-3">
            <Skeleton width="100%" height="40px" rounded="md" />
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} width="100%" height="48px" rounded="md" />
            ))}
        </div>
    );
}
