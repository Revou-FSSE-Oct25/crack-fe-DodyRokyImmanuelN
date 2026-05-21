'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import API from '@/lib/api';
import { ENDPOINTS, QUERY_KEYS } from '@/lib/constants';
import type { LearningPath, Enrollment } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Lock,
  ArrowLeft,
  PlayCircle,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Fetch learning path detail
  const { data: course, isLoading: isCourseLoading } = useQuery<LearningPath>({
    queryKey: QUERY_KEYS.learningPath(slug),
    queryFn: async () => {
      const res = await API.get(ENDPOINTS.learningPaths.detail(slug));
      return res.data.data;
    },
  });

  // Fetch enrollments user
  const { data: enrollments = [] } = useQuery<Enrollment[]>({
    queryKey: QUERY_KEYS.enrollments,
    queryFn: async () => {
      const res = await API.get(ENDPOINTS.enrollments.my);
      return res.data.data ?? [];
    },
    enabled: isAuthenticated,
  });

  // Cek apakah user sudah enroll di kursus ini
  const enrollment = enrollments.find(
    (e) => e.learningPath.id === course?.id,
  );
  const isEnrolled = !!enrollment;
  const isCompleted = enrollment?.status === 'COMPLETED';

  const handleEnrollOrBuy = () => {
    if (!isAuthenticated) {
      toast.error('Login dulu untuk melanjutkan');
      router.push('/login');
      return;
    }

    if (course?.price === 0) {
      // Gratis — langsung enroll (belum diimplementasi, arahkan ke payment dulu)
      router.push(`/checkout/${slug}`);
    } else {
      router.push(`/checkout/${slug}`);
    }
  };

  if (isCourseLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="font-medium">Kursus tidak ditemukan</p>
        <Button variant="ghost" className="mt-4" asChild>
          <Link href="/courses">Kembali ke Daftar Kursus</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/courses">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali
        </Link>
      </Button>

      {/* Hero Card */}
      <Card>
        <CardContent className="p-6">
          {/* Thumbnail */}
          <div className="mb-6 h-48 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <BookOpen className="h-16 w-16 text-primary/40" />
              </div>
            )}
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                  {course.isPublished ? 'Dipublikasikan' : 'Draft'}
                </Badge>
                {isEnrolled && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {isCompleted ? '✓ Selesai' : 'Sedang Berjalan'}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{course.modules?.length ?? 0} Modul</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>
                {course.modules?.reduce(
                  (acc, m) => acc + (m._count?.lessons ?? 0),
                  0,
                ) ?? 0}{' '}
                Lesson
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-3xl font-bold">
              {course.price === 0
                ? 'Gratis'
                : `Rp ${Number(course.price).toLocaleString('id-ID')}`}
            </p>

            {isEnrolled ? (
              <Button size="lg" asChild>
                <Link href={`/learning/${course.slug}`}>
                  <PlayCircle className="mr-2 h-5 w-5" />
                  {isCompleted ? 'Belajar Lagi' : 'Lanjut Belajar'}
                </Link>
              </Button>
            ) : (
              <Button size="lg" onClick={handleEnrollOrBuy}>
                {course.price === 0 ? 'Daftar Gratis' : 'Beli Sekarang'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modules List */}
      <Card>
        <CardHeader>
          <CardTitle>Kurikulum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {course.modules?.map((module, index) => (
            <div
              key={module.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{module.title}</p>
                  {module.description && (
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {module._count?.lessons ?? 0} lesson
                  </p>
                </div>
              </div>

              {isEnrolled ? (
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
