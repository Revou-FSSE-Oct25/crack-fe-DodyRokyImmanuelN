// ============================================================
// ENUMS — mirror Prisma schema
// ============================================================

export type Role = 'ADMIN' | 'USER';
export type LessonType = 'READING' | 'QUIZ';
export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type CertificateType = 'MODULE' | 'LEARNING_PATH';

// ============================================================
// USER
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  // password, refreshToken, passwordResetToken tidak dikirim ke frontend
}

// ============================================================
// LEARNING PATH
// ============================================================

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  price: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  modules: Module[];
}

export interface LearningPathSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  price: number;
  _count: {
    modules: number;
  };
}
// ============================================================
// MODULE
// ============================================================

export interface Module {
  id: string;
  learningPathId: string;
  title: string;
  slug: string;
  description: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  lessons: Lesson[];
  _count?: { lessons: number };
}

// ============================================================
// LESSON
// ============================================================

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  type: LessonType;
  order: number;
  createdAt: string;
  updatedAt: string;
  readingContent?: ReadingContent;
  quiz?: Quiz;
}

export interface ReadingContent {
  id: string;
  lessonId: string;
  content: string;
  videoUrl: string | null;
}

// ============================================================
// QUIZ
// ============================================================

export interface Quiz {
  id: string;
  lessonId: string;
  timeLimit: number;       // dalam menit
  passingScore: number;    // nilai minimum lulus (misal 70)
  isFinalExam: boolean;
  questions: Question[];
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  points: number;
  order: number;
  options: Option[];
}

export interface Option {
  id: string;
  questionId: string;
  text: string;
  // isCorrect tidak dikirim saat quiz berlangsung, hanya setelah submit
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  isPassed: boolean;
  attemptNumber: number;
  submittedAt: string;
}

export interface QuizSubmitPayload {
  answers: { questionId: string; optionId: string }[];
}

export interface QuizResult {
  score: number;
  isPassed: boolean;
  attemptNumber: number;
  submittedAt: string;
}

// ============================================================
// ENROLLMENT
// ============================================================

export interface Enrollment {
  id: string;
  userId?: string;
  learningPathId?: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt: string | null;
  learningPath: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
    modules: {
      id: string;
      _count: { lessons: number };
    }[];
  };
  progress: {
    completedLessons: number;
    totalLessons: number;
    percentage: number;
  };
}

// ============================================================
// PROGRESS
// ============================================================

export interface Progress {
  id: string;
  userId: string;
  lessonId: string;
  status: ProgressStatus;
  score: number | null;      // ada di schema
  completedAt: string | null;
  lesson?: Lesson;
}

export interface ModuleProgress {
  moduleId: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  lessons: {
    id: string;
    moduleId: string;
    title: string;
    type: LessonType;
    order: number;
    createdAt: string;
    updatedAt: string;
    progress: ProgressStatus;
    score: number | null;
    completedAt: string | null;
  }[];
}

// ============================================================
// PAYMENT
// ============================================================

export interface Payment {
  id: string;
  userId: string;
  learningPathId: string;
  amount: number;
  status: PaymentStatus;
  xenditInvoiceId: string | null;
  xenditPaymentUrl: string | null;  // URL redirect ke halaman bayar Xendit
  paidAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  learningPath?: LearningPath;
}

export interface CreateInvoicePayload {
  learningPathId: string;
}

export interface InvoiceResponse {
  xenditPaymentUrl: string;
  paymentId: string;
  amount: number;
  expiredAt: string;
}

// ============================================================
// CERTIFICATE
// ============================================================

export interface Certificate {
  id: string;
  userId: string;
  type: CertificateType;
  moduleId: string | null;
  learningPathId: string | null;
  code: string;
  issuedAt: string;
  module?: Module;
  learningPath?: LearningPath;
}

// ============================================================
// AUTH
// ============================================================

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}
export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface UpdateProfilePayload {
  name?: string;
  avatar?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// ============================================================
// API RESPONSE WRAPPER
// ============================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}


// ============================================================
// AI
// ============================================================

export interface AiChatPayload {
  message: string;
  lessonId: string;
}

export interface AiChatResponse {
  reply: string;
  context: {
    lesson: string;
    module: string;
    progressSummary: string;
  };
}