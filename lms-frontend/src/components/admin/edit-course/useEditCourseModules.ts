"use client";

import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { toast } from "sonner";

import API from "@/lib/api";
import { emptyModuleForm, getErrorMessage } from "./form-utils";
import type {
  ApiEnvelope,
  LearningPath,
  Module,
  ModuleDialogState,
} from "./types";

type UseEditCourseModulesParams = {
  learningPath: LearningPath | null;
  setLearningPath: Dispatch<SetStateAction<LearningPath | null>>;
  loadLessons: (moduleId: string) => Promise<void>;
};

export function useEditCourseModules({
  learningPath,
  setLearningPath,
  loadLessons,
}: UseEditCourseModulesParams) {
  const [isSavingModule, setIsSavingModule] = useState(false);
  const [isDeletingModule, setIsDeletingModule] = useState(false);
  const [moduleDialog, setModuleDialog] = useState<ModuleDialogState>({
    open: false,
    mode: "create",
    form: emptyModuleForm(1),
  });
  const [deleteModuleDialog, setDeleteModuleDialog] = useState<{
    moduleId: string;
    title: string;
  } | null>(null);

  const toggleModule = (moduleId: string) => {
    const moduleItem = learningPath?.modules.find(
      (item) => item.id === moduleId,
    );
    if (!moduleItem) return;

    const shouldLoadLessons =
      !moduleItem.isExpanded && !moduleItem.lessonsLoaded;

    setLearningPath((previous) => {
      if (!previous) return previous;
      return {
        ...previous,
        modules: previous.modules.map((item) =>
          item.id === moduleId
            ? { ...item, isExpanded: !item.isExpanded }
            : item,
        ),
      };
    });

    if (shouldLoadLessons) {
      void loadLessons(moduleId);
    }
  };

  const openCreateModule = () => {
    setModuleDialog({
      open: true,
      mode: "create",
      form: emptyModuleForm((learningPath?.modules.length ?? 0) + 1),
    });
  };

  const openEditModule = (moduleItem: Module) => {
    setModuleDialog({
      open: true,
      mode: "edit",
      moduleId: moduleItem.id,
      form: {
        title: moduleItem.title,
        description: moduleItem.description ?? "",
        order: String(moduleItem.order),
      },
    });
  };

  const handleSaveModule = async () => {
    if (!learningPath) return;
    if (!moduleDialog.form.title.trim()) {
      toast.error("Judul modul wajib diisi");
      return;
    }

    setIsSavingModule(true);
    try {
      const payload = {
        title: moduleDialog.form.title.trim(),
        description: moduleDialog.form.description.trim() || undefined,
        order: Number(moduleDialog.form.order) || 1,
      };

      if (moduleDialog.mode === "create") {
        const response = await API.post<
          ApiEnvelope<
            Omit<
              Module,
              "lessons" | "isExpanded" | "isLoadingLessons" | "lessonsLoaded"
            >
          >
        >("/modules", { ...payload, learningPathId: learningPath.id });
        const createdModule: Module = {
          ...response.data.data,
          lessons: [],
          isExpanded: false,
          isLoadingLessons: false,
          lessonsLoaded: true,
        };

        setLearningPath((previous) => {
          if (!previous) return previous;
          return { ...previous, modules: [...previous.modules, createdModule] };
        });
        toast.success("Modul berhasil dibuat");
      } else if (moduleDialog.moduleId) {
        const response = await API.patch<ApiEnvelope<Module>>(
          `/modules/${moduleDialog.moduleId}`,
          payload,
        );
        const updatedModule = response.data.data;

        setLearningPath((previous) => {
          if (!previous) return previous;
          return {
            ...previous,
            modules: previous.modules.map((moduleItem) =>
              moduleItem.id === moduleDialog.moduleId
                ? {
                    ...moduleItem,
                    title: updatedModule.title,
                    slug: updatedModule.slug,
                    description: updatedModule.description,
                    order: updatedModule.order,
                  }
                : moduleItem,
            ),
          };
        });
        toast.success("Modul berhasil disimpan");
      }

      setModuleDialog((previous) => ({ ...previous, open: false }));
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menyimpan modul"));
    } finally {
      setIsSavingModule(false);
    }
  };

  const handleDeleteModule = async () => {
    if (!deleteModuleDialog) return;

    setIsDeletingModule(true);
    try {
      await API.delete(`/modules/${deleteModuleDialog.moduleId}`);
      setLearningPath((previous) => {
        if (!previous) return previous;
        return {
          ...previous,
          modules: previous.modules.filter(
            (moduleItem) => moduleItem.id !== deleteModuleDialog.moduleId,
          ),
        };
      });
      toast.success("Modul berhasil dihapus");
      setDeleteModuleDialog(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus modul"));
    } finally {
      setIsDeletingModule(false);
    }
  };

  return {
    moduleDialog,
    setModuleDialog,
    deleteModuleDialog,
    setDeleteModuleDialog,
    isSavingModule,
    isDeletingModule,
    toggleModule,
    openCreateModule,
    openEditModule,
    handleSaveModule,
    handleDeleteModule,
  };
}
