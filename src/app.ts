import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { portfolioRouter, transactionRouter } from './routes';
import { BASE_LIMITS, TRANSACTION_LIMITS } from "./rateLimits";
import { connectToDatabase } from "./config";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/portfolio', BASE_LIMITS, portfolioRouter);
app.use('/api/transactions', TRANSACTION_LIMITS, transactionRouter);

connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('Database connection failed:', error);
    process.exit(1);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
