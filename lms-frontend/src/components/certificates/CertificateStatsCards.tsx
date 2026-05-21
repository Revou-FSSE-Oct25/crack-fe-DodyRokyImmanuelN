import { Award, CalendarDays, ShieldCheck } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type CertificateStatsCardsProps = {
  totalCertificates: number;
  moduleCertificates: number;
  learningPathCertificates: number;
  isLoading: boolean;
};

export function CertificateStatsCards({
  totalCertificates,
  moduleCertificates,
  learningPathCertificates,
  isLoading,
}: CertificateStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <CertificateStatCard
        icon={<Award className="h-5 w-5 text-primary" />}
        value={totalCertificates}
        label="Total Sertifikat"
        isLoading={isLoading}
        iconClassName="bg-primary/10"
      />
      <CertificateStatCard
        icon={<ShieldCheck className="h-5 w-5 text-blue-500" />}
        value={moduleCertificates}
        label="Sertifikat Modul"
        isLoading={isLoading}
        iconClassName="bg-blue-500/10"
      />
      <CertificateStatCard
        icon={<CalendarDays className="h-5 w-5 text-green-500" />}
        value={learningPathCertificates}
        label="Sertifikat Learning Path"
        isLoading={isLoading}
        iconClassName="bg-green-500/10"
      />
    </div>
  );
}

type CertificateStatCardProps = {
  icon: React.ReactNode;
  value: number;
  label: string;
  isLoading: boolean;
  iconClassName: string;
};

function CertificateStatCard({
  icon,
  value,
  label,
  isLoading,
  iconClassName,
}: CertificateStatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`rounded-lg p-2 ${iconClassName}`}>{icon}</div>
        <div>
          <div className="text-2xl font-semibold">
            {isLoading ? <Skeleton className="h-8 w-10" /> : value}
          </div>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
