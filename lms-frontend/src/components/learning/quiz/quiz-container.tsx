"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type AnswerMap = {
  [questionId: string]: string;
};

export default function QuizContainer({
  quiz,
  lesson,
  token,
  slug,
  moduleSlug,
  lastAttempt,
}: any) {
  const router = useRouter();

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submittedRef = useRef(false);
  const currentQuestion = quiz.questions[currentIndex];

  useEffect(() => {
    if (!started || submitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!submittedRef.current) handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, submitted]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const selectAnswer = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const next = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((p) => p + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((p) => p - 1);
    }
  };

  const handleSubmit = async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, optionId]) => ({
          questionId,
          optionId,
        })),
      };

      const res = await fetch(
        `http://localhost:3001/quizzes/${quiz.id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`Server bermasalah: ${res.status}`);

      const data = await res.json();
      if (!data?.data) throw new Error("Response tidak valid dari server");

      setResult(data.data);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message ?? "Terjadi kesalahan saat submit quiz");
      submittedRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── PRE-QUIZ SCREEN ──────────────────────────────────────────
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto p-10">
        <h1 className="text-2xl font-bold mb-1">{lesson.title}</h1>
        <p className="text-muted-foreground mb-8">
          {quiz.questions.length} soal - {quiz.timeLimit} menit - Nilai lulus {quiz.passingScore}
        </p>

        {lastAttempt ? (
          <div
            className={`p-5 rounded-lg border-2 mb-8 ${
              lastAttempt.isPassed
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : "border-red-400 bg-red-50 dark:bg-red-950"
            }`}
          >
            <p className="text-sm text-muted-foreground mb-1">
              Percobaan terakhir #{lastAttempt.attemptNumber}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{lastAttempt.score}</p>
                <p
                  className={`text-sm font-semibold mt-1 ${
                    lastAttempt.isPassed ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {lastAttempt.isPassed ? "✓ Lulus" : "✗ Tidak Lulus"}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(lastAttempt.submittedAt).toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-lg border border-dashed border-border mb-8 text-center">
            <p className="text-muted-foreground text-sm">
              Kamu belum pernah mengerjakan quiz ini.
            </p>
          </div>
        )}

        <button
          onClick={() => setStarted(true)}
          className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          {lastAttempt ? "Coba Lagi" : "Mulai Quiz"}
        </button>
      </div>
    );
  }

  // ── LOADING SUBMIT ───────────────────────────────────────────
  if (isSubmitting) {
    return (
      <div className="max-w-2xl mx-auto p-10 text-center">
        <p className="text-muted-foreground">Mengirim jawaban...</p>
      </div>
    );
  }

  // ── RESULT SCREEN ────────────────────────────────────────────
  if (submitted && result) {
    const passed = result.isPassed;

    return (
      <div className="max-w-2xl mx-auto p-10">
        <h1 className="text-2xl font-bold mb-2">Hasil Quiz</h1>
        <p className="text-muted-foreground mb-6">{lesson.title}</p>

        <div
          className={`p-6 rounded-lg border-2 mb-6 text-center ${
            passed
              ? "border-green-500 bg-green-50 dark:bg-green-950"
              : "border-red-400 bg-red-50 dark:bg-red-950"
          }`}
        >
          <p className="text-5xl font-bold mb-2">{result.score}</p>
          <p
            className={`text-lg font-semibold ${
              passed ? "text-green-600" : "text-red-500"
            }`}
          >
            {passed ? "✓ Lulus" : "✗ Tidak Lulus"}
          </p>
        </div>

        <div className="p-4 border rounded-lg bg-muted space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nilai Lulus</span>
            <span className="font-medium">{result.passingScore}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Percobaan ke-</span>
            <span className="font-medium">{result.attemptNumber}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              submittedRef.current = false;
              setSubmitted(false);
              setResult(null);
              setAnswers({});
              setCurrentIndex(0);
              setTimeLeft(quiz.timeLimit * 60);
              setStarted(false);
            }}
            className="flex-1 px-4 py-2 border rounded hover:bg-muted transition"
          >
            Coba Lagi
          </button>
          <button
            onClick={() =>
              router.push(`/learning/${slug}/module/${moduleSlug}`)
            }
            className="flex-1 px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition"
          >
            Kembali ke Modul
          </button>
        </div>
      </div>
    );
  }

  // ── QUIZ UI ──────────────────────────────────────────────────
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions.length;

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{lesson.title}</h1>
        <div
          className={`font-mono text-sm px-3 py-1 rounded border ${
            timeLeft <= 60
              ? "border-red-400 text-red-500 bg-red-50 dark:bg-red-950"
              : "border-border"
          }`}
        >
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>
            Soal {currentIndex + 1} dari {totalQuestions}
          </span>
          <span>
            {answeredCount}/{totalQuestions} dijawab
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-300 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="border rounded-lg p-5 space-y-4">
        <h2 className="text-lg font-semibold">{currentQuestion.text}</h2>
        <div className="space-y-2">
          {currentQuestion.options.map((opt: any) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition
                ${
                  answers[currentQuestion.id] === opt.id
                    ? "border-primary bg-primary/10"
                    : "hover:bg-muted"
                }`}
            >
              <input
                type="radio"
                checked={answers[currentQuestion.id] === opt.id}
                onChange={() => selectAnswer(opt.id)}
              />
              {opt.text}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Sebelumnya
        </button>

        {currentIndex === totalQuestions - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
          >
            Kumpulkan Quiz
          </button>
        ) : (
          <button
            onClick={next}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Berikutnya
          </button>
        )}
      </div>
    </div>
  );
}
