'use client';

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
import type { UpdateProfilePayload } from '@/types';

type ProfileFormProps = {
  form: UpdateProfilePayload;
  isSaving: boolean;
  onChange: (form: UpdateProfilePayload) => void;
  onSubmit: () => void;
};

export function ProfileForm({ form, isSaving, onChange, onSubmit }: ProfileFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Profil</CardTitle>
        <CardDescription>Nama dan foto profil yang tampil di dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Nama</Label>
          <Input
            id="profile-name"
            value={form.name ?? ''}
            onChange={(event) => onChange({ ...form, name: event.target.value })}
            placeholder="Nama lengkap"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-avatar">URL Avatar</Label>
          <Input
            id="profile-avatar"
            value={form.avatar ?? ''}
            onChange={(event) => onChange({ ...form, avatar: event.target.value })}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        <Button onClick={onSubmit} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan Profil
        </Button>
      </CardContent>
    </Card>
  );
}
