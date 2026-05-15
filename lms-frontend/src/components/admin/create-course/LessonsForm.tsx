import type { ChangeEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Layers, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ModuleForm, LessonForm, LessonType } from '@/types/course-form';

interface LessonsFormProps {
  modules: ModuleForm[];
  onAddLesson: (moduleId: string) => void;
  onRemoveLesson: (moduleId: string, lessonId: string) => void;
  onUpdateLesson: (
    moduleId: string,
    lessonId: string,
    field: keyof LessonForm,
    value: string
  ) => void;
}

export default function LessonsForm({
  modules,
  onAddLesson,
  onRemoveLesson,
  onUpdateLesson,
}: LessonsFormProps) {
  return (
    <div className="space-y-6">
      {modules.map((mod) => (
        <div key={mod.id} className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">
              {mod.title || `Module ${mod.order}`}
            </h3>
          </div>

          <div className="space-y-3 pl-2 border-l-2 border-border">
            {mod.lessons.map((lesson, li) => (
              <Card key={lesson.id}>
                <CardContent className="pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      Lesson {li + 1}
                    </Badge>
                    {mod.lessons.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive h-7 w-7"
                        onClick={() => onRemoveLesson(mod.id, lesson.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-xs">
                        Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="contoh: Apa itu JavaScript?"
                        value={lesson.title}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          onUpdateLesson(mod.id, lesson.id, 'title', e.target.value)
                        }
                      />
                    </div>

                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-xs">Tipe Lesson</Label>
                      <div className="flex gap-2">
                        {(['READING', 'QUIZ'] as LessonType[]).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => onUpdateLesson(mod.id, lesson.id, 'type', t)}
                            className={cn(
                              'flex-1 py-2 px-3 rounded-md border text-xs font-medium transition-all',
                              lesson.type === t
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-muted-foreground hover:border-muted-foreground'
                            )}
                          >
                            {t === 'READING' ? '📖 Reading' : '📝 Quiz'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {lesson.type === 'READING' && (
                      <>
                        <div className="col-span-2 space-y-1.5">
                          <Label className="text-xs">Content</Label>
                          <Textarea
                            placeholder="Isi konten reading..."
                            rows={3}
                            value={lesson.content}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                              onUpdateLesson(mod.id, lesson.id, 'content', e.target.value)
                            }
                          />
                        </div>

                        <div className="col-span-2 space-y-1.5">
                          <Label className="text-xs">Video URL (opsional)</Label>
                          <Input
                            placeholder="https://example.com/video.mp4"
                            value={lesson.videoUrl}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              onUpdateLesson(mod.id, lesson.id, 'videoUrl', e.target.value)
                            }
                          />
                        </div>
                      </>
                    )}

                    {lesson.type === 'QUIZ' && (
                      <div className="col-span-2 flex items-center gap-2 rounded-md bg-amber-500/10 border border-amber-500/20 p-3">
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Quiz bisa dikonfigurasi lebih lanjut (soal, pilihan, dll) setelah
                          course dibuat melalui halaman edit.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => onAddLesson(mod.id)}
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Lesson
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}