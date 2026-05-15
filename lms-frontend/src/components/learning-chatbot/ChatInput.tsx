'use client';

import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ChatInputProps = {
  isSending: boolean;
  onSend: (message: string) => void;
};

export function ChatInput({ isSending, onSend }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSend(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
      <Input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        disabled={isSending}
        placeholder="Tanya tanya ahjaa..."
      />
      <Button type="submit" size="icon" disabled={isSending || !message.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
