export enum UserRole {
  ADMIN = "ADMIN",
  BRANCH_MANAGER = "BRANCH_MANAGER",
  SALES_STAFF = "SALES_STAFF",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  branchId?: string;
  isActive: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

