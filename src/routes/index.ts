import express from 'express';
import PortfolioController from './controllers/PortfolioController';
import TransactionController from './controllers/TransactionController';

const portfolioRouter = express.Router();
const transactionRouter = express.Router();

// Rutas del portafolios
portfolioRouter.post('/', PortfolioController.addAssetHolding);
portfolioRouter.put('/:asset', PortfolioController.updateAssetHolding);
portfolioRouter.delete('/:asset', PortfolioController.removeAssetHolding);
portfolioRouter.get('/', PortfolioController.getPortfolioHoldings);

// Rutas de transacciones
transactionRouter.post('/buy', TransactionController.buyAsset);
transactionRouter.post('/sell', TransactionController.sellAsset);

export { portfolioRouter, transactionRouter };
