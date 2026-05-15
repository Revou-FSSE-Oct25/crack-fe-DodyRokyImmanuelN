'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
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
import {
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  PlusCircle,
  Trophy,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: enrollments = [], isLoading } = useQuery<Enrollment[]>({
    queryKey: QUERY_KEYS.enrollments,
    queryFn: async () => {
      const res = await API.get(ENDPOINTS.enrollments.my);
      return res.data.data ?? [];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.status === 'COMPLETED').length;
  const inProgressCourses = enrollments.filter((e) => e.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Selamat datang, {user?.name ?? 'Pelajar'}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          {user?.role === 'ADMIN'
            ? 'Kelola platform belajar dari sini'
            : 'Lanjutkan perjalanan belajarmu hari ini'}
        </p>
      </div>

      {user?.role === 'ADMIN' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Panel Admin</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Kelola Kursus</p>
                  <p className="text-sm text-muted-foreground">Buat dan ubah learning path</p>
                </div>
                <Button size="sm" variant="ghost" asChild>
                  <Link href="/admin/courses">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Kelola Pengguna</p>
                  <p className="text-sm text-muted-foreground">Lihat semua pengguna</p>
                </div>
                <Button size="sm" variant="ghost" asChild>
                  <Link href="/admin/users">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="rounded-lg bg-green-500/10 p-2">
                  <PlusCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Buat Kursus</p>
                  <p className="text-sm text-muted-foreground">Tambah learning path baru</p>
                </div>
                <Button size="sm" variant="ghost" asChild>
                  <Link href="/admin/courses/create">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {user?.role !== 'ADMIN' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-primary/10 p-2">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-8" /> : totalCourses}
                </div>
                <p className="text-sm text-muted-foreground">Total Kursus</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Trophy className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-8" /> : completedCourses}
                </div>
                <p className="text-sm text-muted-foreground">Selesai</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-8" /> : inProgressCourses}
                </div>
                <p className="text-sm text-muted-foreground">Berjalan</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {user?.role !== 'ADMIN' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Kursus Saya</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/courses">
                Lihat Semua
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-36 w-full rounded-xl" />
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <GraduationCap className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <p className="mb-1 font-medium">Belum mengambil kursus</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Mulai belajar dengan mengambil kursus pertamamu
                </p>
                <Button asChild>
                  <Link href="/courses">Jelajahi Kursus</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-base">
                          {enrollment.learningPath.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {enrollment.learningPath.modules.length} Modul -{' '}
                          {enrollment.progress.totalLessons} Lesson
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          enrollment.status === 'COMPLETED' ? 'default' : 'secondary'
                        }
                      >
                        {enrollment.status === 'COMPLETED' ? 'Selesai' : 'Berjalan'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
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
                    <div className="mt-4">
                      <Button size="sm" asChild>
                        <Link href={`/learning/${enrollment.learningPath.slug}`}>
                          {enrollment.status === 'COMPLETED'
                            ? 'Lihat Kursus'
                            : 'Lanjut Belajar'}
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
