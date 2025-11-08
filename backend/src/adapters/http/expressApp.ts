import { Express, json, urlencoded } from 'express';
import cors from 'cors';
import fuelRouter from '../controllers/fuelRouter';
import routesRouter from '../controllers/routesRouter';
import complianceController from '../controllers/complianceController';
import bankingRouter from '../controllers/bankingRouter';
import poolsRouter from '../controllers/poolsRouter';

/**
 * Mount routers on the provided Express app instance.
 * This named export matches server bootstrap which imports createServer.
 */
export function createServer(app: Express): void {
		// Middleware
		app.use(json());
		app.use(urlencoded({ extended: true }));
		// Enable CORS for frontend (allow all origins in dev)
		app.use(cors({ origin: true }));

	// Debug logs to confirm routers are defined
	console.log('fuelRouter is', typeof fuelRouter);

	// Mount fuel router
	if (fuelRouter) {
		app.use('/api/fuel', fuelRouter);
	} else {
		console.warn('fuelRouter is undefined — /api/fuel not mounted');
	}

	// Mount routes router
	if (routesRouter) {
		app.use('/api/routes', routesRouter);
	} else {
		console.warn('routesRouter is undefined — /api/routes not mounted');
	}

	// Mount compliance endpoints
	if (complianceController) {
		app.get('/api/compliance/cb', complianceController.getCB);
		app.get('/api/compliance/adjusted-cb', complianceController.getAdjustedCB);
	}

	// Mount banking and pools
	if (bankingRouter) app.use('/api/banking', bankingRouter);
	if (poolsRouter) app.use('/api/pools', poolsRouter);
}

// Also export a default app instance for tests/tools that import it directly
const defaultApp = ((): Express => {
	const a = require('express')();
	createServer(a);
	return a;
})();

export default defaultApp;
