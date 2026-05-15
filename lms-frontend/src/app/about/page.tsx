import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, GraduationCap, ShieldCheck, Target } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Tentang',
  description: `Tentang ${APP_NAME}, platform pembelajaran online terstruktur.`,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-muted/40 to-background">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                Tentang {APP_NAME}
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Belajar skill digital dengan alur yang jelas dari awal sampai
                siap praktik.
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {APP_NAME} membantu pelajar mengikuti materi secara bertahap
                melalui learning path, modul, lesson, quiz, progres belajar,
                dan sertifikat. Setiap fitur dibuat agar proses belajar lebih
                terarah, mudah dipantau, dan relevan dengan kebutuhan karier.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/#courses">
                    Jelajahi Learning Path
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">
                  Learning path terstruktur
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Materi disusun per modul agar pelajar tahu langkah berikutnya
                  tanpa bingung memilih urutan belajar.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">
                  Quiz dan progres belajar
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Pemahaman dapat diuji langsung, sementara progres belajar
                  tersimpan agar perjalanan belajar mudah dilanjutkan.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">
                  Sertifikat yang bisa diverifikasi
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Setelah menyelesaikan pembelajaran, pelajar dapat memperoleh
                  sertifikat sebagai bukti pencapaian.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 {APP_NAME}. Seluruh hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
