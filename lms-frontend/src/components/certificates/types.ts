import type { CertificateType } from '@/types';

export type CertificateRow = {
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

export type ApiEnvelope<T> = {
  data: T;
};
