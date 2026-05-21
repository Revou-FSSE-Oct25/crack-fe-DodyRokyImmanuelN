"use client";

import { useState } from "react";
import { toast } from "sonner";

import API from "@/lib/api";
import {
  emptyQuizForm,
  emptyQuizOption,
  emptyQuizQuestion,
  getErrorMessage,
  quizToForm,
} from "./form-utils";
import type { ApiEnvelope, Lesson, Quiz, QuizDialogState } from "./types";

export function useEditCourseQuiz() {
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);
  const [isDeletingQuiz, setIsDeletingQuiz] = useState(false);
  const [quizDialog, setQuizDialog] = useState<QuizDialogState>({
    open: false,
    isLoading: false,
    form: emptyQuizForm(),
  });
  const [deleteQuizDialog, setDeleteQuizDialog] = useState<{
    quizId: string;
    lessonTitle: string;
  } | null>(null);

  const openManageQuiz = async (lesson: Lesson) => {
    setQuizDialog({
      open: true,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      isLoading: true,
      form: emptyQuizForm(),
    });

    try {
      const response = await API.get<ApiEnvelope<Quiz>>(
        `/quizzes/admin/lesson/${lesson.id}`,
      );
      const quiz = response.data.data;
      setQuizDialog({
        open: true,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        quizId: quiz.id,
        isLoading: false,
        form: quizToForm(quiz),
      });
    } catch {
      setQuizDialog((previous) => ({
        ...previous,
        isLoading: false,
        form: emptyQuizForm(),
      }));
    }
  };

  const updateQuizQuestion = (
    questionId: string,
    field: "text" | "points" | "order",
    value: string,
  ) => {
    setQuizDialog((previous) => ({
      ...previous,
      form: {
        ...previous.form,
        questions: previous.form.questions.map((question) =>
          question.id === questionId
            ? { ...question, [field]: value }
            : question,
        ),
      },
    }));
  };

  const updateQuizOption = (
    questionId: string,
    optionId: string,
    field: "text" | "isCorrect",
    value: string | boolean,
  ) => {
    setQuizDialog((previous) => ({
      ...previous,
      form: {
        ...previous.form,
        questions: previous.form.questions.map((question) => {
          if (question.id !== questionId) return question;

          return {
            ...question,
            options: question.options.map((option) => {
              if (option.id !== optionId) {
                return field === "isCorrect"
                  ? { ...option, isCorrect: false }
                  : option;
              }

              return {
                ...option,
                [field]: value,
              };
            }),
          };
        }),
      },
    }));
  };

  const addQuizQuestion = () => {
    setQuizDialog((previous) => ({
      ...previous,
      form: {
        ...previous.form,
        questions: [
          ...previous.form.questions,
          emptyQuizQuestion(previous.form.questions.length + 1),
        ],
      },
    }));
  };

  const removeQuizQuestion = (questionId: string) => {
    setQuizDialog((previous) => ({
      ...previous,
      form: {
        ...previous.form,
        questions: previous.form.questions
          .filter((question) => question.id !== questionId)
          .map((question, index) => ({
            ...question,
            order: String(index + 1),
          })),
      },
    }));
  };

  const addQuizOption = (questionId: string) => {
    setQuizDialog((previous) => ({
      ...previous,
      form: {
        ...previous.form,
        questions: previous.form.questions.map((question) =>
          question.id === questionId
            ? {
                ...question,
                options: [...question.options, emptyQuizOption(false)],
              }
            : question,
        ),
      },
    }));
  };

  const removeQuizOption = (questionId: string, optionId: string) => {
    setQuizDialog((previous) => ({
      ...previous,
      form: {
        ...previous.form,
        questions: previous.form.questions.map((question) => {
          if (question.id !== questionId || question.options.length <= 2) {
            return question;
          }

          const options = question.options.filter(
            (option) => option.id !== optionId,
          );
          const hasCorrectOption = options.some((option) => option.isCorrect);

          return {
            ...question,
            options: hasCorrectOption
              ? options
              : options.map((option, index) => ({
                  ...option,
                  isCorrect: index === 0,
                })),
          };
        }),
      },
    }));
  };

  const validateQuizForm = () => {
    if (!quizDialog.lessonId) {
      toast.error("Lesson quiz tidak ditemukan");
      return false;
    }

    if (Number(quizDialog.form.timeLimit) < 1) {
      toast.error("Durasi quiz minimal 1 menit");
      return false;
    }

    if (Number(quizDialog.form.passingScore) < 1) {
      toast.error("Nilai lulus minimal 1");
      return false;
    }

    if (quizDialog.form.questions.length === 0) {
      toast.error("Quiz harus memiliki minimal satu pertanyaan");
      return false;
    }

    for (const [index, question] of quizDialog.form.questions.entries()) {
      if (!question.text.trim()) {
        toast.error(`Pertanyaan ${index + 1} wajib diisi`);
        return false;
      }

      if (question.options.length < 2) {
        toast.error(`Pertanyaan ${index + 1} minimal punya dua opsi`);
        return false;
      }

      if (!question.options.some((option) => option.isCorrect)) {
        toast.error(`Pertanyaan ${index + 1} harus punya jawaban benar`);
        return false;
      }

      if (question.options.some((option) => !option.text.trim())) {
        toast.error(`Semua opsi di pertanyaan ${index + 1} wajib diisi`);
        return false;
      }
    }

    return true;
  };

  const handleSaveQuiz = async () => {
    if (!validateQuizForm()) return;

    setIsSavingQuiz(true);
    try {
      const payload = {
        lessonId: quizDialog.lessonId,
        timeLimit: (Number(quizDialog.form.timeLimit) || 1) * 60,
        passingScore: Number(quizDialog.form.passingScore) || 70,
        isFinalExam: quizDialog.form.isFinalExam,
        questions: quizDialog.form.questions.map((question, index) => ({
          text: question.text.trim(),
          points: Number(question.points) || 10,
          order: Number(question.order) || index + 1,
          options: question.options.map((option) => ({
            text: option.text.trim(),
            isCorrect: option.isCorrect,
          })),
        })),
      };

      if (quizDialog.quizId) {
        const response = await API.patch<ApiEnvelope<Quiz>>(
          `/quizzes/${quizDialog.quizId}`,
          payload,
        );
        const quiz = response.data.data;
        setQuizDialog((previous) => ({
          ...previous,
          quizId: quiz.id,
          form: quizToForm(quiz),
        }));
        toast.success("Quiz berhasil disimpan");
      } else {
        const response = await API.post<ApiEnvelope<Quiz>>("/quizzes", payload);
        const quiz = response.data.data;
        setQuizDialog((previous) => ({
          ...previous,
          quizId: quiz.id,
          form: quizToForm(quiz),
        }));
        toast.success("Quiz berhasil dibuat");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menyimpan quiz"));
    } finally {
      setIsSavingQuiz(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!deleteQuizDialog) return;

    setIsDeletingQuiz(true);
    try {
      await API.delete(`/quizzes/${deleteQuizDialog.quizId}`);
      setQuizDialog((previous) => ({
        ...previous,
        quizId: undefined,
        form: emptyQuizForm(),
      }));
      setDeleteQuizDialog(null);
      toast.success("Quiz berhasil dihapus");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus quiz"));
    } finally {
      setIsDeletingQuiz(false);
    }
  };

  return {
    quizDialog,
    setQuizDialog,
    deleteQuizDialog,
    setDeleteQuizDialog,
    isSavingQuiz,
    isDeletingQuiz,
    openManageQuiz,
    addQuizQuestion,
    removeQuizQuestion,
    updateQuizQuestion,
    addQuizOption,
    removeQuizOption,
    updateQuizOption,
    handleSaveQuiz,
    handleDeleteQuiz,
  };
}
