'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AccountInfoCard } from '@/components/profile/AccountInfoCard';
import { PasswordForm } from '@/components/profile/PasswordForm';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import API from '@/lib/api';
import { ENDPOINTS, QUERY_KEYS } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import type { UpdatePasswordPayload, UpdateProfilePayload, User } from '@/types';

type ApiEnvelope<T> = {
  data: T;
  message?: string;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

const emptyPasswordForm: UpdatePasswordPayload = {
  currentPassword: '',
  newPassword: '',
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as ApiError;
  return apiError.response?.data?.message ?? fallback;
};

const unwrapUser = (payload: User | ApiEnvelope<User>) => {
  if ('data' in payload) return payload.data;
  return payload;
};

export default function ProfilePage() {
  const { user: storedUser, updateUser } = useAuthStore();
  const [profileDraft, setProfileDraft] = useState<UpdateProfilePayload | null>(null);
  const [passwordForm, setPasswordForm] = useState<UpdatePasswordPayload>(emptyPasswordForm);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const { data: user = storedUser, isLoading } = useQuery<User | null>({
    queryKey: QUERY_KEYS.me,
    queryFn: async () => {
      const response = await API.get<User | ApiEnvelope<User>>(ENDPOINTS.users.me);
      return unwrapUser(response.data);
    },
  });

  const profileForm = profileDraft ?? {
    name: user?.name ?? '',
    avatar: user?.avatar ?? '',
  };

  const handleSaveProfile = async () => {
    if (!profileForm.name?.trim()) {
      toast.error('Nama wajib diisi');
      return;
    }

    setIsSavingProfile(true);
    try {
      const payload: UpdateProfilePayload = {
        name: profileForm.name.trim(),
        avatar: profileForm.avatar?.trim() || undefined,
      };
      const response = await API.patch<User | ApiEnvelope<User>>(ENDPOINTS.users.updateMe, payload);
      const updatedUser = unwrapUser(response.data);

      updateUser(updatedUser);
      setProfileDraft({
        name: updatedUser.name,
        avatar: updatedUser.avatar ?? '',
      });
      toast.success('Profil berhasil disimpan');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Gagal menyimpan profil'));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Password saat ini dan password baru wajib diisi');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password baru minimal 8 karakter');
      return;
    }

    setIsSavingPassword(true);
    try {
      await API.patch(ENDPOINTS.users.updatePass, passwordForm);
      setPasswordForm(emptyPasswordForm);
      toast.success('Password berhasil diganti');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Gagal mengganti password'));
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <ProfileHeader user={user} />

      {isLoading ? (
        <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">
          Memuat profil...
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <ProfileForm
              form={profileForm}
              isSaving={isSavingProfile}
              onChange={setProfileDraft}
              onSubmit={handleSaveProfile}
            />
            <PasswordForm
              form={passwordForm}
              isSaving={isSavingPassword}
              onChange={setPasswordForm}
              onSubmit={handleChangePassword}
            />
          </div>
          <AccountInfoCard user={user} />
        </div>
      )}
    </div>
  );
}
