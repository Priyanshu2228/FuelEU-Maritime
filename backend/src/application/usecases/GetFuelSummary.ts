import { IFuelRepository } from '../../ports/repositories/IFuelRepository';

export class GetFuelSummary {
    constructor(private fuelRepository: IFuelRepository) {}

    async execute(): Promise<any> {
        const fuelRecords = await this.fuelRepository.getAllFuelRecords();
        const totalFuel = fuelRecords.reduce((acc, record) => acc + (record.quantity ?? 0), 0);
        const totalEmissions = fuelRecords.reduce((acc, record) => acc + (record.emission?.value ?? 0), 0);

        return {
            totalFuel,
            totalEmissions,
            count: fuelRecords.length,
        };
    }
}