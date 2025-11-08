import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const fuelApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Backend exposes /api/fuel (POST) and /api/fuel/summary (GET)
export const createFuelRecord = async (fuelRecord: {
    fuelType: string;
    amount: number;
    emission?: { value: number; unit?: string };
    vesselName?: string;
    routeId?: number;
}) => {
    const res = await fuelApi.post('/fuel', fuelRecord);
    return res.data;
};

export const getFuelSummary = async () => {
    const res = await fuelApi.get('/fuel/summary');
    return res.data;
};

export const getFuelRecords = async () => {
    // For compatibility, try GET /fuel which returns list
    const res = await fuelApi.get('/fuel');
    return res.data;
};

// Add more API methods as needed
