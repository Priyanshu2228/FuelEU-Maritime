import { PrismaClient } from '@prisma/client';
import { IFuelRepository, CreateFuelRecordDTO, FuelRecordModel } from '../../ports/repositories/IFuelRepository';

export class PrismaFuelRepository implements IFuelRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma ?? new PrismaClient();
  }

  // Create / Save a fuel record
  async save(fuelRecord: CreateFuelRecordDTO): Promise<FuelRecordModel> {
    // Basic emission factors (placeholder values) — kg CO2 per unit of fuel amount
    const EMISSION_FACTORS: Record<string, number> = {
      HFO: 3.114,
      MDO: 3.206,
      DIESEL: 3.206,
      LNG: 2.75,
      DEFAULT: 3.0,
    };

    // If caller didn't supply an emission, estimate one using a simple factor
    const emissionToCreate = fuelRecord.emission
      ? { value: fuelRecord.emission.value, unit: fuelRecord.emission.unit || 'kgCO2' }
      : (() => {
          const key = (fuelRecord.fuelType ?? '').toString().toUpperCase();
          const factor = EMISSION_FACTORS[key] ?? EMISSION_FACTORS.DEFAULT;
          return { value: (fuelRecord.amount ?? 0) * factor, unit: 'kgCO2' };
        })();

    const created = await this.prisma.fuelRecord.create({
      data: {
        fuelType: fuelRecord.fuelType,
        quantity: fuelRecord.amount,
        date: new Date(),
        emissions: { create: emissionToCreate },
      },
      include: { emissions: true }, // plural must match Prisma schema
    });

    return {
      id: created.id,
      fuelType: created.fuelType,
      quantity: created.quantity,
      date: created.date,
      emission: created.emissions
        ? { id: created.emissions.id, value: created.emissions.value, unit: created.emissions.unit }
        : null,
    };
  }

  // Retrieve all fuel records
  async getAllFuelRecords(): Promise<FuelRecordModel[]> {
    const records = await this.prisma.fuelRecord.findMany({ include: { emissions: true } });
    return records.map((r) => ({
      id: r.id,
      fuelType: r.fuelType,
      quantity: r.quantity,
      date: r.date,
      emission: r.emissions
        ? { id: r.emissions.id, value: r.emissions.value, unit: r.emissions.unit }
        : null,
    }));
  }

  // Retrieve single fuel record by ID
  async getFuelRecordById(id: string): Promise<FuelRecordModel | null> {
    const r = await this.prisma.fuelRecord.findUnique({
      where: { id: Number(id) },
      include: { emissions: true },
    });

    if (!r) return null;

    return {
      id: r.id,
      fuelType: r.fuelType,
      quantity: r.quantity,
      date: r.date,
      emission: r.emissions
        ? { id: r.emissions.id, value: r.emissions.value, unit: r.emissions.unit }
        : null,
    };
  }

  // Update fuel record
  async updateFuelRecord(id: string, fuelRecord: CreateFuelRecordDTO): Promise<void> {
    await this.prisma.fuelRecord.update({
      where: { id: Number(id) },
      data: { fuelType: fuelRecord.fuelType, quantity: fuelRecord.amount },
    });
  }

  // Delete fuel record (delete related emission first)
  async deleteFuelRecord(id: string): Promise<void> {
    await this.prisma.emission.deleteMany({ where: { fuelRecordId: Number(id) } });
    await this.prisma.fuelRecord.delete({ where: { id: Number(id) } });
  }
}
