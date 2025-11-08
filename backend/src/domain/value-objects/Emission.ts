export class Emission {
    private readonly value: number;

    constructor(value: number) {
        if (value < 0) {
            throw new Error("Emission value cannot be negative");
        }
        this.value = value;
    }

    public getValue(): number {
        return this.value;
    }

    public toString(): string {
        return `${this.value} gCO2/kWh`;
    }
}
