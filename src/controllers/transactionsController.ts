import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { transactionService } from "../services/transactionsService";

export class TransactionsController {
  static async transactAsset(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await transactionService.transactAsset(req.userId, req.body.buyAsset, req.body.sellAsset);
      res.status(201).send("Transaction processed");
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("An unknown error occurred");
      }
    }
  }
}
