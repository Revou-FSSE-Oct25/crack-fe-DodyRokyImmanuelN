import { Shield, UserRound, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type UserStatsCardsProps = {
  totalUsers: number;
  adminCount: number;
  learnerCount: number;
};

export function UserStatsCards({
  totalUsers,
  adminCount,
  learnerCount,
}: UserStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-lg bg-primary/10 p-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{totalUsers}</p>
            <p className="text-sm text-muted-foreground">Total Pengguna</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-lg bg-blue-500/10 p-2">
            <Shield className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{adminCount}</p>
            <p className="text-sm text-muted-foreground">Admin di Halaman Ini</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-lg bg-green-500/10 p-2">
            <UserRound className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{learnerCount}</p>
            <p className="text-sm text-muted-foreground">Pelajar di Halaman Ini</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
