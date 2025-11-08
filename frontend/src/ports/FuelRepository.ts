export interface FuelRepository {
    getAllFuelRecords(): Promise<FuelRecord[]>;
    getFuelRecordById(id: string): Promise<FuelRecord | null>;
    createFuelRecord(record: FuelRecord): Promise<FuelRecord>;
    updateFuelRecord(id: string, record: FuelRecord): Promise<FuelRecord | null>;
    deleteFuelRecord(id: string): Promise<boolean>;
}
