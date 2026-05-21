import { Badge } from '@/components/ui/badge';
import type { AdminUser } from './types';

type UserEnrollmentSummaryProps = {
  enrollments: AdminUser['enrollments'];
};

export function UserEnrollmentSummary({
  enrollments,
}: UserEnrollmentSummaryProps) {
  if (enrollments.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
        <span className="text-sm text-muted-foreground">Belum enroll</span>
      </div>
    );
  }

  const activeCount = enrollments.filter(
    (enrollment) => enrollment.status === 'ACTIVE',
  ).length;
  const completedCount = enrollments.filter(
    (enrollment) => enrollment.status === 'COMPLETED',
  ).length;
  const latestEnrollment = enrollments[0];
  const statusSummary = [
    activeCount > 0 ? `${activeCount} aktif` : null,
    completedCount > 0 ? `${completedCount} selesai` : null,
  ]
    .filter(Boolean)
    .join(' / ');

  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="shrink-0">
          {enrollments.length} learning path
        </Badge>
        {statusSummary && (
          <span className="truncate text-xs text-muted-foreground">
            {statusSummary}
          </span>
        )}
      </div>
      <p className="truncate text-xs text-muted-foreground">
        Terbaru: {latestEnrollment.learningPath.title}
      </p>
    </div>
  );
}
