import { FilterQuery, SortOrder } from 'mongoose';
import { Lead, LeadDocument } from '../models/lead.model';
import { ILeadFilters, ICreateLeadInput } from '../interfaces';
import { DEFAULT_PAGE_SIZE } from '../constants';

export class LeadRepository {
  async findAll(filters: ILeadFilters) {
    const query = this.buildQuery(filters);
    const sort = this.buildSort(filters.sort);
    const page = filters.page || 1;
    const limit = filters.limit || DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sort).skip(skip).limit(limit).populate('createdBy', 'name email'),
      Lead.countDocuments(query),
    ]);

    return {
      leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllWithoutPagination(filters: Omit<ILeadFilters, 'page' | 'limit'>) {
    const query = this.buildQuery(filters as ILeadFilters);
    const sort = this.buildSort(filters.sort);

    return Lead.find(query).sort(sort).populate('createdBy', 'name email');
  }

  async findById(id: string): Promise<LeadDocument | null> {
    return Lead.findById(id).populate('createdBy', 'name email');
  }

  async create(data: ICreateLeadInput & { createdBy: string }): Promise<LeadDocument> {
    const lead = await Lead.create(data);
    return lead.populate('createdBy', 'name email');
  }

  async update(id: string, data: Partial<ICreateLeadInput>): Promise<LeadDocument | null> {
    return Lead.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(
      'createdBy',
      'name email',
    );
  }

  async delete(id: string): Promise<LeadDocument | null> {
    return Lead.findByIdAndDelete(id);
  }

  private buildQuery(filters: ILeadFilters): FilterQuery<LeadDocument> {
    const query: FilterQuery<LeadDocument> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.source) {
      query.source = filters.source;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return query;
  }

  private buildSort(sort?: string): Record<string, SortOrder> {
    if (sort === 'oldest') {
      return { createdAt: 1 };
    }
    return { createdAt: -1 }; // default: latest first
  }
}
