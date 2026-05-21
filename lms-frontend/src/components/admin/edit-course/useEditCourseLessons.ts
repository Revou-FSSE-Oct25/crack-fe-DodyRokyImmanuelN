"use client";

import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { toast } from "sonner";

import API from "@/lib/api";
import { emptyLessonForm, getErrorMessage } from "./form-utils";
import type {
  ApiEnvelope,
  LearningPath,
  Lesson,
  LessonDialogState,
} from "./types";

type UseEditCourseLessonsParams = {
  learningPath: LearningPath | null;
  setLearningPath: Dispatch<SetStateAction<LearningPath | null>>;
};

export function useEditCourseLessons({
  learningPath,
  setLearningPath,
}: UseEditCourseLessonsParams) {
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [isDeletingLesson, setIsDeletingLesson] = useState(false);
  const [lessonDialog, setLessonDialog] = useState<LessonDialogState>({
    open: false,
    mode: "create",
    isLoadingLesson: false,
    form: emptyLessonForm(1),
  });
  const [deleteLessonDialog, setDeleteLessonDialog] = useState<{
    moduleId: string;
    lessonId: string;
    title: string;
  } | null>(null);

  const openCreateLesson = (moduleId: string) => {
    const moduleItem = learningPath?.modules.find(
      (item) => item.id === moduleId,
    );
    setLessonDialog({
      open: true,
      mode: "create",
      moduleId,
      isLoadingLesson: false,
      form: emptyLessonForm((moduleItem?.lessons.length ?? 0) + 1),
    });
  };

  const openEditLesson = async (lesson: Lesson, moduleId: string) => {
    setLessonDialog({
      open: true,
      mode: "edit",
      moduleId,
      lessonId: lesson.id,
      isLoadingLesson: lesson.type === "READING",
      currentType: lesson.type,
      form: {
        title: lesson.title,
        type: lesson.type,
        order: String(lesson.order),
        content: lesson.readingContent?.content ?? "",
        videoUrl: lesson.readingContent?.videoUrl ?? "",
      },
    });

    if (lesson.type !== "READING") return;

    try {
      const response = await API.get<ApiEnvelope<Lesson>>(
        `/lessons/${lesson.slug}`,
      );
      const fullLesson = response.data.data;
      setLessonDialog((previous) => ({
        ...previous,
        isLoadingLesson: false,
        form: {
          ...previous.form,
          content: fullLesson.readingContent?.content ?? "",
          videoUrl: fullLesson.readingContent?.videoUrl ?? "",
        },
      }));
    } catch {
      setLessonDialog((previous) => ({ ...previous, isLoadingLesson: false }));
      toast.warning(
        "Konten reading tidak bisa dimuat, tapi judul dan urutan tetap bisa diedit",
      );
    }
  };

  const upsertLessonInState = (moduleId: string, lesson: Lesson) => {
    setLearningPath((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        modules: previous.modules.map((moduleItem) => {
          if (moduleItem.id !== moduleId) return moduleItem;

          const exists = moduleItem.lessons.some(
            (item) => item.id === lesson.id,
          );
          const lessons = exists
            ? moduleItem.lessons.map((item) =>
                item.id === lesson.id ? lesson : item,
              )
            : [...moduleItem.lessons, lesson];

          return {
            ...moduleItem,
            lessons,
            lessonsLoaded: true,
          };
        }),
      };
    });
  };

  const handleSaveLesson = async () => {
    if (!lessonDialog.moduleId) return;
    if (!lessonDialog.form.title.trim()) {
      toast.error("Judul lesson wajib diisi");
      return;
    }

    setIsSavingLesson(true);
    try {
      const payload = {
        moduleId: lessonDialog.moduleId,
        title: lessonDialog.form.title.trim(),
        type: lessonDialog.form.type,
        order: Number(lessonDialog.form.order) || 1,
        content:
          lessonDialog.form.type === "READING"
            ? lessonDialog.form.content.trim()
            : undefined,
        videoUrl:
          lessonDialog.form.type === "READING" &&
          lessonDialog.form.videoUrl.trim()
            ? lessonDialog.form.videoUrl.trim()
            : undefined,
      };

      if (lessonDialog.mode === "create") {
        const response = await API.post<ApiEnvelope<Lesson>>(
          "/lessons",
          payload,
        );
        upsertLessonInState(lessonDialog.moduleId, response.data.data);
        toast.success("Lesson berhasil dibuat");
      } else if (lessonDialog.lessonId) {
        const response = await API.patch<ApiEnvelope<Lesson>>(
          `/lessons/${lessonDialog.lessonId}`,
          payload,
        );
        upsertLessonInState(lessonDialog.moduleId, response.data.data);
        toast.success("Lesson berhasil disimpan");
      }

      setLessonDialog((previous) => ({ ...previous, open: false }));
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menyimpan lesson"));
    } finally {
      setIsSavingLesson(false);
    }
  };

  const handleDeleteLesson = async () => {
    if (!deleteLessonDialog) return;

    setIsDeletingLesson(true);
    try {
      await API.delete(`/lessons/${deleteLessonDialog.lessonId}`);
      setLearningPath((previous) => {
        if (!previous) return previous;
        return {
          ...previous,
          modules: previous.modules.map((moduleItem) =>
            moduleItem.id === deleteLessonDialog.moduleId
              ? {
                  ...moduleItem,
                  lessons: moduleItem.lessons.filter(
                    (lesson) => lesson.id !== deleteLessonDialog.lessonId,
                  ),
                }
              : moduleItem,
          ),
        };
      });
      toast.success("Lesson berhasil dihapus");
      setDeleteLessonDialog(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus lesson"));
    } finally {
      setIsDeletingLesson(false);
    }
  };

  return {
    lessonDialog,
    setLessonDialog,
    deleteLessonDialog,
    setDeleteLessonDialog,
    isSavingLesson,
    isDeletingLesson,
    openCreateLesson,
    openEditLesson,
    handleSaveLesson,
    handleDeleteLesson,
  };
}
