'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, CheckCircle2, Clock, GraduationCap } from 'lucide-react';
import API from '@/lib/api';
import { ENDPOINTS, QUERY_KEYS } from '@/lib/constants';
import type { Enrollment } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProgressPage() {
  const { data: enrollments = [], isLoading } = useQuery<Enrollment[]>({
    queryKey: QUERY_KEYS.enrollments,
    queryFn: async () => {
      const response = await API.get(ENDPOINTS.enrollments.my);
      return response.data.data ?? [];
    },
    refetchOnWindowFocus: true,
  });

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((item) => item.status === 'COMPLETED').length;
  const activeCourses = enrollments.filter((item) => item.status === 'ACTIVE').length;
  const totalLessons = enrollments.reduce(
    (total, item) => total + item.progress.totalLessons,
    0,
  );
  const completedLessons = enrollments.reduce(
    (total, item) => total + item.progress.completedLessons,
    0,
  );
  const overallPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Progres Belajar</h1>
        <p className="text-sm text-muted-foreground">
          Pantau perkembangan belajar dari semua kursus yang kamu ikuti.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary/10 p-2">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-semibold">
                {isLoading ? <Skeleton className="h-8 w-10" /> : totalCourses}
              </div>
              <p className="text-sm text-muted-foreground">Total Kursus</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-green-500/10 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-semibold">
                {isLoading ? <Skeleton className="h-8 w-10" /> : completedCourses}
              </div>
              <p className="text-sm text-muted-foreground">Selesai</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-amber-500/10 p-2">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <div className="text-2xl font-semibold">
                {isLoading ? <Skeleton className="h-8 w-10" /> : activeCourses}
              </div>
              <p className="text-sm text-muted-foreground">Berjalan</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <GraduationCap className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-semibold">
                {isLoading ? <Skeleton className="h-8 w-10" /> : `${overallPercentage}%`}
              </div>
              <p className="text-sm text-muted-foreground">Rata-rata</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Progres</CardTitle>
          <CardDescription>
            Progres dihitung dari lesson yang sudah selesai di setiap kursus.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="rounded-md border border-dashed p-10 text-center">
              <GraduationCap className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="font-medium">Belum ada kursus yang diikuti</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ambil kursus pertama untuk mulai melihat progres belajarmu.
              </p>
              <Button asChild className="mt-4">
                <Link href="/courses">Jelajahi Kursus</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{enrollment.learningPath.title}</h3>
                        <Badge
                          variant={
                            enrollment.status === 'COMPLETED' ? 'default' : 'secondary'
                          }
                        >
                          {enrollment.status === 'COMPLETED' ? 'Selesai' : 'Berjalan'}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {enrollment.learningPath.modules.length} modul -{' '}
                        {enrollment.progress.totalLessons} lesson
                      </p>
                    </div>

                    <Button asChild size="sm">
                      <Link href={`/learning/${enrollment.learningPath.slug}`}>
                        Lanjut Belajar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        {enrollment.progress.completedLessons} dari{' '}
                        {enrollment.progress.totalLessons} lesson selesai
                      </span>
                      <span className="font-medium text-foreground">
                        {enrollment.progress.percentage}%
                      </span>
                    </div>
                    <Progress value={enrollment.progress.percentage} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
