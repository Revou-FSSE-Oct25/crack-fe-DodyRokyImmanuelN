import type { LessonType } from '@/types';

export type ApiEnvelope<T> = {
  data: T;
  message?: string;
};

export type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export type ReadingContent = {
  content: string;
  videoUrl: string | null;
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  type: LessonType;
  order: number;
  readingContent?: ReadingContent | null;
};

export type Module = {
  id: string;
  learningPathId: string;
  title: string;
  slug: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
  isExpanded: boolean;
  isLoadingLessons: boolean;
  lessonsLoaded: boolean;
};

export type LearningPath = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  price: number;
  isPublished: boolean;
  modules: Module[];
};

export type Course = LearningPath;

export type LearningPathApi = Omit<LearningPath, 'modules'> & {
  modules?: Array<Omit<Module, 'lessons' | 'isExpanded' | 'isLoadingLessons' | 'lessonsLoaded'>>;
};

export type LearningPathForm = {
  title: string;
  description: string;
  thumbnail: string;
  price: string;
  isPublished: boolean;
};

export type ModuleForm = {
  title: string;
  description: string;
  order: string;
};

export type LessonForm = {
  title: string;
  type: LessonType;
  order: string;
  content: string;
  videoUrl: string;
};

export type ModuleDialogState = {
  open: boolean;
  mode: 'create' | 'edit';
  moduleId?: string;
  form: ModuleForm;
};

export type LessonDialogState = {
  open: boolean;
  mode: 'create' | 'edit';
  moduleId?: string;
  lessonId?: string;
  isLoadingLesson: boolean;
  currentType?: LessonType;
  form: LessonForm;
};

export type QuizOptionForm = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type QuizQuestionForm = {
  id: string;
  text: string;
  points: string;
  order: string;
  options: QuizOptionForm[];
};

export type QuizForm = {
  timeLimit: string;
  passingScore: string;
  isFinalExam: boolean;
  questions: QuizQuestionForm[];
};

export type QuizOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type QuizQuestion = {
  id: string;
  text: string;
  points: number;
  order: number;
  options: QuizOption[];
};

export type Quiz = {
  id: string;
  lessonId: string;
  timeLimit: number;
  passingScore: number;
  isFinalExam: boolean;
  questions: QuizQuestion[];
};

export type QuizDialogState = {
  open: boolean;
  lessonId?: string;
  lessonTitle?: string;
  quizId?: string;
  isLoading: boolean;
  form: QuizForm;
};
