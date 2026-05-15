'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Award, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import API from '@/lib/api';
import { ENDPOINTS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CertificateType } from '@/types';

type VerifiedCertificate = {
  isValid: boolean;
  certificate: {
    code: string;
    type: CertificateType;
    issuedAt: string;
    issuedTo: string;
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
};

type ApiEnvelope<T> = {
  data: T;
};

const getCertificateTitle = (certificate: VerifiedCertificate['certificate']) => {
  if (certificate.type === 'MODULE') {
    return certificate.module?.title ?? 'Sertifikat Modul';
  }

  return certificate.learningPath?.title ?? 'Sertifikat Learning Path';
};

export default function VerifyCertificatePage() {
  const { code } = useParams<{ code: string }>();

  const {
    data,
    isLoading,
    isError,
  } = useQuery<VerifiedCertificate>({
    queryKey: ['certificates', 'verify', code],
    queryFn: async () => {
      const response = await API.get<ApiEnvelope<VerifiedCertificate>>(
        ENDPOINTS.certificates.verify(code),
      );
      return response.data.data;
    },
    retry: false,
  });

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Verifikasi Sertifikat</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Memeriksa sertifikat...
            </div>
          ) : isError || !data?.isValid ? (
            <div className="py-10 text-center">
              <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
              <p className="font-medium">Sertifikat tidak valid</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Kode sertifikat tidak ditemukan atau sudah tidak berlaku.
              </p>
              <Button asChild className="mt-5" variant="outline">
                <Link href="/certificates">Kembali ke Sertifikat</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg border bg-green-500/10 p-4 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-600" />
                <p className="font-semibold text-green-700">Sertifikat valid</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border p-4">
                  <p className="text-xs text-muted-foreground">Nama Penerima</p>
                  <p className="mt-1 font-medium">{data.certificate.issuedTo}</p>
                </div>
                <div className="rounded-md border p-4">
                  <p className="text-xs text-muted-foreground">Tipe Sertifikat</p>
                  <div className="mt-1">
                    <Badge>
                      {data.certificate.type === 'MODULE' ? 'Modul' : 'Learning Path'}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-md border p-4 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Diberikan Untuk</p>
                  <p className="mt-1 font-medium">
                    {getCertificateTitle(data.certificate)}
                  </p>
                </div>
                <div className="rounded-md border p-4">
                  <p className="text-xs text-muted-foreground">Kode Sertifikat</p>
                  <p className="mt-1 break-all font-mono text-sm">{data.certificate.code}</p>
                </div>
                <div className="rounded-md border p-4">
                  <p className="text-xs text-muted-foreground">Tanggal Terbit</p>
                  <p className="mt-1 font-medium">
                    {new Date(data.certificate.issuedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button asChild variant="outline">
                  <Link href="/certificates">Kembali ke Sertifikat</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
