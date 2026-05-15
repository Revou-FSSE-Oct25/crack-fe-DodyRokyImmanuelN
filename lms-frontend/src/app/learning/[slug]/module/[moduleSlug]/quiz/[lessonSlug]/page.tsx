import { cookies } from "next/headers";
import QuizContainer from "@/components/learning/quiz/quiz-container";
import { API_URL } from "@/lib/constants";

async function getLesson(lessonSlug: string, token: string) {
  const res = await fetch(`${API_URL}/lessons/${lessonSlug}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Gagal mengambil lesson");
  const result = await res.json();
  return result.data;
}

async function getQuiz(lessonId: string, token: string) {
  const res = await fetch(`${API_URL}/quizzes/lesson/${lessonId}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Gagal mengambil quiz");
  const result = await res.json();
  return result.data;
}

async function getLastAttempt(quizId: string, token: string) {
  const res = await fetch(
    `${API_URL}/quizzes/${quizId}/last-attempt`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) return null;
  const result = await res.json();
  return result.data;
}

export default async function QuizPage({ params }: any) {
  const { slug, moduleSlug, lessonSlug } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  const lesson = await getLesson(lessonSlug, token);
  const quiz = await getQuiz(lesson.id, token);
  const lastAttempt = await getLastAttempt(quiz.id, token);

  return (
    <QuizContainer
      quiz={quiz}
      lesson={lesson}
      token={token}
      slug={slug}
      moduleSlug={moduleSlug}
      lastAttempt={lastAttempt}
    />
  );
}
