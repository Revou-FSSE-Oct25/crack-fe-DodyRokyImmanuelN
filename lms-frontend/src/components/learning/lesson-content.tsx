"use client";

import { LearningChatbot } from "@/components/learning-chatbot/LearningChatbot";
import { API_URL } from "@/lib/constants";
import { LearningPath, Lesson, Module, ModuleProgress } from "@/types";
import { CheckCircle2, FileQuestion, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import LessonNavigation from "./lesson-navigation";

type LearningPathContext = Pick<LearningPath, "id" | "title" | "slug">;

interface Props {
  lesson: Lesson;
  module: Module;
  moduleProgress: ModuleProgress | null;
  learningPath: LearningPathContext;
  slug: string;
  moduleSlug: string;
  token: string;
}

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      if (parsedUrl.pathname.includes("/shorts/")) {
        const videoId = parsedUrl.pathname.split("/shorts/")[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  } catch {
    return null;
  }
}

export default function LessonContent({
  lesson,
  module,
  moduleProgress,
  learningPath,
  slug,
  moduleSlug,
  token,
}: Props) {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  const lessonProgress = moduleProgress?.lessons.find(
    (item) => item.id === lesson.id,
  );
  const [isCompleted, setIsCompleted] = useState(
    lessonProgress?.progress === "COMPLETED",
  );
  const videoUrl = lesson.readingContent?.videoUrl;
  const embedUrl = videoUrl ? getYoutubeEmbedUrl(videoUrl) : null;

  const handleCompleteLesson = async () => {
    if (lesson.type !== "READING" || isCompleted) return;

    setIsCompleting(true);
    try {
      const res = await fetch(`${API_URL}/progress/${lesson.id}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setIsCompleted(true);
        if (result.data?.moduleCompleted) {
          alert("Selamat! Modul Selesai.");
          router.push(`/learning/${slug}`);
        } else {
          router.refresh();
        }
      } else {
        alert(result.message ?? "Gagal menandai lesson selesai.");
      }
    } catch (error) {
      console.error("Gagal menandai lesson selesai:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-10 py-10">
      <h1 className="text-3xl font-bold tracking-tight mt-4 mb-2">
        {lesson.title}
      </h1>

      <hr className="border-border mb-8" />

      {lesson.type === "READING" && (
        <div>
          {embedUrl && (
            <div className="mb-8">
              <iframe
                className="w-full aspect-video rounded-lg shadow-md"
                src={embedUrl}
                title="Lesson Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div className="prose prose-slate max-w-none text-foreground dark:prose-invert">
            <ReactMarkdown>
              {lesson.readingContent?.content ?? ""}
            </ReactMarkdown>
          </div>

          <div className="mt-8 rounded-lg border bg-muted/30 p-4">
            <div className="mb-4 flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isCompleted
                    ? "Lesson ini sudah ditandai selesai"
                    : "Tandai lesson setelah selesai membaca"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isCompleted
                    ? "Status ini juga tampil di sidebar agar progres belajarmu mudah dipantau."
                    : "Status lesson akan berubah di tombol dan sidebar setelah tersimpan."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCompleteLesson}
              disabled={isCompleting || isCompleted}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed ${
                isCompleted
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
              }`}
            >
              {isCompleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : isCompleted ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Lesson Selesai
                </>
              ) : (
                "Tandai Lesson Selesai"
              )}
            </button>
          </div>
        </div>
      )}

      {lesson.type === "QUIZ" && (
        <div className="mt-2 mb-8">
          <div className="rounded-xl border border-border bg-muted/50 p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <FileQuestion className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1">Quiz</h2>
              <p className="text-muted-foreground text-sm">
                Uji pemahamanmu sebelum lanjut ke materi berikutnya.
              </p>
            </div>
            <Link
              href={`/learning/${slug}/module/${moduleSlug}/quiz/${lesson.slug}`}
              className="px-6 py-2.5 bg-primary text-white rounded-lg inline-block hover:opacity-90 transition font-medium"
            >
              Mulai Quiz
            </Link>
          </div>
        </div>
      )}

      <LessonNavigation
        lessons={module.lessons}
        currentLessonSlug={lesson.slug}
        slug={slug}
        moduleSlug={moduleSlug}
      />

      {lesson.type === "READING" && (
        <LearningChatbot
          scope="LESSON"
          lessonId={lesson.id}
          title={lesson.title}
          progressSummary={`${learningPath.title} - ${module.title}`}
        />
      )}
    </div>
  );
}
