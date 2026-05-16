import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthRepository } from '../repositories/auth.repository';
import { IRegisterInput, ILoginInput, IUserPayload } from '../interfaces';
import { AppError, UnauthorizedError } from '../errors';
import { env } from '../config';

export class AuthService {
  private authRepo: AuthRepository;

  constructor() {
    this.authRepo = new AuthRepository();
  }

  async register(input: IRegisterInput) {
    const existing = await this.authRepo.findByEmail(input.email);
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const user = await this.authRepo.create(input);
    const token = this.generateToken({ userId: String(user._id), role: user.role });

    return { user: user.toJSON(), token };
  }

  async login(input: ILoginInput) {
    const user = await this.authRepo.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken({ userId: String(user._id), role: user.role });

    return { user: user.toJSON(), token };
  }

  async getMe(userId: string) {
    const user = await this.authRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user.toJSON();
  }

  private generateToken(payload: IUserPayload): string {
    const options: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as string & SignOptions['expiresIn'],
    };
    return jwt.sign(payload, env.JWT_SECRET, options);
  }
}
