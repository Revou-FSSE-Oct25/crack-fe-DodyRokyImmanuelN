import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LearningContainer from "@/components/learning/learning-container";
import LessonTracker from "@/components/learning/lesson-tracker";
import { ApiResponse, LearningPath, Lesson, Module } from "@/types";

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

async function getLearningPath(slug: string, token: string): Promise<LearningPath> {
  const res = await fetch(`http://localhost:3001/learning-paths/${slug}`, {
    cache: "no-store",
    headers: authHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`Gagal mengambil learning path: ${res.status}`);
  }

  const result: ApiResponse<LearningPath> = await res.json();
  return result.data;
}

async function getModule(moduleSlug: string, token: string): Promise<Module> {
  const res = await fetch(`http://localhost:3001/modules/${moduleSlug}`, {
    cache: "no-store",
    headers: authHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`Gagal mengambil modul: ${res.status}`);
  }

  const result: ApiResponse<Module> = await res.json();
  return result.data;
}

async function getLesson(lessonSlug: string, token: string): Promise<Lesson | undefined> {
  const res = await fetch(`http://localhost:3001/lessons/${lessonSlug}`, {
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

export default async function LessonPage({ params }: Props) {
  const { slug, moduleSlug, lessonSlug } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  if (!token) {
    redirect("/login");
  }

  const [learningPath, moduleDetail] = await Promise.all([
    getLearningPath(slug, token),
    getModule(moduleSlug, token),
  ]);

  const lesson = await getLesson(lessonSlug, token);

  if (!lesson) {
    return <div>Gagal memuat lesson. Silakan login ulang.</div>;
  }

  return (
    <>
      {/* Track lesson yang sedang dibuka, fire and forget */}
      <LessonTracker lessonId={lesson.id} token={token} />
      <LearningContainer
        learningPath={learningPath}
        module={moduleDetail}
        lesson={lesson}
        slug={slug}
        moduleSlug={moduleSlug}
        activeLessonSlug={lessonSlug}
      />
    </>
  );
}
