import express from 'express';
import { createServer } from './adapters/http/expressApp'; // fix import path

const app = express();
const PORT = process.env.PORT || 3000;

createServer(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
