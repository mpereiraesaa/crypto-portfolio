import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/userRepository';

const JWT_SECRET = process.env.JWT_SECRET || "TEST";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

class MainService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(email: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.create({ email, password: hashedPassword });
  }

  async authenticateUser(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    return token;
  }
}

export const mainService = new MainService();
