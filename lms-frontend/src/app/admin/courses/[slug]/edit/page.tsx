'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import API from '@/lib/api';
import { LearningPathDetailsCard } from '@/components/admin/edit-course/LearningPathDetailsCard';
import { LessonDialog } from '@/components/admin/edit-course/LessonDialog';
import { ModuleDialog } from '@/components/admin/edit-course/ModuleDialog';
import { ModulesLessonsCard } from '@/components/admin/edit-course/ModulesLessonsCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  emptyLessonForm,
  emptyModuleForm,
  emptyQuizForm,
  emptyQuizOption,
  emptyQuizQuestion,
  getErrorMessage,
  quizToForm,
} from '@/components/admin/edit-course/form-utils';
import type {
  ApiEnvelope,
  LearningPath,
  LearningPathApi,
  LearningPathForm,
  Lesson,
  LessonDialogState,
  Module,
  ModuleDialogState,
  Quiz,
  QuizDialogState,
} from '@/components/admin/edit-course/types';

export default function EditCoursePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSavingLearningPath, setIsSavingLearningPath] = useState(false);
  const [isSavingModule, setIsSavingModule] = useState(false);
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [isDeletingModule, setIsDeletingModule] = useState(false);
  const [isDeletingLesson, setIsDeletingLesson] = useState(false);
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);
  const [isDeletingQuiz, setIsDeletingQuiz] = useState(false);

  const [learningPathForm, setLearningPathForm] = useState<LearningPathForm>({
    title: '',
    description: '',
    thumbnail: '',
    price: '0',
    isPublished: false,
  });

  const [moduleDialog, setModuleDialog] = useState<ModuleDialogState>({
    open: false,
    mode: 'create',
    form: emptyModuleForm(1),
  });

  const [lessonDialog, setLessonDialog] = useState<LessonDialogState>({
    open: false,
    mode: 'create',
    isLoadingLesson: false,
    form: emptyLessonForm(1),
  });

  const [quizDialog, setQuizDialog] = useState<QuizDialogState>({
    open: false,
    isLoading: false,
    form: emptyQuizForm(),
  });

  const [deleteModuleDialog, setDeleteModuleDialog] = useState<{
    moduleId: string;
    title: string;
  } | null>(null);

  const [deleteLessonDialog, setDeleteLessonDialog] = useState<{
    moduleId: string;
    lessonId: string;
    title: string;
  } | null>(null);

  const [deleteQuizDialog, setDeleteQuizDialog] = useState<{
    quizId: string;
    lessonTitle: string;
  } | null>(null);

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
      const response = await API.get<ApiEnvelope<Lesson[]>>(`/lessons?moduleId=${moduleId}`);
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
      toast.error(getErrorMessage(error, 'Gagal memuat lessons'));
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
        const response = await API.get<ApiEnvelope<LearningPathApi>>(`/learning-paths/${slug}`);
        const data = response.data.data;
        const modules: Module[] = (data.modules ?? []).map((moduleItem) => ({
          ...moduleItem,
          lessons: [],
          isExpanded: false,
          isLoadingLessons: false,
          lessonsLoaded: false,
        }));

        if (!isMounted) return;

        setLearningPath({ ...data, modules });
        setLearningPathForm({
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail ?? '',
          price: String(data.price),
          isPublished: data.isPublished,
        });
      } catch (error) {
        toast.error(getErrorMessage(error, 'Gagal mengambil data kursus'));
        router.push('/admin/courses');
      } finally {
        if (isMounted) setIsPageLoading(false);
      }
    };

    fetchLearningPath();

    return () => {
      isMounted = false;
    };
  }, [router, slug]);

  const toggleModule = (moduleId: string) => {
    const moduleItem = learningPath?.modules.find((item) => item.id === moduleId);
    if (!moduleItem) return;

    const shouldLoadLessons = !moduleItem.isExpanded && !moduleItem.lessonsLoaded;

    setLearningPath((previous) => {
      if (!previous) return previous;
      return {
        ...previous,
        modules: previous.modules.map((item) =>
          item.id === moduleId ? { ...item, isExpanded: !item.isExpanded } : item,
        ),
      };
    });

    if (shouldLoadLessons) {
      void loadLessons(moduleId);
    }
  };

  const handleSaveLearningPath = async () => {
    if (!learningPath) return;
    if (!learningPathForm.title.trim() || !learningPathForm.description.trim()) {
      toast.error('Judul dan deskripsi wajib diisi');
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
        return { ...previous, ...response.data.data, modules: previous.modules };
      });
      toast.success('Learning path berhasil disimpan');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Gagal menyimpan learning path'));
    } finally {
      setIsSavingLearningPath(false);
    }
  };

  const openCreateModule = () => {
    setModuleDialog({
      open: true,
      mode: 'create',
      form: emptyModuleForm((learningPath?.modules.length ?? 0) + 1),
    });
  };

  const openEditModule = (moduleItem: Module) => {
    setModuleDialog({
      open: true,
      mode: 'edit',
      moduleId: moduleItem.id,
      form: {
        title: moduleItem.title,
        description: moduleItem.description ?? '',
        order: String(moduleItem.order),
      },
    });
  };

  const handleSaveModule = async () => {
    if (!learningPath) return;
    if (!moduleDialog.form.title.trim()) {
      toast.error('Judul modul wajib diisi');
      return;
    }

    setIsSavingModule(true);
    try {
      const payload = {
        title: moduleDialog.form.title.trim(),
        description: moduleDialog.form.description.trim() || undefined,
        order: Number(moduleDialog.form.order) || 1,
      };

      if (moduleDialog.mode === 'create') {
        const response = await API.post<ApiEnvelope<Omit<Module, 'lessons' | 'isExpanded' | 'isLoadingLessons' | 'lessonsLoaded'>>>(
          '/modules',
          { ...payload, learningPathId: learningPath.id },
        );
        const createdModule: Module = {
          ...response.data.data,
          lessons: [],
          isExpanded: false,
          isLoadingLessons: false,
          lessonsLoaded: true,
        };

        setLearningPath((previous) => {
          if (!previous) return previous;
          return { ...previous, modules: [...previous.modules, createdModule] };
        });
        toast.success('Modul berhasil dibuat');
      } else if (moduleDialog.moduleId) {
        const response = await API.patch<ApiEnvelope<Module>>(
          `/modules/${moduleDialog.moduleId}`,
          payload,
        );
        const updatedModule = response.data.data;

        setLearningPath((previous) => {
          if (!previous) return previous;
          return {
            ...previous,
            modules: previous.modules.map((moduleItem) =>
              moduleItem.id === moduleDialog.moduleId
                ? {
                    ...moduleItem,
                    title: updatedModule.title,
                    slug: updatedModule.slug,
                    description: updatedModule.description,
                    order: updatedModule.order,
                  }
                : moduleItem,
            ),
          };
        });
        toast.success('Modul berhasil disimpan');
      }

      setModuleDialog((previous) => ({ ...previous, open: false }));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Gagal menyimpan modul'));
    } finally {
      setIsSavingModule(false);
    }
  };

  const handleDeleteModule = async () => {
    if (!deleteModuleDialog) return;

    setIsDeletingModule(true);
    try {
      await API.delete(`/modules/${deleteModuleDialog.moduleId}`);
      setLearningPath((previous) => {
        if (!previous) return previous;
        return {
          ...previous,
          modules: previous.modules.filter(
            (moduleItem) => moduleItem.id !== deleteModuleDialog.moduleId,
          ),
        };
      });
      toast.success('Modul berhasil dihapus');
      setDeleteModuleDialog(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Gagal menghapus modul'));
    } finally {
      setIsDeletingModule(false);
    }
  };

  const openCreateLesson = (moduleId: string) => {
    const moduleItem = learningPath?.modules.find((item) => item.id === moduleId);
    setLessonDialog({
      open: true,
      mode: 'create',
      moduleId,
      isLoadingLesson: false,
      form: emptyLessonForm((moduleItem?.lessons.length ?? 0) + 1),
    });
  };

  const openEditLesson = async (lesson: Lesson, moduleId: string) => {
    setLessonDialog({
      open: true,
      mode: 'edit',
      moduleId,
      lessonId: lesson.id,
      isLoadingLesson: lesson.type === 'READING',
      currentType: lesson.type,
      form: {
        title: lesson.title,
        type: lesson.type,
        order: String(lesson.order),
        content: lesson.readingContent?.content ?? '',
        videoUrl: lesson.readingContent?.videoUrl ?? '',
      },
    });

    if (lesson.type !== 'READING') return;

    try {
      const response = await API.get<ApiEnvelope<Lesson>>(`/lessons/${lesson.slug}`);
      const fullLesson = response.data.data;
      setLessonDialog((previous) => ({
        ...previous,
        isLoadingLesson: false,
        form: {
          ...previous.form,
          content: fullLesson.readingContent?.content ?? '',
          videoUrl: fullLesson.readingContent?.videoUrl ?? '',
        },
      }));
    } catch {
      setLessonDialog((previous) => ({ ...previous, isLoadingLesson: false }));
      toast.warning('Konten reading tidak bisa dimuat, tapi judul dan urutan tetap bisa diedit');
    }
  };

  const upsertLessonInState = (moduleId: string, lesson: Lesson) => {
    setLearningPath((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        modules: previous.modules.map((moduleItem) => {
          if (moduleItem.id !== moduleId) return moduleItem;

          const exists = moduleItem.lessons.some((item) => item.id === lesson.id);
          const lessons = exists
            ? moduleItem.lessons.map((item) => (item.id === lesson.id ? lesson : item))
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
      toast.error('Judul lesson wajib diisi');
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
          lessonDialog.form.type === 'READING'
            ? lessonDialog.form.content.trim()
            : undefined,
        videoUrl:
          lessonDialog.form.type === 'READING' && lessonDialog.form.videoUrl.trim()
            ? lessonDialog.form.videoUrl.trim()
            : undefined,
      };

      if (lessonDialog.mode === 'create') {
        const response = await API.post<ApiEnvelope<Lesson>>('/lessons', payload);
        upsertLessonInState(lessonDialog.moduleId, response.data.data);
        toast.success('Lesson berhasil dibuat');
      } else if (lessonDialog.lessonId) {
        const response = await API.patch<ApiEnvelope<Lesson>>(
          `/lessons/${lessonDialog.lessonId}`,
          payload,
        );
        upsertLessonInState(lessonDialog.moduleId, response.data.data);
        toast.success('Lesson berhasil disimpan');
      }

      setLessonDialog((previous) => ({ ...previous, open: false }));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Gagal menyimpan lesson'));
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
      toast.success('Lesson berhasil dihapus');
      setDeleteLessonDialog(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Gagal menghapus lesson'));
    } finally {
      setIsDeletingLesson(false);
    }
  };

  const openManageQuiz = async (lesson: Lesson) => {
    setQuizDialog({
      open: true,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      isLoading: true,
      form: emptyQuizForm(),
    });

    try {
      const response = await API.get<ApiEnvelope<Quiz>>(`/quizzes/admin/lesson/${lesson.id}`);
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
    field: 'text' | 'points' | 'order',
    value: string,
  ) => {
    setQuizDialog((previous) => ({
      ...previous,
      form: {
        ...previous.form,
        questions: previous.form.questions.map((question) =>
          question.id === questionId ? { ...question, [field]: value } : question,
        ),
      },
    }));
  };

  const updateQuizOption = (
    questionId: string,
    optionId: string,
    field: 'text' | 'isCorrect',
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
                return field === 'isCorrect'
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
          .map((question, index) => ({ ...question, order: String(index + 1) })),
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
            ? { ...question, options: [...question.options, emptyQuizOption(false)] }
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
          if (question.id !== questionId || question.options.length <= 2) return question;

          const options = question.options.filter((option) => option.id !== optionId);
          const hasCorrectOption = options.some((option) => option.isCorrect);

          return {
            ...question,
            options: hasCorrectOption
              ? options
              : options.map((option, index) => ({ ...option, isCorrect: index === 0 })),
          };
        }),
      },
    }));
  };

  const validateQuizForm = () => {
    if (!quizDialog.lessonId) {
      toast.error('Lesson quiz tidak ditemukan');
      return false;
    }

    if (Number(quizDialog.form.timeLimit) < 60) {
      toast.error('Durasi quiz minimal 60 detik');
      return false;
    }

    if (Number(quizDialog.form.passingScore) < 1) {
      toast.error('Nilai lulus minimal 1');
      return false;
    }

    if (quizDialog.form.questions.length === 0) {
      toast.error('Quiz harus memiliki minimal satu pertanyaan');
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
        timeLimit: Number(quizDialog.form.timeLimit) || 60,
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
        toast.success('Quiz berhasil disimpan');
      } else {
        const response = await API.post<ApiEnvelope<Quiz>>('/quizzes', payload);
        const quiz = response.data.data;
        setQuizDialog((previous) => ({
          ...previous,
          quizId: quiz.id,
          form: quizToForm(quiz),
        }));
        toast.success('Quiz berhasil dibuat');
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Gagal menyimpan quiz'));
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
      toast.success('Quiz berhasil dihapus');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Gagal menghapus quiz'));
    } finally {
      setIsDeletingQuiz(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Memuat course...
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <p className="text-sm text-muted-foreground">Kursus tidak ditemukan.</p>
      </div>
    );
  }

  const isReadingDialog =
    lessonDialog.form.type === 'READING' || lessonDialog.currentType === 'READING';

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="-ml-3 gap-2">
            <Link href="/admin/courses">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Edit Learning Path</h1>
          <p className="text-sm text-muted-foreground">{learningPath.title}</p>
        </div>

        <Badge variant={learningPathForm.isPublished ? 'default' : 'secondary'}>
          {learningPathForm.isPublished ? 'Dipublikasikan' : 'Draft'}
        </Badge>
      </div>

      <LearningPathDetailsCard
        form={learningPathForm}
        isSaving={isSavingLearningPath}
        onFormChange={setLearningPathForm}
        onSave={handleSaveLearningPath}
      />

      <ModulesLessonsCard
        modules={sortedModules}
        onCreateModule={openCreateModule}
        onToggleModule={toggleModule}
        onEditModule={openEditModule}
        onDeleteModule={(moduleItem) =>
          setDeleteModuleDialog({
            moduleId: moduleItem.id,
            title: moduleItem.title,
          })
        }
        onCreateLesson={openCreateLesson}
        onEditLesson={(lesson, moduleId) => void openEditLesson(lesson, moduleId)}
        onDeleteLesson={(moduleId, lesson) =>
          setDeleteLessonDialog({
            moduleId,
            lessonId: lesson.id,
            title: lesson.title,
          })
        }
        onManageQuiz={(lesson) => void openManageQuiz(lesson)}
      />

      <ModuleDialog
        dialog={moduleDialog}
        isSaving={isSavingModule}
        onOpenChange={(open) => setModuleDialog((previous) => ({ ...previous, open }))}
        onFormChange={(form) => setModuleDialog((previous) => ({ ...previous, form }))}
        onSave={handleSaveModule}
      />

      <LessonDialog
        dialog={lessonDialog}
        isSaving={isSavingLesson}
        isReading={isReadingDialog}
        onOpenChange={(open) => setLessonDialog((previous) => ({ ...previous, open }))}
        onFormChange={(form) => setLessonDialog((previous) => ({ ...previous, form }))}
        onSave={handleSaveLesson}
      />

      <Dialog
        open={quizDialog.open}
        onOpenChange={(open) =>
          !isSavingQuiz && setQuizDialog((previous) => ({ ...previous, open }))
        }
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Kelola Quiz</DialogTitle>
          </DialogHeader>

          {quizDialog.isLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Memuat quiz...
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                {quizDialog.lessonTitle}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="quiz-time-limit">Durasi (detik)</Label>
                  <Input
                    id="quiz-time-limit"
                    type="number"
                    min="60"
                    value={quizDialog.form.timeLimit}
                    onChange={(event) =>
                      setQuizDialog((previous) => ({
                        ...previous,
                        form: { ...previous.form, timeLimit: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-passing-score">Nilai Lulus</Label>
                  <Input
                    id="quiz-passing-score"
                    type="number"
                    min="1"
                    max="100"
                    value={quizDialog.form.passingScore}
                    onChange={(event) =>
                      setQuizDialog((previous) => ({
                        ...previous,
                        form: { ...previous.form, passingScore: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center gap-3 rounded-md border px-3 py-2">
                  <Switch
                    checked={quizDialog.form.isFinalExam}
                    onCheckedChange={(checked) =>
                      setQuizDialog((previous) => ({
                        ...previous,
                        form: { ...previous.form, isFinalExam: checked },
                      }))
                    }
                  />
                  <div>
                    <p className="text-sm font-medium">Final Exam</p>
                    <p className="text-xs text-muted-foreground">Sekali percobaan</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Pertanyaan</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addQuizQuestion}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Pertanyaan
                  </Button>
                </div>

                {quizDialog.form.questions.map((question, questionIndex) => (
                  <div key={question.id} className="space-y-4 rounded-md border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="secondary">Pertanyaan {questionIndex + 1}</Badge>
                      {quizDialog.form.questions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeQuizQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Pertanyaan</Label>
                      <Textarea
                        rows={3}
                        value={question.text}
                        onChange={(event) =>
                          updateQuizQuestion(question.id, 'text', event.target.value)
                        }
                        placeholder="Tulis pertanyaan quiz..."
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Poin</Label>
                        <Input
                          type="number"
                          min="1"
                          value={question.points}
                          onChange={(event) =>
                            updateQuizQuestion(question.id, 'points', event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Urutan</Label>
                        <Input
                          type="number"
                          min="1"
                          value={question.order}
                          onChange={(event) =>
                            updateQuizQuestion(question.id, 'order', event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Opsi Jawaban</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addQuizOption(question.id)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Tambah Opsi
                        </Button>
                      </div>

                      {question.options.map((option, optionIndex) => (
                        <div key={option.id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={option.isCorrect}
                            onChange={() =>
                              updateQuizOption(question.id, option.id, 'isCorrect', true)
                            }
                            className="h-4 w-4"
                            aria-label={`Jawaban benar opsi ${optionIndex + 1}`}
                          />
                          <Input
                            value={option.text}
                            onChange={(event) =>
                              updateQuizOption(question.id, option.id, 'text', event.target.value)
                            }
                            placeholder={`Opsi ${optionIndex + 1}`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            disabled={question.options.length <= 2}
                            onClick={() => removeQuizOption(question.id, option.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            <div>
              {quizDialog.quizId && (
                <Button
                  type="button"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  disabled={isSavingQuiz || quizDialog.isLoading}
                  onClick={() =>
                    setDeleteQuizDialog({
                      quizId: quizDialog.quizId as string,
                      lessonTitle: quizDialog.lessonTitle ?? 'Quiz',
                    })
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus Quiz
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setQuizDialog((previous) => ({ ...previous, open: false }))}
                disabled={isSavingQuiz}
              >
                Batal
              </Button>
              <Button onClick={handleSaveQuiz} disabled={isSavingQuiz || quizDialog.isLoading}>
                {isSavingQuiz && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Quiz
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteModuleDialog !== null}
        onOpenChange={(open) => !open && !isDeletingModule && setDeleteModuleDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus modul?</AlertDialogTitle>
            <AlertDialogDescription>
              Modul{' '}
              <span className="font-medium text-foreground">{deleteModuleDialog?.title}</span> dan
              lesson di dalamnya akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingModule}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteModule} disabled={isDeletingModule}>
              {isDeletingModule ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteLessonDialog !== null}
        onOpenChange={(open) => !open && !isDeletingLesson && setDeleteLessonDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              Lesson{' '}
              <span className="font-medium text-foreground">{deleteLessonDialog?.title}</span> akan
              dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingLesson}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLesson} disabled={isDeletingLesson}>
              {isDeletingLesson ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteQuizDialog !== null}
        onOpenChange={(open) => !open && !isDeletingQuiz && setDeleteQuizDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Quiz untuk lesson{' '}
              <span className="font-medium text-foreground">{deleteQuizDialog?.lessonTitle}</span>{' '}
              akan dihapus beserta semua pertanyaan, opsi jawaban, dan attempt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingQuiz}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuiz} disabled={isDeletingQuiz}>
              {isDeletingQuiz ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
