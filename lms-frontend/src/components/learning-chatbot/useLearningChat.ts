'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import API from '@/lib/api';
import { ENDPOINTS } from '@/lib/constants';
import type { AiChatPayload, AiChatResponse } from '@/types';
import type { ChatMessage } from './types';

const createMessageId = () => Math.random().toString(36).slice(2, 10);

type UseLearningChatParams = {
  scope: 'GENERAL' | 'LESSON';
  lessonId?: string;
  title: string;
  progressSummary?: string;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as ApiError;
  return apiError.response?.data?.message ?? fallback;
};

export function useLearningChat({
  scope,
  lessonId,
  title,
  progressSummary,
}: UseLearningChatParams) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createMessageId(),
      role: 'assistant',
      content:
        scope === 'LESSON'
          ? `Hai, aku siap bantu jelaskan lesson "${title}".`
          : 'Hai, aku siap bantu membaca progres belajarmu dari dashboard.',
    },
  ]);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (content: string) => {
    const question = content.trim();
    if (!question || isSending) return;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      content: question,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsSending(true);

    try {
      const payload: AiChatPayload = {
        scope,
        lessonId,
        progressSummary,
        messages: nextMessages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      };
      const response = await API.post<AiChatResponse>(ENDPOINTS.ai.chat, payload);
      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: response.data.message,
      };

      setMessages((previous) => [...previous, assistantMessage]);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Asisten belum bisa menjawab'));
      setMessages((previous) => [
        ...previous,
        {
          id: createMessageId(),
          role: 'assistant',
          content: 'Maaf, aku belum bisa menjawab sekarang. Coba lagi sebentar lagi.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    isSending,
    sendMessage,
  };
}
