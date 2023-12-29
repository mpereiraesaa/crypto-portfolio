import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import UserRepository from "./repositories/userRepository";
import HoldingRepository from "./repositories/holdingRepository";
import TransactionRepository from "./repositories/transactionRepository";
import MainService from "./services/mainService";
import HoldingsService from "./services/holdingsService";
import TransactionService from "./services/transactionsService";
import { MainController } from "./controllers/mainController";
import { HoldingsController } from "./controllers/holdingsController";
import { TransactionsController } from "./controllers/transactionsController";
import { setupRoutes } from "./routes";
import { BASE_LIMITS, TRANSACTION_LIMITS } from "./rateLimits";
import { databaseConnection, web3Connection } from "./config";
import PriceOracleHandler from "./contracts/price";
import UniswapHandler from "./contracts/uniswap";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

databaseConnection()
    .then((db) => {
        const web3 = web3Connection();
        const userRepository = new UserRepository(db);
        const holdingRepository = new HoldingRepository(db);
        const transactionRepository = new TransactionRepository(db);

        const priceOracle = new PriceOracleHandler(web3);
        const uniswapHandler = new UniswapHandler(web3);

        const mainService = new MainService(userRepository);
        const holdingsService = new HoldingsService(holdingRepository, priceOracle);
        const transactionService = new TransactionService(
            transactionRepository,
            holdingRepository,
            priceOracle,
            uniswapHandler
        );

        const mainController = new MainController(mainService);
        const holdingsController = new HoldingsController(holdingsService);
        const transactionsController = new TransactionsController(transactionService);

        const { baseRouter, portfolioRouter, transactionRouter } = setupRoutes(
            mainController,
            holdingsController,
            transactionsController
        );

        app.use("/api/user", BASE_LIMITS, baseRouter);
        app.use("/api/portfolio", BASE_LIMITS, portfolioRouter);
        app.use("/api/transactions", TRANSACTION_LIMITS, transactionRouter);

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
        process.exit(1);
    });

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

export default app;
