import request from 'supertest';
import app from '../../adapters/http/expressApp'; 
import prisma from '../../infra/db/client';       

describe('Fuel Integration Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a new fuel record', async () => {
        const response = await request(app)
            .post('/api/fuel')
            .send({
                fuelType: 'Diesel',
                amount: 100,
                emission: {
                    value: 2.68,
                    unit: 'kgCO2/l'
                }
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.fuelType).toBe('Diesel');
    });

    it('should retrieve fuel summary', async () => {
        const response = await request(app).get('/api/fuel/summary');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('totalFuel');
        expect(response.body).toHaveProperty('totalEmissions');
    });
});
