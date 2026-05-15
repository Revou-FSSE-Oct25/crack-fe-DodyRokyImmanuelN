'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInput } from './ChatInput';
import { ChatMessageList } from './ChatMessageList';
import type { ChatMessage } from './types';

type LearningChatWindowProps = {
  lessonTitle: string;
  messages: ChatMessage[];
  isSending: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
};

export function LearningChatWindow({
  lessonTitle,
  messages,
  isSending,
  onClose,
  onSend,
}: LearningChatWindowProps) {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex h-[min(620px,calc(100vh-40px))] w-[min(420px,calc(100vw-40px))] flex-col overflow-hidden rounded-lg border bg-background shadow-2xl">
      <div className="flex items-start justify-between gap-3 border-b p-4">
        <div className="min-w-0">
          <h2 className="font-semibold">Asisten Belajar</h2>
          <p className="truncate text-xs text-muted-foreground">{lessonTitle}</p>
        </div>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ChatMessageList messages={messages} isSending={isSending} />
      <ChatInput isSending={isSending} onSend={onSend} />
    </div>
  );
}
