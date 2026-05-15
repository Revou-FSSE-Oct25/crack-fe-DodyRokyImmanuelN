// Server Component
import { LearningPath, Module, Lesson } from "@/types";
import LearningSidebar from "./learning-sidebar";
import LessonContent from "./lesson-content";

interface Props {
  learningPath: LearningPath;
  module: Module;
  lesson: Lesson;
  slug: string;
  moduleSlug: string;
  activeLessonSlug: string; 
}

export default function LearningContainer({
  learningPath,
  module,
  lesson,
  slug,
  moduleSlug,
  activeLessonSlug,
}: Props) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <LearningSidebar
        learningPath={learningPath}
        module={module}
        activeLessonSlug={activeLessonSlug} 
        slug={slug}
        moduleSlug={moduleSlug}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Pass SEMUA data yang dibutuhkan, termasuk learningPath */}
        <LessonContent
          lesson={lesson}
          module={module}
          learningPath={learningPath} 
          slug={slug}
          moduleSlug={moduleSlug}
        />
      </main>
    </div>
  );
}