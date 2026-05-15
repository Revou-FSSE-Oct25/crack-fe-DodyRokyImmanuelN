import Link from "next/link";
import { LearningPath, Module } from "@/types";
import { PlayCircle, FileQuestion, BookOpen, ChevronLeft } from "lucide-react";

type LearningPathContext = Pick<LearningPath, "id" | "title" | "slug">;

interface Props {
  learningPath: LearningPathContext;
  module: Module;
  activeLessonSlug?: string;
  slug: string;
  moduleSlug: string;
}

export default function LearningSidebar({
  learningPath,
  module,
  activeLessonSlug,
  slug,
  moduleSlug,
}: Props) {
  return (
    <aside className="w-72 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shrink-0">

      {/* Header */}
      <div className="p-4 border-b border-sidebar-border space-y-3">
        <Link
          href={`/learning/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Kembali ke kursus
        </Link>

        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Kursus
            </p>
            <h1 className="text-sm font-semibold leading-snug mt-0.5">
              {learningPath.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Module title */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Modul
        </p>
        <p className="text-sm font-semibold">{module.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {module.lessons.length} pelajaran
        </p>
      </div>

      {/* Lesson list */}
      <div className="flex-1 overflow-y-auto py-2">
        {module.lessons.map((lesson, index) => {
          const isActive = lesson.slug === activeLessonSlug;
          const Icon = lesson.type === "QUIZ" ? FileQuestion : PlayCircle;

          return (
            <Link
              key={lesson.id}
              href={`/learning/${slug}/module/${moduleSlug}/lesson/${lesson.slug}`}
              className={`group flex items-start gap-3 px-4 py-3 transition-colors relative ${
                isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
              }`}
            >
              {/* Active indicator strip */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary" />
              )}

              {/* Number badge */}
              <div className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-semibold mt-0.5 transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-sidebar-accent text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              }`}>
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${
                  isActive
                    ? "text-sidebar-accent-foreground font-semibold"
                    : "text-sidebar-foreground"
                }`}>
                  {lesson.title}
                </p>

                <div className="flex items-center gap-1.5 mt-1">
                  <Icon className={`h-3 w-3 shrink-0 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <span className="text-[11px] text-muted-foreground">
                    {lesson.type === "QUIZ" ? "Kuis" : "Bacaan"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
