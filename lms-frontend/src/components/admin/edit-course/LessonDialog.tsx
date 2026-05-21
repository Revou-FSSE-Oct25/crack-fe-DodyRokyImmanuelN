import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { LessonType } from '@/types';
import type { LessonDialogState, LessonForm } from './types';

type LessonDialogProps = {
  dialog: LessonDialogState;
  isSaving: boolean;
  isReading: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: LessonForm) => void;
  onSave: () => void;
};

export function LessonDialog({
  dialog,
  isSaving,
  isReading,
  onOpenChange,
  onFormChange,
  onSave,
}: LessonDialogProps) {
  return (
    <Dialog open={dialog.open} onOpenChange={(open) => !isSaving && onOpenChange(open)}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dialog.mode === 'create' ? 'Tambah Lesson' : 'Edit Lesson'}</DialogTitle>
          <DialogDescription className="sr-only">
            Form untuk {dialog.mode === 'create' ? 'menambahkan' : 'mengubah'} detail lesson.
          </DialogDescription>
        </DialogHeader>

        {dialog.isLoadingLesson ? (
          <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Memuat lesson...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lesson-title">Judul</Label>
                <Input
                  id="lesson-title"
                  value={dialog.form.title}
                  onChange={(event) => onFormChange({ ...dialog.form, title: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lesson-order">Urutan</Label>
                <Input
                  id="lesson-order"
                  type="number"
                  min="1"
                  value={dialog.form.order}
                  onChange={(event) => onFormChange({ ...dialog.form, order: event.target.value })}
                />
              </div>
            </div>

            {dialog.mode === 'create' && (
              <div className="space-y-2">
                <Label>Tipe</Label>
                <Select
                  value={dialog.form.type}
                  onValueChange={(value) =>
                    onFormChange({ ...dialog.form, type: value as LessonType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="READING">Reading</SelectItem>
                    <SelectItem value="QUIZ">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {isReading ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="lesson-video">Video URL</Label>
                  <Input
                    id="lesson-video"
                    value={dialog.form.videoUrl}
                    onChange={(event) =>
                      onFormChange({ ...dialog.form, videoUrl: event.target.value })
                    }
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lesson-content">Konten</Label>
                  <Textarea
                    id="lesson-content"
                    rows={10}
                    value={dialog.form.content}
                    onChange={(event) =>
                      onFormChange({ ...dialog.form, content: event.target.value })
                    }
                  />
                </div>
              </>
            ) : (
              <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                Lesson quiz dibuat sebagai item lesson. Konten soal dan pilihan jawaban dikelola
                dari fitur quiz.
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving || dialog.isLoadingLesson}
          >
            Batal
          </Button>
          <Button onClick={onSave} disabled={isSaving || dialog.isLoadingLesson}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
