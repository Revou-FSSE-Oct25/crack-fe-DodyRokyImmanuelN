'use client';

import { Loader2, Lock } from 'lucide-react';
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
import type { UpdatePasswordPayload } from '@/types';

type PasswordFormProps = {
  form: UpdatePasswordPayload;
  isSaving: boolean;
  onChange: (form: UpdatePasswordPayload) => void;
  onSubmit: () => void;
};

export function PasswordForm({ form, isSaving, onChange, onSubmit }: PasswordFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keamanan</CardTitle>
        <CardDescription>Ganti password akun kamu secara berkala.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Password Saat Ini</Label>
          <Input
            id="current-password"
            type="password"
            value={form.currentPassword}
            onChange={(event) => onChange({ ...form, currentPassword: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">Password Baru</Label>
          <Input
            id="new-password"
            type="password"
            value={form.newPassword}
            onChange={(event) => onChange({ ...form, newPassword: event.target.value })}
          />
        </div>
        <Button onClick={onSubmit} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          Ganti Password
        </Button>
      </CardContent>
    </Card>
  );
}
