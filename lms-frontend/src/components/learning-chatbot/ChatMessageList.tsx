'use client';

import { Bot, UserRound } from 'lucide-react';
import type { ChatMessage } from './types';

type ChatMessageListProps = {
  messages: ChatMessage[];
  isSending: boolean;
};

export function ChatMessageList({ messages, isSending }: ChatMessageListProps) {
  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {message.role === 'assistant' && (
            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
          )}
          <div
            className={`max-w-[82%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-relaxed ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
            }`}
          >
            {message.content}
          </div>
          {message.role === 'user' && (
            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
              <UserRound className="h-4 w-4" />
            </div>
          )}
        </div>
      ))}
      {isSending && (
        <div className="flex gap-2 text-sm text-muted-foreground">
          <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div className="rounded-lg bg-muted px-3 py-2">Sedang menyusun jawaban...</div>
        </div>
      )}
    </div>
  );
}
