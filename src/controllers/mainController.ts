import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import MainService from '../services/mainService';

export class MainController {
  mainService: MainService;

  constructor(mainServiceInstance: MainService) {
    this.mainService = mainServiceInstance;
  }
  createUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const token = await this.mainService.createUser(email, password);
      return res.status(201).json({ token });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).send(error.message);
      } else {
        return res.status(500).send('An unknown error occurred');
      }
    }
  }
  authenticateUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const token = await this.mainService.authenticateUser(email, password);
      return res.status(200).json({ token });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).send(error.message);
      } else {
        return res.status(500).send('An unknown error occurred');
      }
    }
  }
}
