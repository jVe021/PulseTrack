import { getBufferedReadings, clearBuffer, getBufferedCount } from '@/lib/idb';
import type { VitalSigns } from '@/features/health/healthTypes';

type SyncCallback = (readings: VitalSigns[]) => void;
type ToastCallback = (message: string) => void;


export async function flushOfflineBuffer(
    onSync: SyncCallback,
    onToast: ToastCallback
): Promise<void> {
    try {
        const count = await getBufferedCount();
        if (count === 0) return;

        const readings = await getBufferedReadings();
        onSync(readings);
        await clearBuffer();
        onToast(`Synced ${count} cached reading${count !== 1 ? 's' : ''}`);
    } catch (error) {
        console.error('[OfflineSync] Failed to flush buffer:', error);
        onToast('Failed to sync cached data. Will retry later.');
    }
}


export function createOfflineSyncListener(
    onSync: SyncCallback,
    onToast: ToastCallback
): () => void {
    const handleOnline = () => {
        flushOfflineBuffer(onSync, onToast);
    };

    window.addEventListener('online', handleOnline);

    return () => {
        window.removeEventListener('online', handleOnline);
    };
}
