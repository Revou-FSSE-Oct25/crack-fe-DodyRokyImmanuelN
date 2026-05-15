'use client';

import { useState } from 'react';
import { FloatingChatButton } from './FloatingChatButton';
import { LearningChatWindow } from './LearningChatWindow';
import { useLearningChat } from './useLearningChat';

type LearningChatbotProps = {
  scope: 'GENERAL' | 'LESSON';
  lessonId?: string;
  title: string;
  progressSummary?: string;
};

export function LearningChatbot({
  scope,
  lessonId,
  title,
  progressSummary,
}: LearningChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isSending, sendMessage } = useLearningChat({
    scope,
    lessonId,
    title,
    progressSummary,
  });

  if (!isOpen) {
    return <FloatingChatButton onClick={() => setIsOpen(true)} />;
  }

  return (
    <LearningChatWindow
      lessonTitle={title}
      messages={messages}
      isSending={isSending}
      onClose={() => setIsOpen(false)}
      onSend={(message) => void sendMessage(message)}
    />
  );
}
