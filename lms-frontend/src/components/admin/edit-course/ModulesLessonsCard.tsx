import {
  ChevronDown,
  ChevronRight,
  Edit2,
  FileText,
  HelpCircle,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Lesson, Module } from './types';

type ModulesLessonsCardProps = {
  modules: Module[];
  onCreateModule: () => void;
  onToggleModule: (moduleId: string) => void;
  onEditModule: (moduleItem: Module) => void;
  onDeleteModule: (moduleItem: Module) => void;
  onCreateLesson: (moduleId: string) => void;
  onEditLesson: (lesson: Lesson, moduleId: string) => void;
  onDeleteLesson: (moduleId: string, lesson: Lesson) => void;
  onManageQuiz: (lesson: Lesson) => void;
};

export function ModulesLessonsCard({
  modules,
  onCreateModule,
  onToggleModule,
  onEditModule,
  onDeleteModule,
  onCreateLesson,
  onEditLesson,
  onDeleteLesson,
  onManageQuiz,
}: ModulesLessonsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Modul & Lesson</CardTitle>
          <CardDescription>Kelola struktur belajar di dalam learning path ini.</CardDescription>
        </div>
        <Button onClick={onCreateModule} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Modul
        </Button>
      </CardHeader>
      <CardContent>
        {modules.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            Belum ada modul.
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((moduleItem) => (
              <div key={moduleItem.id} className="overflow-hidden rounded-md border">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onToggleModule(moduleItem.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onToggleModule(moduleItem.id);
                    }
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/50"
                >
                  {moduleItem.isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {moduleItem.order}. {moduleItem.title}
                    </p>
                    {moduleItem.description && (
                      <p className="truncate text-xs text-muted-foreground">
                        {moduleItem.description}
                      </p>
                    )}
                  </div>
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {moduleItem.lessonsLoaded ? moduleItem.lessons.length : '-'} lesson
                  </span>
                  <span className="flex shrink-0 gap-1" onClick={(event) => event.stopPropagation()}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEditModule(moduleItem)}
                      title="Edit modul"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDeleteModule(moduleItem)}
                      title="Hapus modul"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </span>
                </div>

                {moduleItem.isExpanded && (
                  <div className="space-y-2 border-t bg-muted/20 p-4">
                    {moduleItem.isLoadingLessons ? (
                      <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memuat lesson...
                      </div>
                    ) : moduleItem.lessons.length === 0 ? (
                      <p className="py-2 text-sm text-muted-foreground">Belum ada lesson.</p>
                    ) : (
                      [...moduleItem.lessons]
                        .sort((a, b) => a.order - b.order)
                        .map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 rounded-md border bg-background px-3 py-2"
                          >
                            {lesson.type === 'READING' ? (
                              <FileText className="h-4 w-4 shrink-0 text-blue-500" />
                            ) : (
                              <HelpCircle className="h-4 w-4 shrink-0 text-amber-500" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{lesson.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Urutan {lesson.order} - {lesson.type.toLowerCase()}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-1">
                              {lesson.type === 'QUIZ' && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1.5"
                                  onClick={() => onManageQuiz(lesson)}
                                >
                                  <HelpCircle className="h-4 w-4" />
                                  Kelola Quiz
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onEditLesson(lesson, moduleItem.id)}
                                title="Edit lesson"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => onDeleteLesson(moduleItem.id, lesson)}
                                title="Hapus lesson"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onCreateLesson(moduleItem.id)}
                      className="w-full gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Lesson
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
