// Server Component
import { LearningPath, Module, Lesson, ModuleProgress } from "@/types";
import LearningSidebar from "./learning-sidebar";
import LessonContent from "./lesson-content";

type LearningPathContext = Pick<LearningPath, "id" | "title" | "slug">;

interface Props {
  learningPath: LearningPathContext;
  module: Module;
  moduleProgress: ModuleProgress | null;
  lesson: Lesson;
  slug: string;
  moduleSlug: string;
  activeLessonSlug: string;
  token: string;
}

export default function LearningContainer({
  learningPath,
  module,
  moduleProgress,
  lesson,
  slug,
  moduleSlug,
  activeLessonSlug,
  token,
}: Props) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <LearningSidebar
        learningPath={learningPath}
        module={module}
        moduleProgress={moduleProgress}
        activeLessonSlug={activeLessonSlug}
        slug={slug}
        moduleSlug={moduleSlug}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Pass SEMUA data yang dibutuhkan, termasuk learningPath */}
        <LessonContent
          lesson={lesson}
          module={module}
          moduleProgress={moduleProgress}
          learningPath={learningPath}
          slug={slug}
          moduleSlug={moduleSlug}
          token={token}
        />
      </main>
    </div>
  );
}
