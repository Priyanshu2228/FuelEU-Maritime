import { IFuelRepository, CreateFuelRecordDTO } from '../../ports/repositories/IFuelRepository';

export class CreateFuelRecord {
    constructor(private fuelRepository: IFuelRepository) {}

    async execute(data: CreateFuelRecordDTO): Promise<any> {
        // Delegate to repository which returns the created record model
        return await this.fuelRepository.save(data);
    }
}