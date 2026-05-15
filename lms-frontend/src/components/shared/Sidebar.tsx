'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore'; // Import auth store
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  Award,
  Users,
  X,
} from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useUiStore();
  const { user } = useAuthStore(); 

  const allNavItems = [
  { 
    href: '/dashboard', 
    label: 'Dasbor', 
    icon: LayoutDashboard 
  },
  { 
    href: '/admin/courses', 
    label: 'Kelola Kursus', 
    icon: BookOpen,
    role: 'ADMIN' 
  },
  {
    href: '/admin/users',
    label: 'Kelola Pengguna',
    icon: Users,
    role: 'ADMIN'
  },
  { 
    href: '/progress', 
    label: 'Progres', 
    icon: BarChart2,
    role: 'USER' 
  },
  { 
    href: '/certificates', 
    label: 'Sertifikat', 
    icon: Award,
    role: 'USER' 
  },
];

  const filteredNavItems = allNavItems.filter((item) => {
  if (item.role === 'ADMIN') {
    return user?.role === 'ADMIN';
  }
  
  if (item.role === 'USER') {
    return user?.role !== 'ADMIN';
  }

  return true; 
});

  return (
    <>
      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-background border-r flex flex-col transition-transform duration-300',
          'md:static md:translate-x-0 md:z-auto',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>{APP_NAME}</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
