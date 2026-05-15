'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import API from '@/lib/api';

import StepIndicator from '@/components/admin/create-course/StepIndicator';
import LearningPathForm from '@/components/admin/create-course/LearningPathForm';
import ModulesForm from '@/components/admin/create-course/ModulesForm';
import LessonsForm from '@/components/admin/create-course/LessonsForm';

import {
  type LearningPathForm as LearningPathFormType,
  type ModuleForm,
  type LessonForm,
  defaultLearningPathForm,
  emptyModule,
  emptyLesson,
} from '@/types/course-form';

export default function CreateCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [learningPathData, setLearningPathData] = useState<LearningPathFormType>(
    defaultLearningPathForm()
  );
  const [modulesList, setModulesList] = useState<ModuleForm[]>([emptyModule(1)]);

  // ─── Learning Path Handlers ────────────────────────────────────────────────

  const handleLearningPathChange = (
    field: keyof LearningPathFormType,
    value: string | boolean
  ) => {
    setLearningPathData((prevData) => ({ ...prevData, [field]: value }));
  };

  const validateLearningPathStep = (): string | null => {
    if (!learningPathData.title.trim()) return 'Judul Learning Path wajib diisi';
    if (!learningPathData.description.trim()) return 'Deskripsi wajib diisi';
    
    const parsedPrice = parseFloat(learningPathData.price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return 'Harga harus berupa angka dan tidak boleh negatif';
    }
    return null;
  };

  // ─── Modules Handlers ──────────────────────────────────────────────────────

  const handleAddModule = () => {
    setModulesList((prevModules) => [
      ...prevModules,
      emptyModule(prevModules.length + 1),
    ]);
  };

  const handleRemoveModule = (moduleId: string) => {
    setModulesList((prevModules) =>
      prevModules
        .filter((module) => module.id !== moduleId)
        .map((module, index) => ({ ...module, order: index + 1 }))
    );
  };

  const handleUpdateModule = (
    moduleId: string,
    field: keyof ModuleForm,
    value: string
  ) => {
    setModulesList((prevModules) =>
      prevModules.map((module) =>
        module.id === moduleId ? { ...module, [field]: value } : module
      )
    );
  };

  const validateModulesStep = (): string | null => {
    const hasEmptyTitle = modulesList.some((module) => !module.title.trim());
    if (hasEmptyTitle) return 'Semua modul harus memiliki judul';
    return null;
  };

  // ─── Lessons Handlers ──────────────────────────────────────────────────────

  const handleAddLesson = (moduleId: string) => {
    setModulesList((prevModules) =>
      prevModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: [
                ...module.lessons,
                emptyLesson(module.lessons.length + 1),
              ],
            }
          : module
      )
    );
  };

  const handleRemoveLesson = (moduleId: string, lessonId: string) => {
    setModulesList((prevModules) =>
      prevModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons
                .filter((lesson) => lesson.id !== lessonId)
                .map((lesson, index) => ({ ...lesson, order: index + 1 })),
            }
          : module
      )
    );
  };

  const handleUpdateLesson = (
    moduleId: string,
    lessonId: string,
    field: keyof LessonForm,
    value: string
  ) => {
    setModulesList((prevModules) =>
      prevModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
              ),
            }
          : module
      )
    );
  };

  const validateLessonsStep = (): string | null => {
    for (const module of modulesList) {
      const hasEmptyLessonTitle = module.lessons.some(
        (lesson) => !lesson.title.trim()
      );
      if (hasEmptyLessonTitle) return 'Semua materi (lesson) harus memiliki judul';
    }
    return null;
  };

  // ─── Navigation ────────────────────────────────────────────────────────────

  const handleNavigateNext = () => {
    const stepValidators: Record<number, () => string | null> = {
      1: validateLearningPathStep,
      2: validateModulesStep,
    };

    const errorMessage = stepValidators[currentStep]?.();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleNavigateBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // ─── Submit Logic ──────────────────────────────────────────────────────────

  const handleSubmitCourse = async () => {
    const errorMessage = validateLessonsStep();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create Learning Path
      const learningPathResponse = await API.post('/learning-paths', {
        title: learningPathData.title,
        description: learningPathData.description,
        thumbnail: learningPathData.thumbnail || undefined,
        price: parseFloat(learningPathData.price),
        isPublished: learningPathData.isPublished,
      });
      const learningPathId: string = learningPathResponse.data.data.id;

      // 2. Create Modules
      for (const moduleItem of modulesList) {
        const moduleResponse = await API.post('/modules', {
          learningPathId,
          title: moduleItem.title,
          description: moduleItem.description || undefined,
          order: moduleItem.order,
        });
        const moduleId: string = moduleResponse.data.data.id;

        // 3. Create Lessons for each module
        for (const lessonItem of moduleItem.lessons) {
        
        const lessonPayload: any = {
            moduleId,
            title: lessonItem.title,
            type: lessonItem.type,
            order: lessonItem.order,
        };

        // Jika tipenya READING, masukkan content dan videoUrl (jika ada)
        if (lessonItem.type === 'READING') {
            lessonPayload.content = lessonItem.content || undefined;
            lessonPayload.videoUrl = lessonItem.videoUrl || undefined;
        }

        // Jika tipenya QUIZ, saat ini hanya mengirim data dasar 
        if (lessonItem.type === 'QUIZ') {
        }

        await API.post('/lessons', lessonPayload);
        }
      }

      toast.success('Course berhasil dibuat!');
      router.push('/admin/courses');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ?? 'Gagal membuat course';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buat Kursus Baru</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ikuti langkah-langkah berikut untuk membuat learning path baru.
          </p>
        </div>

        <StepIndicator currentStep={currentStep} />

        <div className="mt-8">
          {currentStep === 1 && (
            <LearningPathForm
              form={learningPathData}
              onChange={handleLearningPathChange}
            />
          )}
          {currentStep === 2 && (
            <ModulesForm
              modules={modulesList}
              onAdd={handleAddModule}
              onRemove={handleRemoveModule}
              onUpdate={handleUpdateModule}
            />
          )}
          {currentStep === 3 && (
            <LessonsForm
              modules={modulesList}
              onAddLesson={handleAddLesson}
              onRemoveLesson={handleRemoveLesson}
              onUpdateLesson={handleUpdateLesson}
            />
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? () => router.back() : handleNavigateBack}
            disabled={isSubmitting}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {currentStep === 1 ? 'Batal' : 'Kembali'}
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleNavigateNext} className="gap-2">
              Lanjut
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmitCourse}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Buat Course
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
