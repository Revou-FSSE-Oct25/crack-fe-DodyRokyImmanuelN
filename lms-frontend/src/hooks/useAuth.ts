'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import API from '@/lib/api';
import { ENDPOINTS } from '@/lib/constants';
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  RegisterResponse,
} from '@/types';

function setTokenCookie(token: string) {
  const maxAge = 15 * 60; // 15 menit
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  document.cookie = `accessToken=${token}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

function clearTokenCookie() {
  document.cookie = 'accessToken=; path=/; max-age=0';
}

function getErrorMessage(error: unknown, fallback: string) {
  const apiError = error as { response?: { data?: { message?: string } } };
  return apiError.response?.data?.message ?? fallback;
}

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, setAuth, logout: clearStore, setToken } = useAuthStore();

  const login = async (payload: LoginPayload) => {
    try {
      const res = await API.post<AuthResponse>(ENDPOINTS.auth.login, payload);
      const { user, accessToken } = res.data.data;

      //Simpan ke Zustand (untuk axios interceptor)
      setAuth(user, accessToken);

      // Simpan ke cookie untuk server components.
      setTokenCookie(accessToken);

      toast.success('Login berhasil');
      router.push('/dashboard');
      return true;
    } catch {
      toast.error('Email atau password salah');
      return false;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const res = await API.post<RegisterResponse>(
        ENDPOINTS.auth.register,
        payload,
      );

      toast.success(res.data.message ?? 'Registrasi berhasil, silakan login');
      router.push('/login');
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Registrasi gagal, silakan coba lagi'));
      return false;
    }
  };

  const logout = async () => {
    try {
      // Beritahu backend untuk invalidate refresh token
      await API.post(ENDPOINTS.auth.logout);
    } catch {
      // lanjut logout meski request gagal
    } finally {
      clearStore();
      clearTokenCookie(); // Hapus cookie
      toast.success('Berhasil keluar');
      router.push('/');
    }
  };

  // Setup token refresh interval (refresh 1 menit sebelum expire = setiap 14 menit)
  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
      try {
        const response = await API.post<{ success: boolean; data: { accessToken: string } }>(
          ENDPOINTS.auth.refresh,
          {},
        );
        const newAccessToken = response.data.data.accessToken;
        setToken(newAccessToken);
        setTokenCookie(newAccessToken);
      } catch {
        console.error('Refresh token otomatis gagal, user akan diminta login lagi');
      }
    }, 14 * 60 * 1000); // Refresh setiap 14 menit

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, setToken]);

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
