'use client';

import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentFailedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <XCircle className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Pembayaran Gagal</h1>
      <p className="text-muted-foreground mb-6">
        Transaksi kamu gagal. Silakan coba lagi.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/dashboard">Ke Dasbor</Link>
        </Button>
        <Button asChild>
          <Link href="/courses">Lihat Kursus Lain</Link>
        </Button>
      </div>
    </div>
  );
}
