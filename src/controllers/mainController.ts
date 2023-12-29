import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import MainService from '../services/mainService';

export class MainController {
  mainService: MainService;

  constructor(mainServiceInstance: MainService) {
    this.mainService = mainServiceInstance;
  }

  /**
   * @swagger
   * /api/user/onboarding:
   *   post:
   *     summary: Create a new user and return a JWT token
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email: { type: string, format: email, example: user@example.com }
   *               password: { type: string, example: Password123 }
   *     responses:
   *       201:
   *         description: User created, JWT token returned
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token: { type: string, description: JWT token for authentication, example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... }
   *       400: { description: Validation error }
   *       500: { description: Server error }
  */
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

  /**
   * @swagger
   * /api/user/sign-in:
   *   post:
   *     summary: Authenticate a user and return a JWT token
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email: { type: string, format: email, example: user@example.com }
   *               password: { type: string, example: Password123 }
   *     responses:
   *       200:
   *         description: Authentication successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token: { type: string, description: JWT token for authentication, example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... }
   *       400: { description: Validation error }
   *       500: { description: Server error }
  */
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
