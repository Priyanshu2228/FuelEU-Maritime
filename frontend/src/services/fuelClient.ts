import { createFuelRecord as apiCreate, getFuelSummary as apiSummary, getFuelRecords as apiGetAll } from '../adapters/http/fuelApi';
import { FuelRecord } from '../domain/models/FuelRecord';

export async function getAllFuelRecords(): Promise<FuelRecord[]> {
  const data = await apiGetAll();
  // normalize dates
  return data.map((d: any) => ({ ...d, date: d.date ? new Date(d.date) : new Date() }));
}

export async function createFuelRecord(record: Partial<FuelRecord> & { fuelType: string; amount: number; }) {
  const payload = {
    fuelType: record.fuelType,
    amount: (record as any).amount ?? record.quantity,
    emission: (record as any).emission,
    vesselName: record.vesselName,
    routeId: (record as any).routeId,
  };
  return await apiCreate(payload);
}

export async function getFuelSummary() {
  return await apiSummary();
}

export default {
  getAllFuelRecords,
  createFuelRecord,
  getFuelSummary,
};
