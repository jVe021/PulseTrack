'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { MetricGrid } from '@/components/metrics/MetricGrid';
import { HealthLogTable } from '@/components/tables/HealthLogTable';
import { Skeleton } from '@/components/ui/Skeleton';

// Dynamically import chart component to avoid SSR issues with Recharts
// and improve initial page load performance
const LiveChart = dynamic(
    () => import('@/components/charts/LiveChart').then((mod) => mod.LiveChart),
    {
        ssr: false,
        loading: () => <Skeleton width="100%" height="300px" rounded="lg" />
    }
);

export default function DashboardPage() {
    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-6"
        >
            {/* 1. Top row: Metric Cards */}
            <motion.div variants={fadeInUp}>
                <MetricGrid />
            </motion.div>

            {/* 2. Middle row: Live Chart */}
            <motion.div variants={fadeInUp}>
                <LiveChart />
            </motion.div>

            {/* 3. Bottom row: Activity Table */}
            <motion.div variants={fadeInUp}>
                <HealthLogTable />
            </motion.div>
        </motion.div>
    );
}
