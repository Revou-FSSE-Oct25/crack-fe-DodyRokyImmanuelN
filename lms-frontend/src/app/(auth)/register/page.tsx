'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Loader2,Eye,EyeOff } from 'lucide-react';
import { useState } from 'react';

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
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak sama',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    await register({
      name: values.name,
      email: values.email,
      password: values.password,
    });
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Daftar</CardTitle>
        <CardDescription>
          Buat akun baru untuk mulai belajar
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama kamu"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
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
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="pr-10"
                        {...field}
                    />

                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                'Daftar Sekarang'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Masuk di sini
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
