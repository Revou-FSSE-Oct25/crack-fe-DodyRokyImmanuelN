import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { LearningPathForm } from './types';

type LearningPathDetailsCardProps = {
  form: LearningPathForm;
  isSaving: boolean;
  onFormChange: (form: LearningPathForm) => void;
  onSave: () => void;
};

export function LearningPathDetailsCard({
  form,
  isSaving,
  onFormChange,
  onSave,
}: LearningPathDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Learning Path</CardTitle>
        <CardDescription>Data utama course yang tampil ke learner.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(event) => onFormChange({ ...form, title: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Harga</Label>
            <Input
              id="price"
              type="number"
              min="0"
              value={form.price}
              onChange={(event) => onFormChange({ ...form, price: event.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(event) => onFormChange({ ...form, description: event.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnail">Thumbnail URL</Label>
          <Input
            id="thumbnail"
            value={form.thumbnail}
            onChange={(event) => onFormChange({ ...form, thumbnail: event.target.value })}
            placeholder="https://example.com/thumbnail.jpg"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Switch
              checked={form.isPublished}
              onCheckedChange={(checked) => onFormChange({ ...form, isPublished: checked })}
            />
            <div>
              <p className="text-sm font-medium">Publikasikan kursus</p>
              <p className="text-xs text-muted-foreground">
                Pelajar hanya melihat kursus yang sudah dipublikasikan.
              </p>
            </div>
          </div>

          <Button onClick={onSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Simpan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
