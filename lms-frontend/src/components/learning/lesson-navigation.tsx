"use client"; // Pastikan ini client component jika ada handle click

import Link from "next/link";
import { Lesson } from "@/types";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useState } from "react";

interface Props {
  lessons: Lesson[];
  currentLessonSlug: string;
  slug: string;
  moduleSlug: string;
  onCompleteModule?: () => Promise<void>; // Prop baru untuk handle klik selesai
}

export default function LessonNavigation({
  lessons,
  currentLessonSlug,
  slug,
  moduleSlug,
  onCompleteModule
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const currentIndex = lessons.findIndex((l) => l.slug === currentLessonSlug);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      if (onCompleteModule) await onCompleteModule();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
      {/* Tombol Sebelumnya */}
      {prevLesson ? (
        <Link
          href={`/learning/${slug}/module/${moduleSlug}/lesson/${prevLesson.slug}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors group max-w-[45%]"
        >
          <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
          <div className="text-left min-w-0">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Sebelumnya</p>
            <p className="text-sm font-medium truncate">{prevLesson.title}</p>
          </div>
        </Link>
      ) : <div />}

      {/* Tombol Berikutnya ATAU Selesaikan Modul */}
      {nextLesson ? (
        <Link
          href={`/learning/${slug}/module/${moduleSlug}/lesson/${nextLesson.slug}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors group max-w-[45%] ml-auto"
        >
          <div className="text-right min-w-0">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Berikutnya</p>
            <p className="text-sm font-medium truncate">{nextLesson.title}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
        </Link>
      ) : onCompleteModule ? (
        <button
          onClick={handleComplete}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all ml-auto font-semibold shadow-sm disabled:opacity-50"
        >
          {isLoading ? "Memproses..." : "Selesaikan Modul"}
          <CheckCircle className="h-4 w-4" />
        </button>
      ) : (
        <Link
          href={`/learning/${slug}`}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all ml-auto font-semibold shadow-sm"
        >
          Kembali ke Kursus
          <CheckCircle className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
