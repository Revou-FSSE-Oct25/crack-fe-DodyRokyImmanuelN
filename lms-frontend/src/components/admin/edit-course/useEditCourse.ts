"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import API from "@/lib/api";
import { getErrorMessage } from "./form-utils";
import type {
  ApiEnvelope,
  LearningPath,
  LearningPathApi,
  LearningPathForm,
  Lesson,
  Module,
} from "./types";
import { useEditCourseLessons } from "./useEditCourseLessons";
import { useEditCourseModules } from "./useEditCourseModules";
import { useEditCourseQuiz } from "./useEditCourseQuiz";

const toEditableModules = (
  modules: LearningPathApi["modules"] = [],
): Module[] =>
  modules.map((moduleItem) => ({
    ...moduleItem,
    lessons: [],
    isExpanded: false,
    isLoadingLessons: false,
    lessonsLoaded: false,
  }));

const toLearningPathForm = (
  learningPath: LearningPathApi,
): LearningPathForm => ({
  title: learningPath.title,
  description: learningPath.description,
  thumbnail: learningPath.thumbnail ?? "",
  price: String(learningPath.price),
  isPublished: learningPath.isPublished,
});

export function useEditCourse(slug: string) {
  const router = useRouter();

  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSavingLearningPath, setIsSavingLearningPath] = useState(false);
  const [learningPathForm, setLearningPathForm] = useState<LearningPathForm>({
    title: "",
    description: "",
    thumbnail: "",
    price: "0",
    isPublished: false,
  });

  const sortedModules = useMemo(
    () => [...(learningPath?.modules ?? [])].sort((a, b) => a.order - b.order),
    [learningPath?.modules],
  );

  const loadLessons = useCallback(async (moduleId: string) => {
    setLearningPath((previous) => {
      if (!previous) return previous;
      return {
        ...previous,
        modules: previous.modules.map((moduleItem) =>
          moduleItem.id === moduleId
            ? { ...moduleItem, isLoadingLessons: true }
            : moduleItem,
        ),
      };
    });

    try {
      const response = await API.get<ApiEnvelope<Lesson[]>>(
        `/lessons?moduleId=${moduleId}`,
      );
      const lessons = response.data.data;

      setLearningPath((previous) => {
        if (!previous) return previous;
        return {
          ...previous,
          modules: previous.modules.map((moduleItem) =>
            moduleItem.id === moduleId
              ? {
                  ...moduleItem,
                  lessons,
                  isLoadingLessons: false,
                  lessonsLoaded: true,
                }
              : moduleItem,
          ),
        };
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memuat lessons"));
      setLearningPath((previous) => {
        if (!previous) return previous;
        return {
          ...previous,
          modules: previous.modules.map((moduleItem) =>
            moduleItem.id === moduleId
              ? { ...moduleItem, isLoadingLessons: false }
              : moduleItem,
          ),
        };
      });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchLearningPath = async () => {
      try {
        const response = await API.get<ApiEnvelope<LearningPathApi>>(
          `/learning-paths/${slug}`,
        );
        const data = response.data.data;

        if (!isMounted) return;

        setLearningPath({ ...data, modules: toEditableModules(data.modules) });
        setLearningPathForm(toLearningPathForm(data));
      } catch (error) {
        toast.error(getErrorMessage(error, "Gagal mengambil data kursus"));
        router.push("/admin/courses");
      } finally {
        if (isMounted) setIsPageLoading(false);
      }
    };

    void fetchLearningPath();

    return () => {
      isMounted = false;
    };
  }, [router, slug]);

  const handleSaveLearningPath = async () => {
    if (!learningPath) return;
    if (
      !learningPathForm.title.trim() ||
      !learningPathForm.description.trim()
    ) {
      toast.error("Judul dan deskripsi wajib diisi");
      return;
    }

    setIsSavingLearningPath(true);
    try {
      const response = await API.patch<ApiEnvelope<LearningPath>>(
        `/learning-paths/${learningPath.id}`,
        {
          title: learningPathForm.title.trim(),
          description: learningPathForm.description.trim(),
          thumbnail: learningPathForm.thumbnail.trim() || undefined,
          price: Number(learningPathForm.price) || 0,
          isPublished: learningPathForm.isPublished,
        },
      );

      setLearningPath((previous) => {
        if (!previous) return previous;
        return {
          ...previous,
          ...response.data.data,
          modules: previous.modules,
        };
      });
      toast.success("Learning path berhasil disimpan");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menyimpan learning path"));
    } finally {
      setIsSavingLearningPath(false);
    }
  };

  const moduleActions = useEditCourseModules({
    learningPath,
    setLearningPath,
    loadLessons,
  });
  const lessonActions = useEditCourseLessons({ learningPath, setLearningPath });
  const quizActions = useEditCourseQuiz();

  const isReadingDialog =
    lessonActions.lessonDialog.form.type === "READING" ||
    lessonActions.lessonDialog.currentType === "READING";

  return {
    learningPath,
    learningPathForm,
    setLearningPathForm,
    isPageLoading,
    isSavingLearningPath,
    sortedModules,
    isReadingDialog,
    handleSaveLearningPath,
    ...moduleActions,
    ...lessonActions,
    ...quizActions,
  };
}

export type UseEditCourseReturn = ReturnType<typeof useEditCourse>;
