'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import API from '@/lib/api';
import { UserStatsCards } from '@/components/admin/users/UserStatsCards';
import { UsersPagination } from '@/components/admin/users/UsersPagination';
import { UsersTable } from '@/components/admin/users/UsersTable';
import type { AdminUser, UsersResponse, UsersMeta } from '@/components/admin/users/types';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

const PAGE_SIZE = 10;

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as ApiError;
  return apiError.response?.data?.message ?? fallback;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<UsersMeta>({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await API.get<UsersResponse>('/users', {
          params: { page, limit: PAGE_SIZE },
        });

        if (!isMounted) return;
        setUsers(response.data.data);
        setMeta(response.data.meta);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Gagal memuat pengguna'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [page]);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return users;

    return users.filter((user) =>
      [user.name, user.email, user.role].some((value) => value.toLowerCase().includes(keyword)),
    );
  }, [search, users]);

  const adminCount = users.filter((user) => user.role === 'ADMIN').length;
  const learnerCount = users.filter((user) => user.role === 'USER').length;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Kelola Pengguna</h1>
          <p className="text-sm text-muted-foreground">
            Lihat akun pelajar dan admin yang terdaftar di platform.
          </p>
        </div>
        <Badge variant="outline">{meta.total} total pengguna</Badge>
      </div>

      <UserStatsCards
        totalUsers={meta.total}
        adminCount={adminCount}
        learnerCount={learnerCount}
      />

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Pengguna</CardTitle>
            <CardDescription>Data diurutkan dari pengguna terbaru.</CardDescription>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-8"
              placeholder="Cari nama, email, atau role"
            />
          </div>
        </CardHeader>
        <CardContent>
          <UsersTable users={filteredUsers} isLoading={isLoading} />

          <UsersPagination
            meta={meta}
            page={page}
            isLoading={isLoading}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
