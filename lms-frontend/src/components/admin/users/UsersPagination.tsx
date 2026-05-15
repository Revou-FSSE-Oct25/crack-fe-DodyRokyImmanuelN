import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UsersMeta } from './types';

type UsersPaginationProps = {
  meta: UsersMeta;
  page: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
};

export function UsersPagination({
  meta,
  page,
  isLoading,
  onPageChange,
}: UsersPaginationProps) {
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Halaman {meta.page} dari {meta.totalPages || 1}
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Sebelumnya
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= meta.totalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
          className="gap-2"
        >
          Berikutnya
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
