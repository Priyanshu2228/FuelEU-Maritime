import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    db: {
        url: process.env.DATABASE_URL || 'postgres://localhost:5432/fueleu_maritime',
    },
    logger: {
        level: process.env.LOG_LEVEL || 'info',
    },
    // Add other configuration settings as needed
};

export default config;
