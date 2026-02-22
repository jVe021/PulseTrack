import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { HealthRecord, VitalSigns } from '@/features/health/healthTypes';
import { mockGetHealthHistory, mockGetLatestVitals } from '@/services/mockApi';

export const healthApi = createApi({
    reducerPath: 'healthApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['HealthHistory', 'LatestVitals'],
    endpoints: (builder) => ({
        getHistoricalData: builder.query<HealthRecord[], number>({
            queryFn: async (days) => {
                try {
                    const response = await mockGetHealthHistory(days);
                    return { data: response.data.records };
                } catch (error) {
                    return { error: { status: 500, data: String(error) } };
                }
            },
            providesTags: ['HealthHistory'],
        }),

        /** Fetch the latest vital signs reading. */
        getLatestVitals: builder.query<VitalSigns, void>({
            queryFn: async () => {
                try {
                    const response = await mockGetLatestVitals();
                    return { data: response.data.vitals };
                } catch (error) {
                    return { error: { status: 500, data: String(error) } };
                }
            },
            providesTags: ['LatestVitals'],
        }),
    }),
});

export const { useGetHistoricalDataQuery, useGetLatestVitalsQuery } = healthApi;
