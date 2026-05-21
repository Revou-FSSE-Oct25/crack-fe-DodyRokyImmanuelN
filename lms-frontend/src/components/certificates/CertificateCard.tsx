import Link from 'next/link';
import { Award, Copy, ExternalLink, Printer } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  formatCertificateDate,
  getCertificateTitle,
  getCertificateTypeLabel,
} from './certificate-utils';
import type { CertificateRow } from './types';

type CertificateCardProps = {
  certificate: CertificateRow;
  onCopyCode: (code: string) => void;
  onPrint: (certificate: CertificateRow) => void;
};

export function CertificateCard({
  certificate,
  onCopyCode,
  onPrint,
}: CertificateCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Badge variant="secondary">{getCertificateTypeLabel(certificate.type)}</Badge>
          <h3 className="mt-3 truncate font-semibold">
            {getCertificateTitle(certificate)}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Diterbitkan pada {formatCertificateDate(certificate.issuedAt)}
          </p>
        </div>
        <Award className="h-8 w-8 shrink-0 text-primary" />
      </div>

      <div className="mt-4 rounded-md bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">Kode Sertifikat</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <code className="truncate text-sm font-medium">{certificate.code}</code>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onCopyCode(certificate.code)}
            title="Salin kode"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPrint(certificate)}
        >
          Cetak
          <Printer className="ml-2 h-4 w-4" />
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/certificates/verify/${certificate.code}`}>
            Verifikasi
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        {certificate.learningPath?.slug && (
          <Button asChild size="sm">
            <Link href={`/learning/${certificate.learningPath.slug}`}>
              Lihat Kursus
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
