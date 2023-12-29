import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/userRepository';

const JWT_SECRET = process.env.JWT_SECRET || "TEST";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

class MainService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  createUser = async (email: string, password: string): Promise<string> => {
    const existingUser = await this.userRepository.findByEmail(email);
    if (!!existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({ email, password: hashedPassword });
    const token = jwt.sign({ userId: user.insertedId.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    return token;
  }

  authenticateUser = async (email: string, password: string): Promise<string> => {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    return token;
  }
}

export default MainService;
