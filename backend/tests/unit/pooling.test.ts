import { createPool } from '../../src/application/usecases/Pooling';

describe('Pooling use-case', () => {
  test('createPool allocates surplus to deficits', async () => {
    const members = [
      { shipId: 'S1', cb_before: 1000 },
      { shipId: 'S2', cb_before: -400 },
      { shipId: 'S3', cb_before: -200 },
    ];

    const res = await createPool('testpool', 2024, members);
    expect(res).toHaveProperty('pool');
    expect(res.members.length).toBe(3);
    // verify cb_after sums to same total
    const sumBefore = members.reduce((s, m) => s + m.cb_before, 0);
    const sumAfter = res.members.reduce((s: number, m: any) => s + m.cb_after, 0);
    expect(sumBefore).toBeCloseTo(sumAfter);
  });
});
