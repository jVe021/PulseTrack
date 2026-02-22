'use client';

import { PAGE_SIZE_OPTIONS } from '@/utils/constants';

interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export function TablePagination({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
}: TablePaginationProps) {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Info + page size */}
            <div className="flex items-center gap-3 text-xs text-text-muted">
                <span>
                    {totalItems > 0 ? `${start}–${end} of ${totalItems}` : 'No results'}
                </span>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="h-7 rounded-md border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] px-2 text-xs text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg-primary)] appearance-none cursor-pointer pr-6"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 4px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '14px',
                    }}
                >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size} className="bg-[var(--color-bg-secondary)] text-text-primary">
                            {size} / page
                        </option>
                    ))}
                </select>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="Previous page"
                    className="flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-medium text-text-secondary transition-colors hover:bg-[var(--color-glass-bg)] disabled:opacity-40 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg-primary)] outline-none"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9,3 5,7 9,11" />
                    </svg>
                    Prev
                </button>

                <span className="px-3 text-xs font-medium text-text-primary">
                    {totalPages > 0 ? `${currentPage} / ${totalPages}` : '—'}
                </span>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    aria-label="Next page"
                    className="flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-medium text-text-secondary transition-colors hover:bg-[var(--color-glass-bg)] disabled:opacity-40 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg-primary)] outline-none"
                >
                    Next
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="5,3 9,7 5,11" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
