import { User } from '../models/user.model';
import { UserRole } from '../interfaces';

export const bootstrapAdmin = async (): Promise<void> => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.info('No users found in database. Seeding default administrator...');
      await User.create({
        name: 'System Administrator',
        email: 'admin@sleads.com',
        password: 'Password123',
        role: UserRole.ADMIN,
      });
      console.info('Default administrator seeded successfully: admin@sleads.com / Password123');
    }
  } catch (error) {
    console.error('Error during administrator bootstrapping:', error);
  }
};
