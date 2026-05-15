
'use client';

import { LearningPathForm } from "@/types/course-form";

interface CourseDetailFormProps {
  initialData: LearningPathForm;
  onSubmit: (data: Partial<LearningPathForm>) => void;
}

export default function CourseDetailForm({ initialData, onSubmit }: CourseDetailFormProps) {
  // Contoh handler saat form disubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="border p-6 rounded-lg shadow-sm space-y-4">
      <h2 className="text-xl font-semibold">Detail Kursus</h2>
      {/* Input title, description, price, thumbnail, toggle Published/Draft */}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Simpan Detail
      </button>
    </form>
  );
}
