export const API_PREFIX = '/api/v1';

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'lost'] as const;
export const LEAD_SOURCES = ['website', 'instagram', 'referral'] as const;
export const USER_ROLES = ['admin', 'sales'] as const;
export const SORT_OPTIONS = ['latest', 'oldest'] as const;

export const BCRYPT_SALT_ROUNDS = 12;
