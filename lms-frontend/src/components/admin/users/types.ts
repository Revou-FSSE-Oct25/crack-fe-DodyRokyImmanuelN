import type { Role } from '@/types';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: Role;
  createdAt: string;
};

export type UsersMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UsersResponse = {
  data: AdminUser[];
  meta: UsersMeta;
};
