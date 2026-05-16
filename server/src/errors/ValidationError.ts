import { AppError } from './AppError';

export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    super('Validation failed', 422);
    this.errors = errors;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
