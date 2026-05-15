import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Trophy, ArrowRight } from 'lucide-react';
import { API_URL } from '@/lib/constants';
import type { LearningPathSummary, ApiResponse } from '@/types';
import { HeroSection } from '@/components/shared/HeroSection';

async function getLearningPaths(): Promise<LearningPathSummary[]> {
  try {
    const res = await fetch(`${API_URL}/learning-paths`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json: ApiResponse<LearningPathSummary[]> = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const learningPaths = await getLearningPaths();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <p className="text-3xl font-bold">{learningPaths.length}+</p>
              <p className="text-muted-foreground">Learning Path</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              <p className="text-3xl font-bold">500+</p>
              <p className="text-muted-foreground">Pelajar Aktif</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Trophy className="h-8 w-8 text-primary" />
              <p className="text-3xl font-bold">200+</p>
              <p className="text-muted-foreground">Sertifikat Terbit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Learning Path Tersedia</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Pilih learning path yang sesuai dengan tujuan kariermu
          </p>
        </div>

        {learningPaths.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Belum ada kursus tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <Card
                key={path.id}
                className="flex flex-col hover:shadow-lg transition-shadow"
              >
                {path.thumbnail ? (
                    <img 
                      src={path.thumbnail} 
                      alt={path.title} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20">
                      <BookOpen className="h-16 w-16 text-primary/20" />
                    </div>
                  )}

                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-snug">
                      {path.title}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {path._count?.modules ?? 0} Modul
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {path.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                </CardContent>

                <CardFooter className="flex items-center justify-between pt-4 border-t">
                  <p className="font-bold text-lg">
                    {path.price === 0
                      ? 'Gratis'
                      : `Rp ${Number(path.price).toLocaleString('id-ID')}`}
                  </p>
                  <Button asChild size="sm">
                    <Link href={`/courses/${path.slug}`}>
                      Lihat Detail
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 {APP_NAME}. Seluruh hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
