import { CalendarDays, Mail, ShieldCheck } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { User } from '@/types';
import { getRoleLabel } from './profile-utils';

type AccountInfoCardProps = {
  user: User | null;
};

export function AccountInfoCard({ user }: AccountInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Info Akun</CardTitle>
        <CardDescription>Detail akun yang dipakai untuk akses LMS.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">{user?.email ?? '-'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Role</p>
            <p className="text-muted-foreground">{getRoleLabel(user?.role)}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Bergabung</p>
            <p className="text-muted-foreground">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '-'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
