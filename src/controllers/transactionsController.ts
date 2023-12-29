import { Request, Response } from "express";
import { validationResult } from "express-validator";
import TransactionService from "../services/transactionsService";
import { TRANSACTION_TYPE } from "../config/types";

export class TransactionsController {
  transactionService: TransactionService;
  
  constructor(transactionServiceInstance: TransactionService) {
    this.transactionService = transactionServiceInstance;
  }
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
