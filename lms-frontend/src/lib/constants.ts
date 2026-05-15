export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Learnexa';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const ENDPOINTS = {
  // Auth
  auth: {
    login:           '/auth/login',
    register:        '/auth/register',
    logout:          '/auth/logout',
    refresh:         '/auth/refresh',
    forgotPassword:  '/auth/forgot-password',
    verifyToken:     '/auth/verify-reset-token',
    resetPassword:   '/auth/reset-password',
  },

  // Users
  users: {
    me:           '/users/me',
    updateMe:     '/users/me',
    updatePass:   '/users/me/password',
    list:         '/users',            // ADMIN only
  },

  // Learning Paths
  learningPaths: {
    list:         '/learning-paths',
    detail:       (slug: string) => `/learning-paths/${slug}`,
    adminAll:     '/learning-paths/admin/all',
    create:       '/learning-paths',
    update:       (id: string) => `/learning-paths/${id}`,
    delete:       (id: string) => `/learning-paths/${id}`,
  },

  // Modules
  modules: {
    list:         '/modules',
    detail:       (id: string) => `/modules/${id}`,
    create:       '/modules',
    update:       (id: string) => `/modules/${id}`,
    delete:       (id: string) => `/modules/${id}`,
  },

  // Lessons
  lessons: {
    list:         '/lessons',
    detail:       (id: string) => `/lessons/${id}`,
    create:       '/lessons',
    update:       (id: string) => `/lessons/${id}`,
    delete:       (id: string) => `/lessons/${id}`,
  },

  // Quizzes
  quizzes: {
    byLesson:     (lessonId: string) => `/quizzes/lesson/${lessonId}`,
    submit:       (quizId: string) => `/quizzes/${quizId}/submit`,
    create:       '/quizzes',
  },

  // Payments
  payments: {
    createInvoice: '/payments/create-invoice',
    webhook:       '/payments/webhook',
  },

  // Progress
  progress: {
    complete:     (lessonId: string) => `/progress/${lessonId}/complete`,
    byModule:     (moduleId: string) => `/progress/module/${moduleId}`,
  },

  // Certificates
  certificates: {
    my:           '/certificates/my',
    verify:       (code: string) => `/certificates/verify/${code}`,
  },

  // Enrollments
  enrollments: {
    my:           '/enrollments/my',
  },

  // AI
  ai: {
    chat:         '/ai/chat',
  },
} as const;

export const QUERY_KEYS = {
  learningPaths:    ['learning-paths'],
  learningPath:     (slug: string) => ['learning-paths', slug],
  enrollments:      ['enrollments', 'my'],
  moduleProgress:   (moduleId: string) => ['progress', 'module', moduleId],
  certificates:     ['certificates', 'my'],
  lesson:           (id: string) => ['lessons', id],
  quizByLesson:     (lessonId: string) => ['quizzes', 'lesson', lessonId],
  me:               ['users', 'me'],
} as const;
