import { Loader2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import type { ModuleDialogState, ModuleForm } from './types';

type ModuleDialogProps = {
  dialog: ModuleDialogState;
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: ModuleForm) => void;
  onSave: () => void;
};

export function ModuleDialog({
  dialog,
  isSaving,
  onOpenChange,
  onFormChange,
  onSave,
}: ModuleDialogProps) {
  return (
    <Dialog open={dialog.open} onOpenChange={(open) => !isSaving && onOpenChange(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialog.mode === 'create' ? 'Tambah Modul' : 'Edit Modul'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="module-title">Judul</Label>
            <Input
              id="module-title"
              value={dialog.form.title}
              onChange={(event) => onFormChange({ ...dialog.form, title: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="module-description">Deskripsi</Label>
            <Textarea
              id="module-description"
              rows={3}
              value={dialog.form.description}
              onChange={(event) =>
                onFormChange({ ...dialog.form, description: event.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="module-order">Urutan</Label>
            <Input
              id="module-order"
              type="number"
              min="1"
              value={dialog.form.order}
              onChange={(event) => onFormChange({ ...dialog.form, order: event.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Batal
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
