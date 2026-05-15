import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COURSE_STEPS } from '@/types/course-form';

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0">
      {COURSE_STEPS.map((s, i) => {
        const Icon = s.icon;
        const isActive = currentStep === s.id;
        const isDone = currentStep > s.id;

        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  isDone
                    ? 'bg-primary border-primary text-primary-foreground'
                    : isActive
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-muted text-muted-foreground'
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span
                className={cn(
                  'text-xs font-medium whitespace-nowrap',
                  isActive ? 'text-primary' : isDone ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {s.label}
              </span>
            </div>

            {i < COURSE_STEPS.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-3 mb-5 transition-all duration-500',
                  currentStep > s.id ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}