import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/types';
import { getInitials, getRoleLabel } from './profile-utils';

type ProfileHeaderProps = {
  user: User | null;
};

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
          <AvatarFallback className="text-lg">{getInitials(user?.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold">Profil Saya</h1>
          <p className="text-sm text-muted-foreground">
            Kelola data akun dan keamanan login kamu.
          </p>
        </div>
      </div>
      <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'}>
        {getRoleLabel(user?.role)}
      </Badge>
    </div>
  );
}
