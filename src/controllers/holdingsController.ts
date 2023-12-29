import { Request, Response } from "express";
import { validationResult } from "express-validator";
import HoldingsService from "../services/holdingsService";
import { supportedAssets } from "../config";

export class HoldingsController {
  holdingsService: HoldingsService;

  constructor(holdingServiceInstance: HoldingsService) {
    this.holdingsService = holdingServiceInstance;
  }

  /**
   * @swagger
   * /api/info/supported-assets:
   *   get:
   *     summary: Get a list of supported assets
   *     tags: [Portfolio]
   *     responses:
   *       200:
   *         description: List of supported assets
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   asset: { type: string, example: 'BTC' }
   *                   description: { type: string, example: 'A digital currency' }
   *       500: { description: Server error }
  */
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

  /**
   * @swagger
   * /api/portfolio:
   *   post:
   *     summary: Add a new asset holding
   *     tags: [Portfolio]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               asset: { type: string, example: 'BTC' }
   *               quantity: { type: number, example: 1 }
   *     responses:
   *       201: { description: Holding added successfully }
   *       400: { description: Validation error }
   *       401: { description: Unauthorized access (missing or invalid JWT token) }
   *       500: { description: Server error }
  */
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

  /**
   * @swagger
   * /api/portfolio/{asset}:
   *   put:
   *     summary: Update an existing asset holding
   *     tags: [Portfolio]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: asset
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               quantity: { type: number, example: 2 }
   *     responses:
   *       200: { description: Holding updated successfully }
   *       400: { description: Validation error }
   *       500: { description: Server error }
  */
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

  /**
   * @swagger
   * /api/portfolio/{asset}:
   *   delete:
   *     summary: Remove an existing asset holding
   *     tags: [Portfolio]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: asset
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200: { description: Holding removed successfully }
   *       500: { description: Server error }
  */
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

  /**
   * @swagger
   * /api/portfolio:
   *   get:
   *     summary: Get all holdings of a user's portfolio
   *     tags: [Portfolio]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all portfolio holdings
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   asset: { type: string, example: 'BTC' }
   *                   quantity: { type: number, example: 2 }
   *       500: { description: Server error }
  */
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
