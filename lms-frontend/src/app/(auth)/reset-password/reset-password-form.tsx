'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import API from '@/lib/api';
import { ENDPOINTS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi password tidak sama',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function getErrorMessage(error: unknown, fallback: string) {
  const apiError = error as { response?: { data?: { message?: string } } };
  return apiError.response?.data?.message ?? fallback;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setIsVerifying(false);
        return;
      }

      try {
        await API.get(ENDPOINTS.auth.verifyToken, {
          params: { token },
        });
        setIsTokenValid(true);
      } catch {
        setIsTokenValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    void verifyToken();
  }, [token]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      toast.error('Token reset password tidak ditemukan.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await API.post<{ message?: string }>(
        ENDPOINTS.auth.resetPassword,
        {
          token,
          newPassword: values.newPassword,
        },
      );

      toast.success(response.data.message ?? 'Password berhasil direset.');
      router.push('/login');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Gagal mereset password.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Buat password baru untuk akun Learnexa kamu
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isVerifying ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Memeriksa link...
          </div>
        ) : !isTokenValid ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Link reset password tidak valid atau sudah kedaluwarsa.
            </p>
            <Button asChild className="w-full">
              <Link href="/forgot-password">Minta Link Baru</Link>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Baru</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Minimal 8 karakter"
                          disabled={isLoading}
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Ulangi password baru"
                          disabled={isLoading}
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Simpan Password Baru'
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>

      <CardFooter className="justify-center">
        <Link href="/login" className="text-sm text-primary hover:underline">
          Kembali ke login
        </Link>
      </CardFooter>
    </Card>
  );
}
