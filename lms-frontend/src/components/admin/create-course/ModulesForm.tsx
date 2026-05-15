import type { ChangeEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { ModuleForm } from '@/types/course-form';

interface ModulesFormProps {
  modules: ModuleForm[];
  onAdd: () => void;
  onRemove: (moduleId: string) => void;
  onUpdate: (moduleId: string, field: keyof ModuleForm, value: string) => void;
}

export default function ModulesForm({ modules, onAdd, onRemove, onUpdate }: ModulesFormProps) {
  return (
    <div className="space-y-4">
      {modules.map((mod, idx) => (
        <Card key={mod.id}>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">Modul {idx + 1}</Badge>
              </div>
              {modules.length > 1 && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive h-8 w-8"
                  onClick={() => onRemove(mod.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Judul <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="contoh: Pengenalan JavaScript"
                value={mod.title}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onUpdate(mod.id, 'title', e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                placeholder="Deskripsi modul (opsional)..."
                rows={2}
                value={mod.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  onUpdate(mod.id, 'description', e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" className="w-full gap-2" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        Tambah Modul
      </Button>
    </div>
  );
}
