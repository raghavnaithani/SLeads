import { LeadRepository } from '../repositories/lead.repository';
import { ICreateLeadInput, IUpdateLeadInput, ILeadFilters, UserRole } from '../interfaces';
import { NotFoundError, ForbiddenError } from '../errors';

export class LeadService {
  private leadRepo: LeadRepository;

  constructor() {
    this.leadRepo = new LeadRepository();
  }

  async getLeads(filters: ILeadFilters) {
    return this.leadRepo.findAll(filters);
  }

  async getLeadById(id: string) {
    const lead = await this.leadRepo.findById(id);
    if (!lead) {
      throw new NotFoundError('Lead');
    }
    return lead;
  }

  async createLead(input: ICreateLeadInput, userId: string) {
    return this.leadRepo.create({ ...input, createdBy: userId });
  }

  async updateLead(
    id: string,
    input: IUpdateLeadInput,
    userId: string,
    userRole: UserRole,
  ) {
    const lead = await this.leadRepo.findById(id);
    if (!lead) {
      throw new NotFoundError('Lead');
    }

    // Sales users can only update their own leads
    if (userRole === UserRole.SALES && String(lead.createdBy._id) !== userId) {
      throw new ForbiddenError('You can only update your own leads');
    }

    return this.leadRepo.update(id, input);
  }

  async deleteLead(id: string) {
    const lead = await this.leadRepo.findById(id);
    if (!lead) {
      throw new NotFoundError('Lead');
    }

    return this.leadRepo.delete(id);
  }

  async exportLeads(filters: ILeadFilters) {
    return this.leadRepo.findAllForExport(filters);
  }
}
