
import { z } from "zod";


export const lessonSchema = z.object({
  title: z.string().min(1, "Judul lesson wajib diisi"),
  type: z.enum(["READING", "QUIZ"]),
  content: z.string().optional(), // Markdown content untuk READING
  videoUrl: z.string().url("URL video tidak valid").optional().or(z.literal("")),
  order: z.number().default(0),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;

export interface Lesson extends LessonFormValues {
  id: string;
  moduleId: string;
}


export const moduleSchema = z.object({
  title: z.string().min(1, "Judul modul wajib diisi"),
  order: z.number().default(0),
});

export type ModuleFormValues = z.infer<typeof moduleSchema>;

export interface Module extends ModuleFormValues {
  id: string;
  courseId: string;
  lessons: Lesson[]; // Relasi ke lessons
}

export const courseSchema = z.object({
  title: z.string().min(3, "Title minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  isPublished: z.boolean().default(false),
  thumbnailUrl: z.string().url("Format URL thumbnail salah").optional().or(z.literal("")),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

export interface Course extends CourseFormValues {
  id: string;
  slug: string;
  modules?: Module[]; 
}