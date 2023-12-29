import { Request, Response } from "express";
import { validationResult } from "express-validator";
import HoldingsService from "../services/holdingsService";
import { supportedAssets } from "../config";

export class HoldingsController {
  holdingsService: HoldingsService;

  constructor(holdingServiceInstance: HoldingsService) {
    this.holdingsService = holdingServiceInstance;
  }
  getSupportedAssets = (req: Request, res: Response) => {
    try {
      const assets = supportedAssets();
      res.status(200).json(assets);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("An unknown error occurred");
      }
    }
  }
  addAssetHolding = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await this.holdingsService.addHolding(req.userId, req.body.asset, req.body.quantity);
      return res.status(201).send({ "message": "Holding added", "asset": req.body.asset });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).send(error.message);
      } else {
        return res.status(500).send("An unknown error occurred");
      }
    }
  }

  updateAssetHolding = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const asset = req.params.asset;
      await this.holdingsService.updateHolding(req.userId, asset, req.body.quantity);
      return res.status(200).send({ "message": "Holding updated", asset });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).send(error.message);
      } else {
        return res.status(500).send("An unknown error occurred");
      }
    }
  }

  removeAssetHolding = async (req: Request, res: Response) => {
    try {
      const asset = req.params.asset;
      await this.holdingsService.removeHolding(req.userId, asset);
      return res.status(200).send({ "message": "Holding removed" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).send(error.message);
      } else {
        return res.status(500).send("An unknown error occurred");
      }
    }
  }

  getPortfolioHoldings = async (req: Request, res: Response) => {
    try {
      const holdings = await this.holdingsService.getHoldings(req.userId);
      return res.status(200).json(holdings);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).send(error.message);
      } else {
        return res.status(500).send("An unknown error occurred");
      }
    }
  }
}
