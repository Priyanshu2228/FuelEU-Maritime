// test-prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Prisma DB connection OK');

    // Optional: fetch some data to verify schema
    const fuelRecords = await prisma.fuelRecord.findMany({
      include: { emissions: true },
      take: 3, // just to limit output
    });
    console.log('Sample Fuel Records:', fuelRecords);
  } catch (e) {
    console.error('❌ Prisma DB connection FAILED:', e instanceof Error ? e.message : e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
