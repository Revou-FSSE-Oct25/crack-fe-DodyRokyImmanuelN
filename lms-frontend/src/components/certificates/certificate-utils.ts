import type { CertificateType } from '@/types';
import type { CertificateRow } from './types';

export const getCertificateTitle = (certificate: CertificateRow) => {
  if (certificate.type === 'MODULE') {
    return certificate.module?.title ?? 'Sertifikat Modul';
  }

  return certificate.learningPath?.title ?? 'Sertifikat Learning Path';
};

export const getCertificateTypeLabel = (type: CertificateType) =>
  type === 'MODULE' ? 'Modul' : 'Learning Path';

export const formatCertificateDate = (date: string) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
