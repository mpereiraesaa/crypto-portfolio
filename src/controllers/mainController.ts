import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import MainService from '../services/mainService';

export default class MainController {
  static async createUser(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const mainService = new MainService();
      const token = await mainService.createUser(email, password);
      res.status(201).json({ token });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('An unknown error occurred');
        }
    }
  }

  static async authenticateUser(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const mainService = new MainService();
      const token = await mainService.authenticateUser(email, password);
      res.json({ token });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('An unknown error occurred');
        }
    }
  }
}
