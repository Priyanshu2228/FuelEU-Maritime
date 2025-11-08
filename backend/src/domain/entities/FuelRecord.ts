export interface FuelRecord {
    id: string;
    vesselId: string;
    fuelType: string;
    quantity: number;
    date: Date;
    emissions: number; // This could be a reference to an Emission value object
}
