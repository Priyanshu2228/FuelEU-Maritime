export interface CreateFuelRecordDTO {
    fuelType: string;
    amount: number;
    emission?: { value: number; unit?: string };
    vesselName?: string;
    routeId?: number;
}

export interface FuelRecordModel {
    id: number | string;
    fuelType: string;
    quantity: number;
    date: Date | string;
    vesselName?: string | null;
    emission?: { id?: number; value: number; unit?: string } | null;
    routeId?: number | null;
}

export interface IFuelRepository {
    // save accepts DTO and returns created model
    save(fuelRecord: CreateFuelRecordDTO): Promise<FuelRecordModel>;
    getAllFuelRecords(): Promise<FuelRecordModel[]>;

    // legacy CRUD (optional)
    createFuelRecord?(fuelRecord: any): Promise<void>;
    getFuelRecords?(): Promise<any[]>;
    getFuelRecordById?(id: string): Promise<any | null>;
    updateFuelRecord?(id: string, fuelRecord: any): Promise<void>;
    deleteFuelRecord?(id: string): Promise<void>;
}
