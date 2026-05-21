'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import API from '@/lib/api';
import { ENDPOINTS } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CertificateList } from '@/components/certificates/CertificateList';
import { CertificatePrintSheet } from '@/components/certificates/CertificatePrintSheet';
import { CertificateStatsCards } from '@/components/certificates/CertificateStatsCards';
import {
  getCertificateTitle,
  getCertificateTypeLabel,
} from '@/components/certificates/certificate-utils';
import type {
  ApiEnvelope,
  CertificateRow,
} from '@/components/certificates/types';

export default function CertificatesPage() {
  const [search, setSearch] = useState('');
  const [printCertificate, setPrintCertificate] = useState<CertificateRow | null>(null);
  const user = useAuthStore((state) => state.user);

  const { data: certificates = [], isLoading } = useQuery<CertificateRow[]>({
    queryKey: ['certificates', 'my'],
    queryFn: async () => {
      const response = await API.get<ApiEnvelope<CertificateRow[]>>(ENDPOINTS.certificates.my);
      return response.data.data ?? [];
    },
  });

  const filteredCertificates = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return certificates;

    return certificates.filter((certificate) =>
      [
        getCertificateTitle(certificate),
        certificate.code,
        getCertificateTypeLabel(certificate.type),
      ].some((value) => value.toLowerCase().includes(keyword)),
    );
  }, [certificates, search]);

  const moduleCertificates = certificates.filter((item) => item.type === 'MODULE').length;
  const learningPathCertificates = certificates.filter(
    (item) => item.type === 'LEARNING_PATH',
  ).length;

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Kode sertifikat disalin');
    } catch {
      toast.error('Gagal menyalin kode sertifikat');
    }
  };

  const printSelectedCertificate = (certificate: CertificateRow) => {
    setPrintCertificate(certificate);
    window.setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sertifikat Saya</h1>
          <p className="text-sm text-muted-foreground">
            Sertifikat akan muncul setelah kamu menyelesaikan modul atau learning path.
          </p>
        </div>
        <Badge variant="outline">{certificates.length} sertifikat</Badge>
      </div>

      <CertificateStatsCards
        totalCertificates={certificates.length}
        moduleCertificates={moduleCertificates}
        learningPathCertificates={learningPathCertificates}
        isLoading={isLoading}
      />

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Daftar Sertifikat</CardTitle>
            <CardDescription>Gunakan kode sertifikat untuk verifikasi publik.</CardDescription>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-8"
              placeholder="Cari sertifikat atau kode"
            />
          </div>
        </CardHeader>
        <CardContent>
          <CertificateList
            certificates={filteredCertificates}
            isLoading={isLoading}
            onCopyCode={(code) => void copyCode(code)}
            onPrint={printSelectedCertificate}
          />
        </CardContent>
      </Card>

      {printCertificate && (
        <CertificatePrintSheet
          certificate={printCertificate}
          recipientName={user?.name ?? 'Peserta Learnexa'}
        />
      )}
    </div>
  );
}
