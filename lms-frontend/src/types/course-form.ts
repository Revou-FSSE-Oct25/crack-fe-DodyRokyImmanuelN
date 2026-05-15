import { BookOpen, Layers, FileText } from 'lucide-react';
import type { LessonType } from '@/types';

export type { LessonType };

export interface LessonForm {
  id: string;
  title: string;
  type: LessonType;
  order: number;
  content: string;
  videoUrl: string;
}

export interface ModuleForm {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: LessonForm[];
}

export interface LearningPathForm {
  title: string;
  description: string;
  thumbnail: string;
  price: string;
  isPublished: boolean;
}

export const COURSE_STEPS = [
  { id: 1, label: 'Learning Path', icon: BookOpen },
  { id: 2, label: 'Modules', icon: Layers },
  { id: 3, label: 'Lessons', icon: FileText },
];

const uid = () => Math.random().toString(36).slice(2, 9);

export const emptyLesson = (order: number): LessonForm => ({
  id: uid(),
  title: '',
  type: 'READING',
  order,
  content: '',
  videoUrl: '',
});

export const emptyModule = (order: number): ModuleForm => ({
  id: uid(),
  title: '',
  description: '',
  order,
  lessons: [emptyLesson(1)],
});

export const defaultLearningPathForm = (): LearningPathForm => ({
  title: '',
  description: '',
  thumbnail: '',
  price: '0',
  isPublished: false,
});