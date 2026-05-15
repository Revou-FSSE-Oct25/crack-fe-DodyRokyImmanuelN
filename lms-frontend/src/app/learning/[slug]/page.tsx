import { ApiResponse, LearningPath } from "@/types";
import { API_URL } from "@/lib/constants";
import Link from "next/link";
import { BookOpen, ChevronRight, PlayCircle, LayoutList, Clock } from "lucide-react";

async function getLearningPath(slug: string): Promise<LearningPath | null> {
  try {
    const res = await fetch(`${API_URL}/learning-paths/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const result: ApiResponse<LearningPath> = await res.json();
    return result.data;
  } catch (error) {
    console.error("Gagal mengambil learning path:", error);
    return null;
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LearningPathPage({ params }: Props) {
  const { slug } = await params;
  const learningPath = await getLearningPath(slug);

  if (!learningPath) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Learning path tidak ditemukan.</p>
      </div>
    );
  }

  const totalLessons = learningPath.modules.reduce(
    (acc, m) => acc + (m._count?.lessons ?? 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}
      <header className="h-12 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-full flex items-center gap-1.5 text-sm">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-foreground font-medium truncate">
            {learningPath.title}
          </span>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-border bg-sidebar">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-start gap-5">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {learningPath.title}
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                {learningPath.description}
              </p>
              <div className="flex items-center gap-5 mt-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <LayoutList className="h-4 w-4" />
                  <span>{learningPath.modules.length} modul</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <PlayCircle className="h-4 w-4" />
                  <span>{totalLessons} pelajaran</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module list */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
          Daftar Modul
        </h2>

        <div className="space-y-3">
          {learningPath.modules.map((module, index) => (
            <Link
              key={module.id}
              href={`/learning/${slug}/module/${module.slug}`}
              className="group flex items-center gap-5 p-5 rounded-xl border border-border bg-background hover:bg-sidebar hover:border-border/80 transition-all"
            >
              {/* Number */}
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {index + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {module.title}
                </p>
                {module.description && (
                  <p className="text-sm text-muted-foreground mt-0.5 truncate">
                    {module.description}
                  </p>
                )}
              </div>

              {/* Lesson count */}
              {module._count && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap shrink-0">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{module._count.lessons} pelajaran</span>
                </div>
              )}

              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
