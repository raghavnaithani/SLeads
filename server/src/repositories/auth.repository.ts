import { User, UserDocument } from '../models/user.model';

export class AuthRepository {
  async findByEmail(email: string): Promise<UserDocument | null> {
    return User.findOne({ email }).select('+password');
  }

  async findById(id: string): Promise<UserDocument | null> {
    return User.findById(id);
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<UserDocument> {
    return User.create(data);
  }
}
