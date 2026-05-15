'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import API from '@/lib/api';
import { ENDPOINTS, QUERY_KEYS } from '@/lib/constants';
import type { LearningPath } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: course, isLoading } = useQuery<LearningPath>({
    queryKey: QUERY_KEYS.learningPath(slug),
    queryFn: async () => {
      const res = await API.get(ENDPOINTS.learningPaths.detail(slug));
      return res.data.data;
    },
  });

  const { mutate: createInvoice, isPending } = useMutation({
    mutationFn: async () => {
      const res = await API.post(ENDPOINTS.payments.createInvoice, {
        learningPathId: course?.id,
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      window.location.href = data.paymentUrl;
    },
    onError: () => {
      toast.error('Gagal membuat invoice. Silakan coba lagi.');
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-medium">Kursus tidak ditemukan</p>
        <Button variant="ghost" className="mt-4" asChild>
          <Link href="/courses">Kembali ke Daftar Kursus</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/courses/${slug}`}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Kembali ke Detail Kursus
        </Link>
      </Button>

      <h1 className="text-2xl font-bold">Checkout</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground">
            Kursus yang Dibeli
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary/50" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold">{course.title}</p>
              <p className="line-clamp-1 text-sm text-muted-foreground">
                {course.description}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary">{course.modules?.length ?? 0} Modul</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground">
            Ringkasan Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Harga Kursus</span>
            <span>Rp {Number(course.price).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Biaya Langganan</span>
            <span>Rp 0</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>Rp {Number(course.price).toLocaleString('id-ID')}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
        <span>Pembayaran aman diproses melalui Xendit</span>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={() => createInvoice()}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Membuat Invoice...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Bayar Sekarang - Rp {Number(course.price).toLocaleString('id-ID')}
          </>
        )}
      </Button>
    </div>
  );
}
