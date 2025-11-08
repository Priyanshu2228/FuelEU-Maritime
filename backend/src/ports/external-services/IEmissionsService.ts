export interface IEmissionsService {
    calculateEmissions(fuelType: string, quantity: number): Promise<number>;
    getEmissionFactors(): Promise<Record<string, number>>;
}
