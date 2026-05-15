'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit2, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import API from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type LearningPathRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  price: number;
  isPublished: boolean;
  _count?: {
    modules: number;
  };
  modules?: Array<{
    id: string;
    _count?: {
      lessons: number;
    };
  }>;
};

type ApiEnvelope<T> = {
  data: T;
  message?: string;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as ApiError;
  return apiError.response?.data?.message ?? fallback;
};

const getLessonCount = (course: LearningPathRow) =>
  course.modules?.reduce((total, moduleItem) => total + (moduleItem._count?.lessons ?? 0), 0) ?? 0;

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<LearningPathRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LearningPathRow | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        const response = await API.get<ApiEnvelope<LearningPathRow[]>>('/learning-paths/admin/all');
        if (isMounted) setCourses(response.data.data);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Gagal memuat daftar kursus'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await API.delete(`/learning-paths/${deleteTarget.id}`);
      setCourses((previous) => previous.filter((course) => course.id !== deleteTarget.id));
      toast.success('Kursus berhasil dihapus');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Gagal menghapus kursus'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Memuat kursus...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Kelola Kursus</h1>
          <p className="text-sm text-muted-foreground">
            Kelola learning path, modul, dan lesson dari halaman edit.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/courses/create">
            <Plus className="h-4 w-4" />
            Buat Kursus
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-sm text-muted-foreground">Belum ada kursus.</p>
            <Button asChild className="mt-4 gap-2">
              <Link href="/admin/courses/create">
                <Plus className="h-4 w-4" />
                Buat Kursus
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="truncate text-lg">{course.title}</CardTitle>
                    <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                      {course.isPublished ? 'Dipublikasikan' : 'Draft'}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <Link href={`/admin/courses/${course.slug}/edit`}>
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(course)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>Slug: {course.slug}</span>
                  <span>Modul: {course._count?.modules ?? course.modules?.length ?? 0}</span>
                  <span>Lesson: {getLessonCount(course)}</span>
                  <span>Harga: Rp {Number(course.price).toLocaleString('id-ID')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kursus?</AlertDialogTitle>
            <AlertDialogDescription>
              Kursus <span className="font-medium text-foreground">{deleteTarget?.title}</span>{' '}
              akan dihapus beserta modul dan lesson di dalamnya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
