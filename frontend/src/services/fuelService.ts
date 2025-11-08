import { FuelRecord } from '../domain/models/FuelRecord';
import { FuelRepository } from '../ports/FuelRepository';

export class FuelService {
    constructor(private fuelRepository: FuelRepository) {}

    async createFuelRecord(record: FuelRecord): Promise<FuelRecord> {
        return await this.fuelRepository.save(record);
    }

    async getFuelRecords(): Promise<FuelRecord[]> {
        return await this.fuelRepository.findAll();
    }

    async getFuelRecordById(id: string): Promise<FuelRecord | null> {
        return await this.fuelRepository.findById(id);
    }

    async deleteFuelRecord(id: string): Promise<void> {
        await this.fuelRepository.delete(id);
    }
}