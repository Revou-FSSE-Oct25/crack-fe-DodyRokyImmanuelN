import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LearningContainer from "@/components/learning/learning-container";
import LessonTracker from "@/components/learning/lesson-tracker";
import { ApiResponse, Lesson, Module, ModuleProgress } from "@/types";
import { API_URL } from "@/lib/constants";

interface Props {
  params: Promise<{
    slug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
}

function authHeaders(token: string): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function getModule(moduleSlug: string, token: string): Promise<Module> {
  const res = await fetch(`${API_URL}/modules/${moduleSlug}`, {
    cache: "no-store",
    headers: authHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`Gagal mengambil modul: ${res.status}`);
  }

  const result: ApiResponse<Module> = await res.json();
  return result.data;
}

async function getLesson(
  lessonSlug: string,
  token: string,
): Promise<Lesson | undefined> {
  const res = await fetch(`${API_URL}/lessons/${lessonSlug}`, {
    cache: "no-store",
    headers: authHeaders(token),
  });

  if (!res.ok) {
    console.error("Gagal mengambil lesson:", res.status);
    return undefined;
  }

  const result: ApiResponse<Lesson> = await res.json();
  return result.data;
}

async function getModuleProgress(
  moduleId: string,
  token: string,
): Promise<ModuleProgress | null> {
  const res = await fetch(`${API_URL}/progress/module/${moduleId}`, {
    cache: "no-store",
    headers: authHeaders(token),
  });

  if (!res.ok) return null;

  const result: ApiResponse<ModuleProgress> = await res.json();
  return result.data;
}

export default async function LessonPage({ params }: Props) {
  const { slug, moduleSlug, lessonSlug } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  if (!token) {
    redirect("/login");
  }

  const [moduleDetail, lesson] = await Promise.all([
    getModule(moduleSlug, token),
    getLesson(lessonSlug, token),
  ]);

  if (!lesson) {
    return <div>Gagal memuat lesson. Silakan login ulang.</div>;
  }

  if (!moduleDetail.learningPath) {
    return <div>Gagal memuat data kursus. Silakan coba lagi.</div>;
  }

  const moduleProgress = await getModuleProgress(moduleDetail.id, token);

  return (
    <>
      {/* Track lesson yang sedang dibuka, fire and forget */}
      <LessonTracker lessonId={lesson.id} token={token} />
      <LearningContainer
        learningPath={moduleDetail.learningPath}
        module={moduleDetail}
        moduleProgress={moduleProgress}
        lesson={lesson}
        slug={slug}
        moduleSlug={moduleSlug}
        activeLessonSlug={lessonSlug}
        token={token}
      />
    </>
  );
}
