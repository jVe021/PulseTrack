import type { VitalSigns, HealthRecord } from '@/features/health/healthTypes';

const DB_NAME = 'pulsetrack-offline';
const DB_VERSION = 1;


const STORE_CACHE = 'healthCache';
const STORE_BUFFER = 'realtimeBuffer';



function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_CACHE)) {
                db.createObjectStore(STORE_CACHE, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORE_BUFFER)) {
                db.createObjectStore(STORE_BUFFER, { autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}


function txPromise<T>(
    db: IDBDatabase,
    storeName: string,
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        const request = fn(store);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/** Cache health records for offline access. */
export async function cacheHealthData(records: HealthRecord[]): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(STORE_CACHE, 'readwrite');
    const store = tx.objectStore(STORE_CACHE);

    for (const record of records) {
        store.put(record);
    }

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

/** Retrieve all cached health records. */
export async function getCachedHealthData(): Promise<HealthRecord[]> {
    const db = await openDB();
    return txPromise(db, STORE_CACHE, 'readonly', (store) => store.getAll());
}


/** Buffer a single realtime reading for later sync. */
export async function bufferRealtimeReading(reading: VitalSigns): Promise<void> {
    const db = await openDB();
    await txPromise(db, STORE_BUFFER, 'readwrite', (store) => store.add(reading));
}

/** Get all buffered readings. */
export async function getBufferedReadings(): Promise<VitalSigns[]> {
    const db = await openDB();
    return txPromise(db, STORE_BUFFER, 'readonly', (store) => store.getAll());
}

/** Clear the buffer after successful sync. */
export async function clearBuffer(): Promise<void> {
    const db = await openDB();
    await txPromise(db, STORE_BUFFER, 'readwrite', (store) => store.clear());
}

/** Get the count of buffered readings. */
export async function getBufferedCount(): Promise<number> {
    const db = await openDB();
    return txPromise(db, STORE_BUFFER, 'readonly', (store) => store.count());
}
