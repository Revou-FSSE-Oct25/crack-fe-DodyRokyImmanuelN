import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ApiResponse, Module } from "@/types";
import { API_URL } from "@/lib/constants";

interface Props {
  params: Promise<{
    slug: string;
    moduleSlug: string;
  }>;
}

async function getModule(moduleSlug: string, token: string): Promise<Module> {
  const res = await fetch(`${API_URL}/modules/${moduleSlug}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result: ApiResponse<Module> = await res.json();
  return result.data;
}

async function getModuleProgress(moduleId: string, token: string) {
  const res = await fetch(
    `${API_URL}/progress/module/${moduleId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) return null;
  const result = await res.json();
  return result.data;
}

export default async function ModulePage({ params }: Props) {
  const { slug, moduleSlug } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  const moduleDetail = await getModule(moduleSlug, token);
  const progress = await getModuleProgress(moduleDetail.id, token);

  // Prioritas: lesson terakhir diakses → lesson pertama (fallback)
  const targetLesson =
    progress?.lastAccessedLessonSlug ?? moduleDetail.lessons[0]?.slug;

  if (!targetLesson) {
    return <div>Belum ada lesson di modul ini.</div>;
  }

  redirect(`/learning/${slug}/module/${moduleSlug}/lesson/${targetLesson}`);
}
