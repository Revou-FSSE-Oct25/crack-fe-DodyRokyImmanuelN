'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FloatingChatButtonProps = {
  onClick: () => void;
};

export function FloatingChatButton({ onClick }: FloatingChatButtonProps) {
  return (
    <Button
      type="button"
      size="icon"
      className="fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full shadow-lg"
      onClick={onClick}
      title="Buka asisten belajar"
    >
      <MessageCircle className="h-5 w-5" />
    </Button>
  );
}
