import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type EditCourseHeaderProps = {
  title: string;
  isPublished: boolean;
};

export function EditCourseHeader({ title, isPublished }: EditCourseHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" asChild className="-ml-3 gap-2">
          <Link href="/admin/courses">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Edit Learning Path</h1>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>

      <Badge variant={isPublished ? 'default' : 'secondary'}>
        {isPublished ? 'Dipublikasikan' : 'Draft'}
      </Badge>
    </div>
  );
}
