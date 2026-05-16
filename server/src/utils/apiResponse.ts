import { Response } from 'express';
import { IApiResponse, IPaginationMeta } from '../interfaces';

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200,
    pagination?: IPaginationMeta,
  ): Response {
    const response: IApiResponse<T> = {
      success: true,
      message,
      data,
    };

    if (pagination) {
      response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message = 'Created successfully'): Response {
    return ApiResponse.success(res, data, message, 201);
  }

  static error(
    res: Response,
    message = 'Internal server error',
    statusCode = 500,
    errors?: Record<string, string[]> | string[],
  ): Response {
    const response: IApiResponse = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }
}
