import { z } from 'zod';
import { LEAD_STATUSES, LEAD_SOURCES, SORT_OPTIONS } from '../constants';

export const createLeadSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address'),
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES, { required_error: 'Source is required' }),
});

export const updateLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
});

export const leadQuerySchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  search: z.string().trim().optional(),
  sort: z.enum(SORT_OPTIONS).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});
