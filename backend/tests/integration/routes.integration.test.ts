import request from 'supertest';
import app from '../../src/adapters/http/expressApp';

describe('Routes API', () => {
  test('GET /api/routes returns 200 and array', async () => {
    const res = await request(app).get('/api/routes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
