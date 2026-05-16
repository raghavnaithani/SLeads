export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]> | string[];
  pagination?: IPaginationMeta;
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
