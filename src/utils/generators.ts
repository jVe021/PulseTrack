import type { VitalSigns, HealthRecord } from '@/features/health/healthTypes';
import { VITAL_THRESHOLDS } from '@/utils/constants';

/** Clamp a value within [min, max]. */
function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/** Generate a smooth drift from a base value (±percent of range). */
function drift(
    base: number,
    min: number,
    max: number,
    volatility: number = 0.03
): number {
    const range = max - min;
    const delta = (Math.random() - 0.5) * 2 * range * volatility;
    return clamp(base + delta, min, max);
}

/** 5% chance of a spike — a larger jump toward warning/critical zone. */
function maybeSpike(
    value: number,
    min: number,
    max: number,
    criticalMin: number,
    criticalMax: number
): number {
    if (Math.random() > 0.05) return value;
    const target = Math.random() > 0.5
        ? max + (criticalMax - max) * Math.random() * 0.5
        : min - (min - criticalMin) * Math.random() * 0.5;
    return clamp(target, criticalMin, criticalMax);
}


/** Default baseline values for the first reading. */
const BASELINE: VitalSigns = {
    heartRate: 72,
    hrv: 45,
    bloodPressure: { systolic: 120, diastolic: 80 },
    spO2: 98,
    temperature: 36.6,
    respiratoryRate: 16,
    steps: 0,
    calories: 0,
    timestamp: new Date().toISOString(),
};

export function generateVitalSigns(previous?: VitalSigns | null): VitalSigns {
    const prev = previous ?? BASELINE;
    const t = VITAL_THRESHOLDS;

    const heartRate = maybeSpike(
        drift(prev.heartRate, t.heartRate.min, t.heartRate.max),
        t.heartRate.min, t.heartRate.max,
        t.heartRate.criticalMin, t.heartRate.criticalMax
    );

    const hrv = maybeSpike(
        drift(prev.hrv, t.hrv.min, t.hrv.max),
        t.hrv.min, t.hrv.max,
        t.hrv.criticalMin, t.hrv.criticalMax
    );

    const systolic = maybeSpike(
        drift(prev.bloodPressure.systolic, t.systolic.min, t.systolic.max),
        t.systolic.min, t.systolic.max,
        t.systolic.criticalMin, t.systolic.criticalMax
    );

    const diastolic = maybeSpike(
        drift(prev.bloodPressure.diastolic, t.diastolic.min, t.diastolic.max),
        t.diastolic.min, t.diastolic.max,
        t.diastolic.criticalMin, t.diastolic.criticalMax
    );

    const spO2 = maybeSpike(
        drift(prev.spO2, t.spO2.min, t.spO2.max, 0.01),
        t.spO2.min, t.spO2.max,
        t.spO2.criticalMin, t.spO2.criticalMax
    );

    const temperature = maybeSpike(
        drift(prev.temperature, t.temperature.min, t.temperature.max, 0.01),
        t.temperature.min, t.temperature.max,
        t.temperature.criticalMin, t.temperature.criticalMax
    );

    const respiratoryRate = maybeSpike(
        drift(prev.respiratoryRate, t.respiratoryRate.min, t.respiratoryRate.max, 0.02),
        t.respiratoryRate.min, t.respiratoryRate.max,
        t.respiratoryRate.criticalMin, t.respiratoryRate.criticalMax
    );

    const steps = prev.steps + Math.floor(Math.random() * 20);
    const calories = prev.calories + Math.round(Math.random() * 5 * 10) / 10;

    return {
        heartRate: Math.round(heartRate * 10) / 10,
        hrv: Math.round(hrv * 10) / 10,
        bloodPressure: {
            systolic: Math.round(systolic),
            diastolic: Math.round(diastolic),
        },
        spO2: Math.round(spO2 * 10) / 10,
        temperature: Math.round(temperature * 100) / 100,
        respiratoryRate: Math.round(respiratoryRate),
        steps,
        calories: Math.round(calories * 10) / 10,
        timestamp: new Date().toISOString(),
    };
}


export function generateHistoricalData(days: number = 7): HealthRecord[] {
    const records: HealthRecord[] = [];
    const now = Date.now();
    const msPerDay = 24 * 60 * 60 * 1000;
    const intervalMs = 2 * 60 * 1000;
    const pointsPerDay = Math.floor(msPerDay / intervalMs);

    let prev: VitalSigns | null = null;

    for (let d = days - 1; d >= 0; d--) {
        const dayStart = now - d * msPerDay;
        if (prev) {
            prev = Object.assign({}, prev, { steps: 0, calories: 0 });
        }

        for (let p = 0; p < pointsPerDay; p++) {
            const ts = new Date(dayStart + p * intervalMs);
            const vitals = generateVitalSigns(prev);
            prev = vitals;

            const dateStr = ts.toISOString().split('T')[0];
            records.push({
                ...vitals,
                timestamp: ts.toISOString(),
                id: `rec_${dateStr}_${String(p).padStart(4, '0')}`,
                date: dateStr,
            });
        }
    }

    return records;
}

export function generateRecentReadings(count: number = 60): VitalSigns[] {
    const readings: VitalSigns[] = [];
    let prev: VitalSigns | null = null;
    const now = Date.now();

    for (let i = count - 1; i >= 0; i--) {
        const vitals = generateVitalSigns(prev);
        prev = vitals;
        readings.push({
            ...vitals,
            timestamp: new Date(now - i * 2000).toISOString(),
        });
    }

    return readings;
}
