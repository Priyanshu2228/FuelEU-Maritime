import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function computeComparison() {
    try {
        // First ensure we have a baseline route
        let baseline = await prisma.route.findFirst({ where: { isBaseline: true } });
        
        // If no baseline is set, set R001 as baseline
        if (!baseline) {
            const r001 = await prisma.route.findFirst({ where: { routeId: 'R001' } });
            if (r001) {
                await prisma.route.update({
                    where: { id: r001.id },
                    data: { isBaseline: true }
                });
                baseline = r001;
            }
        }

        if (!baseline) {
            throw new Error('No baseline route available');
        }

        // Get other routes for comparison, without year constraint to see all routes
        const others = await prisma.route.findMany({
            where: {
                NOT: { id: baseline.id }
            }
        });

        const results = others.map((r) => {
            const referenceValue = 89.3368;
            const percentDiff = ((r.ghgIntensity - baseline.ghgIntensity) / baseline.ghgIntensity);
            const compliant = r.ghgIntensity <= referenceValue;
            
            return {
                routeId: r.routeId,
                baseline: {
                    ghgIntensity: baseline.ghgIntensity,
                    year: baseline.year
                },
                comparison: {
                    ghgIntensity: r.ghgIntensity,
                    year: r.year
                },
                percentDiff,
                compliant,
            };
        });

        return {
            baseline: {
                routeId: baseline.routeId,
                ghgIntensity: baseline.ghgIntensity
            },
            results
        };
    } catch (error) {
        console.error('Error in computeComparison:', error);
        throw error;
    }
}
