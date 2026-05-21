'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';

type AdminRouteGuardProps = {
  children: React.ReactNode;
};

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const hasHydrated = useSyncExternalStore(
    (callback) => useAuthStore.persist.onFinishHydration(callback),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (user && user.role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [hasHydrated, isAuthenticated, router, user]);

  if (!hasHydrated || !isAuthenticated || !user || user.role !== 'ADMIN') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Memeriksa akses...
      </div>
    );
  }

  return <>{children}</>;
}
