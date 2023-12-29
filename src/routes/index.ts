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

export const setupRoutes = (
  mainController: MainController,
  holdingsController: HoldingsController,
  transactionsController: TransactionsController
  ) => {
    const baseRouter = express.Router();
    const portfolioRouter = express.Router();
    const transactionRouter = express.Router();

    portfolioRouter.use(authMiddleware);
    transactionRouter.use(authMiddleware);

    baseRouter.post("/user/onboarding", ONBOARDING_RULES, mainController.createUser);
    baseRouter.post("/user/sign-in", SIGNIN_RULES, mainController.authenticateUser);
    baseRouter.get("/info/supported-assets", holdingsController.getSupportedAssets);
    
    portfolioRouter.post("/", ADD_ASSET_HOLDING_RULES, holdingsController.addAssetHolding);
    portfolioRouter.put("/:asset", UPDATE_ASSET_HOLDING_RULES, holdingsController.updateAssetHolding);
    portfolioRouter.delete("/:asset", REMOVE_ASSET_HOLDING_RULES, holdingsController.removeAssetHolding);
    portfolioRouter.get("/", holdingsController.getPortfolioHoldings);
    
    transactionRouter.post("/place-transaction", TRANSACTION_VALIDATION_RULES, transactionsController.placeTransaction);

    return { portfolioRouter, transactionRouter, baseRouter };
};
