import type {
  ApiError,
  LessonForm,
  ModuleForm,
  Quiz,
  QuizForm,
  QuizOptionForm,
  QuizQuestionForm,
} from './types';

const createLocalId = () => Math.random().toString(36).slice(2, 10);

export const emptyModuleForm = (order: number): ModuleForm => ({
  title: '',
  description: '',
  order: String(order),
});

export const emptyLessonForm = (order: number): LessonForm => ({
  title: '',
  type: 'READING',
  order: String(order),
  content: '',
  videoUrl: '',
});

export const emptyQuizOption = (isCorrect = false): QuizOptionForm => ({
  id: createLocalId(),
  text: '',
  isCorrect,
});

export const emptyQuizQuestion = (order: number): QuizQuestionForm => ({
  id: createLocalId(),
  text: '',
  points: '10',
  order: String(order),
  options: [emptyQuizOption(true), emptyQuizOption(false)],
});

export const emptyQuizForm = (): QuizForm => ({
  timeLimit: '300',
  passingScore: '70',
  isFinalExam: false,
  questions: [emptyQuizQuestion(1)],
});

export const quizToForm = (quiz: Quiz): QuizForm => ({
  timeLimit: String(quiz.timeLimit),
  passingScore: String(quiz.passingScore),
  isFinalExam: quiz.isFinalExam,
  questions: quiz.questions.map((question) => ({
    id: question.id,
    text: question.text,
    points: String(question.points),
    order: String(question.order),
    options: question.options.map((option) => ({
      id: option.id,
      text: option.text,
      isCorrect: option.isCorrect,
    })),
  })),
});

export const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as ApiError;
  return apiError.response?.data?.message ?? fallback;
};
