import { Sidebar } from '@/components/shared/Sidebar';
import { DashboardNavbar } from '@/components/shared/DashboardNavbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}