import { LearningPathDetailsCard } from './LearningPathDetailsCard';
import type { UseEditCourseReturn } from './useEditCourse';

type EditCourseDetailsSectionProps = {
  course: UseEditCourseReturn;
};

export function EditCourseDetailsSection({ course }: EditCourseDetailsSectionProps) {
  return (
    <LearningPathDetailsCard
      form={course.learningPathForm}
      isSaving={course.isSavingLearningPath}
      onFormChange={course.setLearningPathForm}
      onSave={course.handleSaveLearningPath}
    />
  );
}
