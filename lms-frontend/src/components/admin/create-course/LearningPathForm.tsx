import type { ChangeEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { LearningPathForm } from '@/types/course-form';

interface LearningPathFormProps {
  form: LearningPathForm;
  onChange: (field: keyof LearningPathForm, value: string | boolean) => void;
}

export default function LearningPathForm({ form, onChange }: LearningPathFormProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="contoh: Full Stack Web Development"
            value={form.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('title', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Deskripsikan learning path ini..."
            rows={4}
            value={form.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              onChange('description', e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnail">Thumbnail URL</Label>
          <Input
            id="thumbnail"
            placeholder="https://example.com/thumbnail.jpg"
            value={form.thumbnail}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('thumbnail', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">
            Price (IDR) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            min={0}
            step="0.01"
            placeholder="0"
            value={form.price}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('price', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Isi 0 untuk course gratis.</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium">Publish sekarang?</p>
            <p className="text-xs text-muted-foreground">
              Course langsung bisa diakses oleh user.
            </p>
          </div>
          <Switch
            checked={form.isPublished}
            onCheckedChange={(v: boolean) => onChange('isPublished', v)}
          />
        </div>
      </CardContent>
    </Card>
  );
}