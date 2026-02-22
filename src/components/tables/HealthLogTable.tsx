'use client';

import { useState, useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { TableSearch } from './TableSearch';
import { TableFilter } from './TableFilter';
import { TablePagination } from './TablePagination';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useAppSelector } from '@/store/hooks';
import { selectRealtimeHistory } from '@/features/health/healthSlice';
import { getVitalStatus, STATUS_COLORS, DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '@/utils/constants';
import { formatTime, formatBPM, formatSpO2, formatTemperature, formatBloodPressure } from '@/utils/formatters';
import type { VitalSigns, VitalStatus } from '@/features/health/healthTypes';

type SortKey = 'timestamp' | 'heartRate' | 'systolic' | 'spO2' | 'temperature' | 'status';
type SortDir = 'asc' | 'desc' | 'none';

interface SortState {
    key: SortKey;
    dir: SortDir;
}

function getOverallStatus(v: VitalSigns): VitalStatus {
    const statuses = [
        getVitalStatus('heartRate', v.heartRate),
        getVitalStatus('systolic', v.bloodPressure.systolic),
        getVitalStatus('spO2', v.spO2),
        getVitalStatus('temperature', v.temperature),
    ];
    if (statuses.includes('critical')) return 'critical';
    if (statuses.includes('warning')) return 'warning';
    return 'normal';
}

function getStatusBadgeVariant(status: VitalStatus) {
    const map = { normal: 'success', warning: 'warning', critical: 'danger' } as const;
    return map[status];
}

const COLUMNS: { key: SortKey; label: string; width: string }[] = [
    { key: 'timestamp', label: 'Time', width: 'w-[120px]' },
    { key: 'heartRate', label: 'Heart Rate', width: 'w-[100px]' },
    { key: 'systolic', label: 'Blood Pressure', width: 'w-[120px]' },
    { key: 'spO2', label: 'SpO₂', width: 'w-[80px]' },
    { key: 'temperature', label: 'Temp', width: 'w-[80px]' },
    { key: 'status', label: 'Status', width: 'w-[100px]' },
];

function SortArrow({ dir }: { dir: SortDir }) {
    if (dir === 'none') {
        return (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3">
                <polyline points="3,5 6,2 9,5" />
                <polyline points="3,7 6,10 9,7" />
            </svg>
        );
    }
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-brand-400">
            {dir === 'asc'
                ? <polyline points="3,7 6,4 9,7" />
                : <polyline points="3,5 6,8 9,5" />
            }
        </svg>
    );
}

