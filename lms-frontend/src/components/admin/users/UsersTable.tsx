import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { AdminUser } from './types';
import { UserEnrollmentSummary } from './UserEnrollmentSummary';
import { getInitials } from './user-utils';

type UsersTableProps = {
  users: AdminUser[];
  isLoading: boolean;
};

export function UsersTable({ users, isLoading }: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Memuat pengguna...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">
        Tidak ada pengguna yang cocok.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="hidden grid-cols-[1.35fr_1.35fr_100px_1.55fr_120px] gap-4 border-b bg-muted/50 px-4 py-3 text-xs font-medium uppercase text-muted-foreground md:grid">
        <span>User</span>
        <span>Email</span>
        <span>Role</span>
        <span>Enrollment</span>
        <span>Bergabung</span>
      </div>
      <div className="divide-y">
        {users.map((user) => (
          <div
            key={user.id}
            className="grid gap-3 px-4 py-4 md:grid-cols-[1.35fr_1.35fr_100px_1.55fr_120px] md:items-center md:gap-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar>
                {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground md:hidden">
                  {user.email}
                </p>
              </div>
            </div>
            <p className="hidden truncate text-sm text-muted-foreground md:block">
              {user.email}
            </p>
            <div>
              <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                {user.role}
              </Badge>
            </div>
            <div className="min-w-0 space-y-1">
              <UserEnrollmentSummary enrollments={user.enrollments} />
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
