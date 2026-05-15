// src/components/learning/lesson-tracker.tsx
"use client";

import { useEffect } from "react";

interface Props {
  lessonId: string;
  token: string;
}

export default function LessonTracker({ lessonId, token }: Props) {
  useEffect(() => {
    fetch("http://localhost:3001/progress/access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lessonId }),
    }).catch(console.error);
  }, [lessonId]);

  return null;
}