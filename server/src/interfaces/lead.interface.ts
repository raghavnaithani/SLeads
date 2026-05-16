export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  LOST = 'lost',
}

export enum LeadSource {
  WEBSITE = 'website',
  INSTAGRAM = 'instagram',
  REFERRAL = 'referral',
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateLeadInput {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
}

export interface IUpdateLeadInput {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

export interface ILeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: number;
  limit?: number;
}
