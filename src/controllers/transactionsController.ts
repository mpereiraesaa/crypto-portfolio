import { Request, Response } from "express";
import { validationResult } from "express-validator";
import TransactionService from "../services/transactionsService";
import { TRANSACTION_TYPE } from "../config/types";

export class TransactionsController {
  transactionService: TransactionService;
  
  constructor(transactionServiceInstance: TransactionService) {
    this.transactionService = transactionServiceInstance;
  }

  /**
   * @swagger
   * /api/transactions/place-transaction:
   *   post:
   *     summary: Place a transaction (buy or sell)
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - type
   *               - asset
   *               - quantity
   *             properties:
   *               type: 
   *                 type: string
   *                 enum: [BUY, SELL]
   *                 example: BUY
   *               asset: 
   *                 type: string
   *                 example: 'BTC'
   *               quantity: 
   *                 type: number
   *                 example: 1
   *     responses:
   *       201: 
   *         description: Transaction processed successfully
   *       400: 
   *         description: Validation error
   *       500: 
   *         description: Server error or transaction failure
  */
  placeTransaction = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (req.body.type == TRANSACTION_TYPE.BUY) {
        await this.transactionService.placeBuy(req.userId, req.body.asset, req.body.quantity);      
      } else {
        await this.transactionService.placeSell(req.userId, req.body.asset, req.body.quantity);      
      }
      return res.status(201).send("Transaction processed");
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).send(error.message);
      } else {
        return res.status(500).send("An unknown error occurred");
      }
    }
  }
}
