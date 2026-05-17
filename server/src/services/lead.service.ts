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

  async getLeadsExportCsv(filters: Omit<ILeadFilters, 'page' | 'limit'>) {
    const leads = await this.leadRepo.findAllWithoutPagination(filters);
    
    const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Created By (Name)', 'Created By (Email)', 'Created At'];
    const rows = leads.map(lead => [
      String(lead._id),
      lead.name.replace(/"/g, '""'),
      lead.email.replace(/"/g, '""'),
      lead.status,
      lead.source,
      lead.createdBy ? (lead.createdBy as any).name.replace(/"/g, '""') : 'N/A',
      lead.createdBy ? (lead.createdBy as any).email.replace(/"/g, '""') : 'N/A',
      lead.createdAt.toISOString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');

    return csvContent;
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
}
