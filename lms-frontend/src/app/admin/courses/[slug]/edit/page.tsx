'use client';

import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { EditCourseDetailsSection } from '@/components/admin/edit-course/EditCourseDetailsSection';
import { EditCourseDialogs } from '@/components/admin/edit-course/EditCourseDialogs';
import { EditCourseHeader } from '@/components/admin/edit-course/EditCourseHeader';
import { EditCourseModulesSection } from '@/components/admin/edit-course/EditCourseModulesSection';
import { useEditCourse } from '@/components/admin/edit-course/useEditCourse';

export default function EditCoursePage() {
  const params = useParams<{ slug: string }>();
  const course = useEditCourse(params.slug);

  if (course.isPageLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Memuat course...
      </div>
    );
  }

  if (!course.learningPath) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <p className="text-sm text-muted-foreground">Kursus tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <EditCourseHeader
        title={course.learningPath.title}
        isPublished={course.learningPathForm.isPublished}
      />
      <EditCourseDetailsSection course={course} />
      <EditCourseModulesSection course={course} />
      <EditCourseDialogs course={course} />
    </div>
  );
}
