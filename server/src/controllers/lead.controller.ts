import { Request, Response } from 'express';
import { LeadService } from '../services/lead.service';
import { ApiResponse, asyncHandler } from '../utils';
import { AuthenticatedRequest } from '../middlewares';
import { ILeadFilters } from '../interfaces';

const leadService = new LeadService();

export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const filters = req.query as unknown as ILeadFilters;
  const result = await leadService.getLeads(filters);
  ApiResponse.success(res, result.leads, 'Leads fetched successfully', 200, result.pagination);
});

export const getLeadById = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadService.getLeadById(req.params.id as string);
  ApiResponse.success(res, lead, 'Lead fetched successfully');
});

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as AuthenticatedRequest).user;
  const lead = await leadService.createLead(req.body, userId);
  ApiResponse.created(res, lead, 'Lead created successfully');
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const { userId, role } = (req as AuthenticatedRequest).user;
  const lead = await leadService.updateLead(req.params.id as string, req.body, userId, role);
  ApiResponse.success(res, lead, 'Lead updated successfully');
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  await leadService.deleteLead(req.params.id as string);
  ApiResponse.success(res, null, 'Lead deleted successfully');
});
