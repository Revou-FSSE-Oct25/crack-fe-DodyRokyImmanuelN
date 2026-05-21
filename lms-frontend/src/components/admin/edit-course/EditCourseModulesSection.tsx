import { ModulesLessonsCard } from './ModulesLessonsCard';
import type { UseEditCourseReturn } from './useEditCourse';

type EditCourseModulesSectionProps = {
  course: UseEditCourseReturn;
};

export function EditCourseModulesSection({ course }: EditCourseModulesSectionProps) {
  return (
    <ModulesLessonsCard
      modules={course.sortedModules}
      onCreateModule={course.openCreateModule}
      onToggleModule={course.toggleModule}
      onEditModule={course.openEditModule}
      onDeleteModule={(moduleItem) =>
        course.setDeleteModuleDialog({
          moduleId: moduleItem.id,
          title: moduleItem.title,
        })
      }
      onCreateLesson={course.openCreateLesson}
      onEditLesson={(lesson, moduleId) => void course.openEditLesson(lesson, moduleId)}
      onDeleteLesson={(moduleId, lesson) =>
        course.setDeleteLessonDialog({
          moduleId,
          lessonId: lesson.id,
          title: lesson.title,
        })
      }
      onManageQuiz={(lesson) => void course.openManageQuiz(lesson)}
    />
  );
}
