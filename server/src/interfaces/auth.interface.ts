export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPayload {
  userId: string;
  role: UserRole;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface ILoginInput {
  email: string;
  password: string;
}
