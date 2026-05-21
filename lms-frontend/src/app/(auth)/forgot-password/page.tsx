'use client';

import Link from 'next/link';
import { Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
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

const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

function getErrorMessage(error: unknown, fallback: string) {
  const apiError = error as { response?: { data?: { message?: string } } };
  return apiError.response?.data?.message ?? fallback;
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);

    try {
      const response = await API.post<{ message?: string }>(
        ENDPOINTS.auth.forgotPassword,
        values,
      );

      setIsSubmitted(true);
      toast.success(
        response.data.message ?? 'Link reset password sudah dikirim ke email.',
      );
    } catch (error) {
      toast.error(
        getErrorMessage(error, 'Gagal mengirim link reset password.'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Lupa Password</CardTitle>
        <CardDescription>
          Masukkan email akun kamu untuk menerima link reset password
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSubmitted ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              Jika email terdaftar, link reset password akan masuk ke inbox
              kamu.
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsSubmitted(false)}
            >
              Kirim Ulang
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="nama@email.com"
                        disabled={isLoading}
                        {...field}
                      />
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
                  'Kirim Link Reset'
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
