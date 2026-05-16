import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/lead.controller';
import { authMiddleware, validate, roleMiddleware } from '../middlewares';
import { validateQuery } from '../middlewares/validateQuery.middleware';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../validators/lead.validator';
import { UserRole } from '../interfaces';

const router = Router();

// All lead routes require authentication
router.use(authMiddleware);

// CSV export (before :id to avoid conflict)
router.get('/export/csv', validateQuery(leadQuerySchema), exportLeads);

// CRUD
router.get('/', validateQuery(leadQuerySchema), getLeads);
router.get('/:id', getLeadById);
router.post('/', validate(createLeadSchema), createLead);
router.patch('/:id', validate(updateLeadSchema), updateLead);
router.delete('/:id', roleMiddleware(UserRole.ADMIN), deleteLead);

export default router;
