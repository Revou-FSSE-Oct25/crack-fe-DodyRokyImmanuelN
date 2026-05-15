'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,        // 1 menit
            retry: 1,                     // kalau gagal, coba 1x lagi
            refetchOnWindowFocus: false,  // tidak refetch saat pindah tab
          },
        },
      }),
  );

  return (
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          richColors
          position="top-right"
          duration={3000}
          closeButton
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  );
}