export function HealthLogTable() {
    const history = useAppSelector(selectRealtimeHistory);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<VitalStatus | 'all'>('all');
    const [sort, setSort] = useState<SortState>({ key: 'timestamp', dir: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    const debouncedSearch = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_MS);

    // 1. Enrich data with overall status
    const enrichedData = useMemo(() =>
        history.map((v) => ({ ...v, overallStatus: getOverallStatus(v) })),
        [history]
    );

    // 2. Filter by search + status
    const filteredData = useMemo(() => {
        let data = enrichedData;

        if (statusFilter !== 'all') {
            data = data.filter((v) => v.overallStatus === statusFilter);
        }

        if (debouncedSearch.trim()) {
            const q = debouncedSearch.toLowerCase();
            data = data.filter((v) => {
                const searchable = [
                    formatTime(v.timestamp),
                    formatBPM(v.heartRate),
                    formatBloodPressure(v.bloodPressure.systolic, v.bloodPressure.diastolic),
                    formatSpO2(v.spO2),
                    formatTemperature(v.temperature),
                    v.overallStatus,
                ].join(' ').toLowerCase();
                return searchable.includes(q);
            });
        }

        return data;
    }, [enrichedData, statusFilter, debouncedSearch]);

    // 3. Sort
    const sortedData = useMemo(() => {
        if (sort.dir === 'none') return filteredData;

        return [...filteredData].sort((a, b) => {
            let cmp = 0;
            switch (sort.key) {
                case 'timestamp':
                    cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                    break;
                case 'heartRate':
                    cmp = a.heartRate - b.heartRate;
                    break;
                case 'systolic':
                    cmp = a.bloodPressure.systolic - b.bloodPressure.systolic;
                    break;
                case 'spO2':
                    cmp = a.spO2 - b.spO2;
                    break;
                case 'temperature':
                    cmp = a.temperature - b.temperature;
                    break;
                case 'status': {
                    const order = { normal: 0, warning: 1, critical: 2 };
                    cmp = order[a.overallStatus] - order[b.overallStatus];
                    break;
                }
            }
            return sort.dir === 'desc' ? -cmp : cmp;
        });
    }, [filteredData, sort]);

    // 4. Paginate
    const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const pageData = sortedData.slice((safePage - 1) * pageSize, safePage * pageSize);

    function handleSort(key: SortKey) {
        setSort((prev) => {
            if (prev.key !== key) return { key, dir: 'asc' };
            if (prev.dir === 'asc') return { key, dir: 'desc' };
            if (prev.dir === 'desc') return { key, dir: 'none' };
            return { key, dir: 'asc' };
        });
    }

    function handlePageSizeChange(size: number) {
        setPageSize(size);
        setCurrentPage(1);
    }

    function renderCell(row: VitalSigns & { overallStatus: VitalStatus }, key: SortKey) {
        switch (key) {
            case 'timestamp':
                return <span className="text-text-secondary">{formatTime(row.timestamp)}</span>;
            case 'heartRate': {
                const s = getVitalStatus('heartRate', row.heartRate);
                return <span style={{ color: STATUS_COLORS[s].text }}>{formatBPM(row.heartRate)}</span>;
            }
            case 'systolic': {
                const s = getVitalStatus('systolic', row.bloodPressure.systolic);
                return <span style={{ color: STATUS_COLORS[s].text }}>{formatBloodPressure(row.bloodPressure.systolic, row.bloodPressure.diastolic)}</span>;
            }
            case 'spO2': {
                const s = getVitalStatus('spO2', row.spO2);
                return <span style={{ color: STATUS_COLORS[s].text }}>{formatSpO2(row.spO2)}</span>;
            }
            case 'temperature': {
                const s = getVitalStatus('temperature', row.temperature);
                return <span style={{ color: STATUS_COLORS[s].text }}>{formatTemperature(row.temperature)}</span>;
            }
            case 'status':
                return <Badge variant={getStatusBadgeVariant(row.overallStatus)} dot label={row.overallStatus} />;
        }
    }

    return (
        <GlassCard padding="md">
            {/* Toolbar */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <TableSearch value={searchQuery} onChange={setSearchQuery} />
                <TableFilter value={statusFilter} onChange={setStatusFilter} />
            </div>

            {/* Table with horizontal scroll */}
            <div className="overflow-x-auto rounded-lg border border-[var(--color-glass-border)]">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[var(--color-glass-border)] bg-[var(--color-glass-bg)]">
                            {COLUMNS.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => handleSort(col.key)}
                                    // Make header focusable for keyboard users
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleSort(col.key);
                                        }
                                    }}
                                    // Add ARIA label for sort state
                                    aria-sort={sort.key === col.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                                    className={`${col.width} cursor-pointer select-none px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider transition-colors hover:text-text-secondary outline-none focus-visible:bg-[var(--color-glass-bg-hover)] focus-visible:text-text-primary focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset`}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        <SortArrow dir={sort.key === col.key ? sort.dir : 'none'} />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.length === 0 ? (
                            <tr>
                                <td colSpan={COLUMNS.length} className="px-4 py-16">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-glass-bg-active)] text-brand-500 mb-3">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="11" cy="11" r="8" />
                                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-semibold text-text-primary">No records found</p>
                                        <p className="mt-1 text-xs text-text-muted max-w-xs">
                                            We couldn&apos;t find any health metrics matching your filters. Try adjusting your search or clearing the status filter.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            pageData.map((row, i) => (
                                <tr
                                    key={`${row.timestamp}-${i}`}
                                    className="border-b border-[var(--color-glass-border)] last:border-0 transition-colors hover:bg-[var(--color-glass-bg)]"
                                >
                                    {COLUMNS.map((col) => (
                                        <td key={col.key} className={`${col.width} px-4 py-3 text-sm font-medium`}>
                                            {renderCell(row, col.key)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4">
                <TablePagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={sortedData.length}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </GlassCard>
    );
}
