'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-muted/50 to-background">
      <Badge variant="secondary" className="mb-4">
        Platform Pembelajaran Online
      </Badge>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl">
        Belajar Lebih{' '}
        <span className="text-primary">Efektif & Terstruktur</span>
      </h1>
      <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8">
        Tingkatkan skill-mu dengan learning path yang terstruktur, quiz
        interaktif, dan sertifikat yang diakui industri.
      </p>
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <Button size="lg" asChild>
          <Link href={!mounted ? '/login' : isAuthenticated ? '/#courses' : '/login'}>
            Mulai Belajar Gratis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="#courses">Lihat Kursus</Link>
        </Button>
      </div>
    </section>
  );
}