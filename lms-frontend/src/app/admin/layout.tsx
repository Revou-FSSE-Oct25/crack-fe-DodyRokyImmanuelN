import { Sidebar } from '@/components/shared/Sidebar';
import { DashboardNavbar } from '@/components/shared/DashboardNavbar';
import { AdminRouteGuard } from '@/components/auth/AdminRouteGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      
      <Sidebar /> 
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardNavbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto w-full">
            <AdminRouteGuard>{children}</AdminRouteGuard>
          </div>
        </main>
      </div>
    </div>
  );
}
