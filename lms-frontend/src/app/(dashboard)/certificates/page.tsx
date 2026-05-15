'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Award, CalendarDays, Copy, ExternalLink, Search, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import API from '@/lib/api';
import { ENDPOINTS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { CertificateType } from '@/types';

type CertificateRow = {
  id: string;
  userId: string;
  type: CertificateType;
  moduleId: string | null;
  learningPathId: string | null;
  code: string;
  issuedAt: string;
  module?: {
    id: string;
    title: string;
  } | null;
  learningPath?: {
    id: string;
    title: string;
    slug: string;
  } | null;
};

type ApiEnvelope<T> = {
  data: T;
};

const getCertificateTitle = (certificate: CertificateRow) => {
  if (certificate.type === 'MODULE') {
    return certificate.module?.title ?? 'Sertifikat Modul';
  }

  return certificate.learningPath?.title ?? 'Sertifikat Learning Path';
};

const getCertificateTypeLabel = (type: CertificateType) =>
  type === 'MODULE' ? 'Modul' : 'Learning Path';

export default function CertificatesPage() {
  const [search, setSearch] = useState('');

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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary/10 p-2">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-semibold">
                {isLoading ? <Skeleton className="h-8 w-10" /> : certificates.length}
              </div>
              <p className="text-sm text-muted-foreground">Total Sertifikat</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-semibold">
                {isLoading ? <Skeleton className="h-8 w-10" /> : moduleCertificates}
              </div>
              <p className="text-sm text-muted-foreground">Sertifikat Modul</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-green-500/10 p-2">
              <CalendarDays className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-semibold">
                {isLoading ? <Skeleton className="h-8 w-10" /> : learningPathCertificates}
              </div>
              <p className="text-sm text-muted-foreground">Sertifikat Learning Path</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredCertificates.length === 0 ? (
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
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredCertificates.map((certificate) => (
                <div key={certificate.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Badge variant="secondary">
                        {getCertificateTypeLabel(certificate.type)}
                      </Badge>
                      <h3 className="mt-3 truncate font-semibold">
                        {getCertificateTitle(certificate)}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Diterbitkan pada{' '}
                        {new Date(certificate.issuedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
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
                        onClick={() => void copyCode(certificate.code)}
                        title="Salin kode"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
