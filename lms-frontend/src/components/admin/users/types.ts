import type { Role } from '@/types';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: Role;
  createdAt: string;
  enrollments: {
    id: string;
    status: 'ACTIVE' | 'COMPLETED';
    enrolledAt: string;
    learningPath: {
      id: string;
      title: string;
      slug: string;
    };
  }[];
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
