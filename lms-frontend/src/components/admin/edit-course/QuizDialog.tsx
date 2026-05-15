import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { QuizDialogState, QuizForm } from './types';

type QuizQuestionField = 'text' | 'points' | 'order';
type QuizOptionField = 'text' | 'isCorrect';

type QuizDialogProps = {
  dialog: QuizDialogState;
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: QuizForm) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (questionId: string) => void;
  onUpdateQuestion: (questionId: string, field: QuizQuestionField, value: string) => void;
  onAddOption: (questionId: string) => void;
  onRemoveOption: (questionId: string, optionId: string) => void;
  onUpdateOption: (
    questionId: string,
    optionId: string,
    field: QuizOptionField,
    value: string | boolean,
  ) => void;
  onDeleteQuiz: (quizId: string, lessonTitle: string) => void;
  onSave: () => void;
};

export function QuizDialog({
  dialog,
  isSaving,
  onOpenChange,
  onFormChange,
  onAddQuestion,
  onRemoveQuestion,
  onUpdateQuestion,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
  onDeleteQuiz,
  onSave,
}: QuizDialogProps) {
  return (
    <Dialog open={dialog.open} onOpenChange={(open) => !isSaving && onOpenChange(open)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Kelola Quiz</DialogTitle>
        </DialogHeader>

        {dialog.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Memuat quiz...
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
              {dialog.lessonTitle}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="quiz-time-limit">Durasi (menit)</Label>
                <Input
                  id="quiz-time-limit"
                  type="number"
                  min="1"
                  value={dialog.form.timeLimit}
                  onChange={(event) =>
                    onFormChange({ ...dialog.form, timeLimit: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-passing-score">Nilai Lulus</Label>
                <Input
                  id="quiz-passing-score"
                  type="number"
                  min="1"
                  max="100"
                  value={dialog.form.passingScore}
                  onChange={(event) =>
                    onFormChange({ ...dialog.form, passingScore: event.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-3 rounded-md border px-3 py-2">
                <Switch
                  checked={dialog.form.isFinalExam}
                  onCheckedChange={(checked) =>
                    onFormChange({ ...dialog.form, isFinalExam: checked })
                  }
                />
                <div>
                  <p className="text-sm font-medium">Final Exam</p>
                  <p className="text-xs text-muted-foreground">Sekali percobaan</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Pertanyaan</h3>
                <Button type="button" variant="outline" size="sm" onClick={onAddQuestion}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Pertanyaan
                </Button>
              </div>

              {dialog.form.questions.map((question, questionIndex) => (
                <div key={question.id} className="space-y-4 rounded-md border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="secondary">Pertanyaan {questionIndex + 1}</Badge>
                    {dialog.form.questions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onRemoveQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Pertanyaan</Label>
                    <Textarea
                      rows={3}
                      value={question.text}
                      onChange={(event) =>
                        onUpdateQuestion(question.id, 'text', event.target.value)
                      }
                      placeholder="Tulis pertanyaan quiz..."
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Poin</Label>
                      <Input
                        type="number"
                        min="1"
                        value={question.points}
                        onChange={(event) =>
                          onUpdateQuestion(question.id, 'points', event.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Urutan</Label>
                      <Input
                        type="number"
                        min="1"
                        value={question.order}
                        onChange={(event) =>
                          onUpdateQuestion(question.id, 'order', event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Opsi Jawaban</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onAddOption(question.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Opsi
                      </Button>
                    </div>

                    {question.options.map((option, optionIndex) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={option.isCorrect}
                          onChange={() =>
                            onUpdateOption(question.id, option.id, 'isCorrect', true)
                          }
                          className="h-4 w-4"
                          aria-label={`Jawaban benar opsi ${optionIndex + 1}`}
                        />
                        <Input
                          value={option.text}
                          onChange={(event) =>
                            onUpdateOption(question.id, option.id, 'text', event.target.value)
                          }
                          placeholder={`Opsi ${optionIndex + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          disabled={question.options.length <= 2}
                          onClick={() => onRemoveOption(question.id, option.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-between">
          <div>
            {dialog.quizId && (
              <Button
                type="button"
                variant="outline"
                className="text-destructive hover:text-destructive"
                disabled={isSaving || dialog.isLoading}
                onClick={() => onDeleteQuiz(dialog.quizId as string, dialog.lessonTitle ?? 'Quiz')}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Quiz
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button onClick={onSave} disabled={isSaving || dialog.isLoading}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Quiz
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
