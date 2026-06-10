export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  SALES_STAFF = "SALES_STAFF",
  CUSTOMER = "CUSTOMER",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  branchId: string | null;
  status: string;
  phoneNumber?: string;
  fullName?: string;
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
