import { DeleteEntityDialog } from './DeleteEntityDialog';
import { LessonDialog } from './LessonDialog';
import { ModuleDialog } from './ModuleDialog';
import { QuizDialog } from './QuizDialog';
import type { UseEditCourseReturn } from './useEditCourse';

type EditCourseDialogsProps = {
  course: UseEditCourseReturn;
};

export function EditCourseDialogs({ course }: EditCourseDialogsProps) {
  return (
    <>
      <ModuleDialog
        dialog={course.moduleDialog}
        isSaving={course.isSavingModule}
        onOpenChange={(open) =>
          course.setModuleDialog((previous) => ({ ...previous, open }))
        }
        onFormChange={(form) =>
          course.setModuleDialog((previous) => ({ ...previous, form }))
        }
        onSave={course.handleSaveModule}
      />

      <LessonDialog
        dialog={course.lessonDialog}
        isSaving={course.isSavingLesson}
        isReading={course.isReadingDialog}
        onOpenChange={(open) =>
          course.setLessonDialog((previous) => ({ ...previous, open }))
        }
        onFormChange={(form) =>
          course.setLessonDialog((previous) => ({ ...previous, form }))
        }
        onSave={course.handleSaveLesson}
      />

      <QuizDialog
        dialog={course.quizDialog}
        isSaving={course.isSavingQuiz}
        onOpenChange={(open) =>
          course.setQuizDialog((previous) => ({ ...previous, open }))
        }
        onFormChange={(form) =>
          course.setQuizDialog((previous) => ({ ...previous, form }))
        }
        onAddQuestion={course.addQuizQuestion}
        onRemoveQuestion={course.removeQuizQuestion}
        onUpdateQuestion={course.updateQuizQuestion}
        onAddOption={course.addQuizOption}
        onRemoveOption={course.removeQuizOption}
        onUpdateOption={course.updateQuizOption}
        onDeleteQuiz={(quizId, lessonTitle) =>
          course.setDeleteQuizDialog({ quizId, lessonTitle })
        }
        onSave={course.handleSaveQuiz}
      />

      <DeleteEntityDialog
        open={course.deleteModuleDialog !== null}
        title="Hapus modul?"
        description={
          <>
            Modul{' '}
            <span className="font-medium text-foreground">
              {course.deleteModuleDialog?.title}
            </span>{' '}
            dan lesson di dalamnya akan dihapus.
          </>
        }
        isDeleting={course.isDeletingModule}
        onOpenChange={(open) =>
          !open && !course.isDeletingModule && course.setDeleteModuleDialog(null)
        }
        onConfirm={course.handleDeleteModule}
      />

      <DeleteEntityDialog
        open={course.deleteLessonDialog !== null}
        title="Hapus lesson?"
        description={
          <>
            Lesson{' '}
            <span className="font-medium text-foreground">
              {course.deleteLessonDialog?.title}
            </span>{' '}
            akan dihapus permanen.
          </>
        }
        isDeleting={course.isDeletingLesson}
        onOpenChange={(open) =>
          !open && !course.isDeletingLesson && course.setDeleteLessonDialog(null)
        }
        onConfirm={course.handleDeleteLesson}
      />

      <DeleteEntityDialog
        open={course.deleteQuizDialog !== null}
        title="Hapus quiz?"
        description={
          <>
            Quiz untuk lesson{' '}
            <span className="font-medium text-foreground">
              {course.deleteQuizDialog?.lessonTitle}
            </span>{' '}
            akan dihapus beserta semua pertanyaan, opsi jawaban, dan attempt.
          </>
        }
        isDeleting={course.isDeletingQuiz}
        onOpenChange={(open) =>
          !open && !course.isDeletingQuiz && course.setDeleteQuizDialog(null)
        }
        onConfirm={course.handleDeleteQuiz}
      />
    </>
  );
}
