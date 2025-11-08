import express from 'express';
import { json } from 'body-parser';
import { createServer } from './adapters/http/expressApp';
import { connectToDatabase } from './infra/db/client';
import logger from './infra/logger/logger';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(json());

createServer(app);

connectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
            logger.info(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        logger.error('Database connection failed:', error);
        process.exit(1);
    });
