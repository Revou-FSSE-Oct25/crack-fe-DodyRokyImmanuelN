import Link from 'next/link';
import { Award } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CertificateCard } from './CertificateCard';
import type { CertificateRow } from './types';

type CertificateListProps = {
  certificates: CertificateRow[];
  isLoading: boolean;
  onCopyCode: (code: string) => void;
  onPrint: (certificate: CertificateRow) => void;
};

export function CertificateList({
  certificates,
  isLoading,
  onCopyCode,
  onPrint,
}: CertificateListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-10 text-center">
        <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
        <p className="font-medium">Belum ada sertifikat</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Selesaikan modul atau learning path untuk mendapatkan sertifikat.
        </p>
        <Button asChild className="mt-4">
          <Link href="/progress">Lihat Progres</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {certificates.map((certificate) => (
        <CertificateCard
          key={certificate.id}
          certificate={certificate}
          onCopyCode={onCopyCode}
          onPrint={onPrint}
        />
      ))}
    </div>
  );
}
