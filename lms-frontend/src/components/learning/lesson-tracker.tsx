// src/components/learning/lesson-tracker.tsx
"use client";

import { useEffect } from "react";
import { API_URL } from "@/lib/constants";

interface Props {
  lessonId: string;
  token: string;
}

export default function LessonTracker({ lessonId, token }: Props) {
  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/progress/access`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lessonId }),
    }).catch((error) => {
      if (error.name !== "AbortError") {
        console.warn("Gagal mencatat akses lesson:", error);
      }
    });

    return () => controller.abort();
  }, [lessonId, token]);

  return null;
}
