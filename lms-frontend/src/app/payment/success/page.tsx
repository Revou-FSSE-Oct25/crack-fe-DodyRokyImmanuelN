'use client';

import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Pembayaran Berhasil</h1>
      <p className="text-muted-foreground mb-6">
        Kamu sudah terdaftar di kursus ini. Selamat belajar!
      </p>
      <Button asChild>
        <Link href="/dashboard">Mulai Belajar</Link>
      </Button>
    </div>
  );
}
