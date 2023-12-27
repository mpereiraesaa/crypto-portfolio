import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { holdingsService } from "../services/holdingsService";

export class HoldingsController {
  static async getSupportedAssets(req: Request, res: Response) {
    try {
      const assets = await holdingsService.getSupportedAssets();
      res.status(200).json(assets);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("An unknown error occurred");
      }
    }
  }
  static async addAssetHolding(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      await holdingsService.addHolding(req.userId, req.body.asset, req.body.quantity);
      res.status(201).send({ "message": "Holding added", "asset": req.body.asset });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("An unknown error occurred");
      }
    }
  }

  static async updateAssetHolding(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const asset = req.params.asset;
      await holdingsService.updateHolding(req.userId, asset, req.body.quantity);
      res.status(200).send({ "message": "Holding updated", asset });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("An unknown error occurred");
      }
    }
  }

  static async removeAssetHolding(req: Request, res: Response) {
    try {
      const asset = req.params.asset;
      await holdingsService.removeHolding(req.userId, asset);
      res.status(200).send({ "message": "Holding removed" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("An unknown error occurred");
      }
    }
  }

  static async getPortfolioHoldings(req: Request, res: Response) {
    try {
      const holdings = await holdingsService.getHoldings(req.userId);
      res.status(200).json(holdings);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("An unknown error occurred");
      }
    }
  }
}
