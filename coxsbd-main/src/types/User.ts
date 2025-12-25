export enum Role {
  ADMIN = "ADMIN",
  MERCHANT = "MERCHANT",
  USER = "USER",
}

export interface MerchantUser {
  id: string;
  email: string;
  role: Role;
  registeredAt: string;
}

export interface MerchantUsersMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  skip: number;
}

export interface MerchantUsersResult {
  users: MerchantUser[];
  meta: MerchantUsersMeta;
}

export interface MerchantUsersFilters {
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}
