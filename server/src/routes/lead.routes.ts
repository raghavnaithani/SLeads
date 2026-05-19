import { Router } from 'express';
import {
  getLeads,
  getLeadsExportCsv,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/lead.controller';
import { authMiddleware, validate } from '../middlewares';
import { roleMiddleware } from '../middlewares/role.middleware';
import { UserRole } from '../interfaces';
import { validateQuery } from '../middlewares/validateQuery.middleware';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../validators/lead.validator';

const router = Router();

// All lead routes require authentication
router.use(authMiddleware);

// CRUD
router.get('/', validateQuery(leadQuerySchema), getLeads);
router.get('/export/csv', getLeadsExportCsv);
router.get('/:id', getLeadById);
router.post('/', validate(createLeadSchema), createLead);
router.patch('/:id', validate(updateLeadSchema), updateLead);
router.delete('/:id', roleMiddleware(UserRole.ADMIN), deleteLead);

export default router;
