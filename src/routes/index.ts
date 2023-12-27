import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { HoldingsController } from "../controllers/holdingsController";
import { MainController } from "../controllers/mainController";
import { TransactionsController } from "../controllers/transactionsController";
import {
  ONBOARDING_RULES,
  SIGNIN_RULES,
  ADD_ASSET_HOLDING_RULES,
  UPDATE_ASSET_HOLDING_RULES,
  REMOVE_ASSET_HOLDING_RULES,
  TRANSACTION_VALIDATION_RULES
} from "./validation";

const baseRouter = express.Router();
const portfolioRouter = express.Router();
const transactionRouter = express.Router();

portfolioRouter.use(authMiddleware);
transactionRouter.use(authMiddleware);

baseRouter.post("/onboarding", ONBOARDING_RULES, MainController.createUser);
baseRouter.post("/signin", SIGNIN_RULES, MainController.authenticateUser);
baseRouter.get("/supported-assets", HoldingsController.getSupportedAssets);

portfolioRouter.post("/", ADD_ASSET_HOLDING_RULES, HoldingsController.addAssetHolding);
portfolioRouter.put("/:asset", UPDATE_ASSET_HOLDING_RULES, HoldingsController.updateAssetHolding);
portfolioRouter.delete("/:asset", REMOVE_ASSET_HOLDING_RULES, HoldingsController.removeAssetHolding);
portfolioRouter.get("/", HoldingsController.getPortfolioHoldings);

transactionRouter.post("/transact", TRANSACTION_VALIDATION_RULES, TransactionsController.transactAsset);

export { portfolioRouter, transactionRouter, baseRouter };
