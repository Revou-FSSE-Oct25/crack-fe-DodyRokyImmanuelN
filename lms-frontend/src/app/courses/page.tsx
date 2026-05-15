'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  BookOpen, 
  Layers, 
  ArrowRight, 
  Search, 
  LayoutGrid,
  ChevronLeft 
} from 'lucide-react';

import API from '@/lib/api';
import { ENDPOINTS, QUERY_KEYS } from '@/lib/constants';
import { LearningPathSummary } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const router = useRouter(); 

  const { data: courses = [], isLoading } = useQuery<LearningPathSummary[]>({
    queryKey: QUERY_KEYS.learningPaths,
    queryFn: async () => {
      const res = await API.get(ENDPOINTS.learningPaths.list);
      return res.data.data ?? [];
    },
  });

  const formatIDR = (price: number | string) => {
    const numericPrice = Number(price) || 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numericPrice);
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        
        {/* --- Back Button --- */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()} 
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Kembali
        </Button>

        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold mb-1">
              <LayoutGrid className="h-5 w-5" />
              <span>Jelajahi Jalur Belajar</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Katalog Kursus
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Pilih jalur pembelajaran yang dirancang khusus untuk membantumu menguasai teknologi terbaru.
            </p>
          </div>

          <div className="relative w-full md:w-80 shadow-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari kursus favoritmu..." 
              className="pl-10 h-12 rounded-xl border-muted-foreground/20 focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-52 w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))
          ) : filteredCourses.length === 0 ? (
            <div className="col-span-full py-24 text-center flex flex-col items-center">
              <div className="bg-muted rounded-full p-6 mb-4">
                <BookOpen className="h-12 w-12 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-semibold">Kursus tidak ditemukan</h3>
              <p className="text-muted-foreground mt-2">
                Maaf, kami tidak menemukan kursus dengan judul{' '}
                <span className="font-medium text-foreground">{search}</span>.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => setSearch('')}>
                Lihat Semua Kursus
              </Button>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <Card 
                key={course.id} 
                className="group flex flex-col h-full border-none shadow-sm hover:shadow-2xl transition-all duration-300 bg-card overflow-hidden ring-1 ring-border rounded-2xl"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20">
                      <BookOpen className="h-16 w-16 text-primary/20" />
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-background/80 hover:bg-background/90 text-foreground backdrop-blur-md border-none px-3 py-1 shadow-sm">
                      <Layers className="h-3 w-3 mr-1.5" />
                      {course._count.modules} Modul
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6 flex-1">
                  <div className="mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
                      Learning Path
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-6 leading-relaxed">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-black text-foreground">
                      {Number(course.price) === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">Gratis</span>
                      ) : (
                        formatIDR(course.price)
                      )}
                    </div>
                    <Badge variant="outline" className="font-normal text-[10px] opacity-60">
                      #{course.slug}
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button className="w-full group/btn h-11 rounded-xl font-semibold" asChild>
                    <Link href={`/courses/${course.slug}`}>
                      Lihat Detail Kursus
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
