import { Award } from 'lucide-react';

import { APP_URL } from '@/lib/constants';
import {
  formatCertificateDate,
  getCertificateTitle,
  getCertificateTypeLabel,
} from './certificate-utils';
import type { CertificateRow } from './types';

type CertificatePrintSheetProps = {
  certificate: CertificateRow;
  recipientName: string;
};

export function CertificatePrintSheet({
  certificate,
  recipientName,
}: CertificatePrintSheetProps) {
  return (
    <div className="certificate-print-area">
      <section className="certificate-print-sheet">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
              Learnexa
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Certificate of Achievement
            </p>
          </div>
          <div className="rounded-full border border-blue-200 bg-blue-50 p-4 text-blue-700">
            <Award className="h-10 w-10" />
          </div>
        </div>

        <div className="certificate-print-no-break text-center">
          <p className="text-sm uppercase tracking-widest text-slate-500">
            Sertifikat ini diberikan kepada
          </p>
          <h2 className="mt-4 text-5xl font-semibold text-slate-950">
            {recipientName}
          </h2>
          <div className="mx-auto mt-5 h-px w-64 bg-blue-200" />
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            atas keberhasilan menyelesaikan{' '}
            <span className="font-semibold text-slate-950">
              {getCertificateTitle(certificate)}
            </span>{' '}
            pada platform pembelajaran Learnexa.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <p className="uppercase tracking-widest text-slate-400">Tipe</p>
            <p className="mt-2 font-semibold text-slate-900">
              {getCertificateTypeLabel(certificate.type)}
            </p>
          </div>
          <div>
            <p className="uppercase tracking-widest text-slate-400">
              Tanggal Terbit
            </p>
            <p className="mt-2 font-semibold text-slate-900">
              {formatCertificateDate(certificate.issuedAt)}
            </p>
          </div>
          <div>
            <p className="uppercase tracking-widest text-slate-400">
              Kode Sertifikat
            </p>
            <p className="mt-2 break-all font-mono text-xs font-semibold text-slate-900">
              {certificate.code}
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-slate-200 pt-5 text-sm text-slate-500">
          <p>Verifikasi: {`${APP_URL}/certificates/verify/${certificate.code}`}</p>
          <div className="text-right">
            <p className="font-semibold text-slate-900">Learnexa</p>
            <p>Learning Management System</p>
          </div>
        </div>
      </section>
    </div>
  );
}
