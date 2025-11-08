import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function connectToDatabase(): Promise<void> {
    try {
        await prisma.$connect();
        console.log('Database connected');
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
}
export default prisma;
