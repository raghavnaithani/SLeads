import { Router } from 'express';
import { authMiddleware } from '../middlewares';
import { roleMiddleware } from '../middlewares/role.middleware';
import { UserRole } from '../interfaces';
import { User } from '../models/user.model';
import { ApiResponse } from '../utils';

const router = Router();

// All user routes require authentication and Admin role
router.use(authMiddleware, roleMiddleware(UserRole.ADMIN));

// Get all users
router.get('/', async (_req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    ApiResponse.success(res, users, 'Users fetched successfully');
  } catch (err) {
    next(err);
  }
});

// Update a user's role
router.patch('/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    if (role !== UserRole.ADMIN && role !== UserRole.SALES) {
      ApiResponse.error(res, 'Invalid role value', 400);
      return;
    }

    const userIdToUpdate = req.params.id;
    const currentUserId = (req as any).user.userId;

    // Prevent demoting the logged-in admin if they are the only admin
    if (userIdToUpdate === currentUserId && role === UserRole.SALES) {
      const adminCount = await User.countDocuments({ role: UserRole.ADMIN });
      if (adminCount <= 1) {
        ApiResponse.error(res, 'Cannot demote the only remaining administrator', 400);
        return;
      }
    }

    const user = await User.findByIdAndUpdate(
      userIdToUpdate,
      { role },
      { new: true }
    );

    if (!user) {
      ApiResponse.error(res, 'User not found', 404);
      return;
    }

    ApiResponse.success(res, user, `User role updated to ${role} successfully`);
  } catch (err) {
    next(err);
  }
});

// Delete a user
router.delete('/:id', async (req, res, next) => {
  try {
    const userIdToDelete = req.params.id;
    const currentUserId = (req as any).user.userId;

    // Prevent self-deletion
    if (userIdToDelete === currentUserId) {
      ApiResponse.error(res, 'Cannot delete your own administrator account', 400);
      return;
    }

    const user = await User.findByIdAndDelete(userIdToDelete);
    if (!user) {
      ApiResponse.error(res, 'User not found', 404);
      return;
    }

    ApiResponse.success(res, null, 'User deleted successfully');
  } catch (err) {
    next(err);
  }
});

export default router;
