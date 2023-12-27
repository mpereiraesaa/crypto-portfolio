import express from 'express';
import { body } from "express-validator";
import { authMiddleware } from "./middlewares/auth";
import PortfolioController from './controllers/portfolioController';
import TransactionController from './controllers/transactionController';
import MainController from './controllers/mainController';

const ONBOARDING_RULES = [body('email').isEmail(), body('password').isLength({ min: 6 })];
const SIGNIN_RULES = [body('email').isEmail(), body('password').exists()];

const baseRouter = express.Router();
const portfolioRouter = express.Router();
const transactionRouter = express.Router();

portfolioRouter.use(authMiddleware);
transactionRouter.use(authMiddleware);

baseRouter.post("/onboarding", ONBOARDING_RULES, MainController.createUser);
baseRouter.post("/signin", SIGNIN_RULES, MainController.authenticateUser);

portfolioRouter.post('/', PortfolioController.addAssetHolding);
portfolioRouter.put('/:asset', PortfolioController.updateAssetHolding);
portfolioRouter.delete('/:asset', PortfolioController.removeAssetHolding);
portfolioRouter.get('/', PortfolioController.getPortfolioHoldings);

transactionRouter.post('/buy', TransactionController.buyAsset);
transactionRouter.post('/sell', TransactionController.sellAsset);

export { portfolioRouter, transactionRouter, baseRouter };
