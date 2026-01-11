"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface CreatePromptInput {
  title: string;
  content: string;
  isPublic?: boolean;
}

export interface UpdatePromptInput {
  id: string;
  title?: string;
  content?: string;
  isPublic?: boolean;
}

export async function createPrompt(input: CreatePromptInput) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { error: "Необходима авторизация" };
    }

    if (!input.title || !input.content) {
      return { error: "Заголовок и содержимое обязательны" };
    }

    const prompt = await prisma.lifeScript.create({
      data: {
        ownerId: userId,
        title: input.title.trim(),
        content: input.content.trim(),
        isPublic: input.isPublic ?? false,
        isFavorite: false,
        visibility: input.isPublic ? "PUBLIC" : "PRIVATE",
        // categoryId опциональный, можно оставить null
        categoryId: null,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: prompt };
  } catch (error) {
    console.error("[createPrompt] Ошибка:", error);
    return { error: "Не удалось создать промпт" };
  }
}

export async function updatePrompt(input: UpdatePromptInput) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { error: "Необходима авторизация" };
    }

    // Проверяем, что промпт принадлежит пользователю
    const existing = await prisma.lifeScript.findFirst({
      where: {
        id: input.id,
        ownerId: userId,
      },
    });

    if (!existing) {
      return { error: "Промпт не найден или нет доступа" };
    }

    const updateData: any = {};
    if (input.title !== undefined) {
      updateData.title = input.title.trim();
    }
    if (input.content !== undefined) {
      updateData.content = input.content.trim();
    }
    if (input.isPublic !== undefined) {
      updateData.isPublic = input.isPublic;
      updateData.visibility = input.isPublic ? "PUBLIC" : "PRIVATE";
    }

    const prompt = await prisma.lifeScript.update({
      where: { id: input.id },
      data: updateData,
    });

    revalidatePath("/dashboard");
    return { success: true, data: prompt };
  } catch (error) {
    console.error("[updatePrompt] Ошибка:", error);
    return { error: "Не удалось обновить промпт" };
  }
}

export async function deletePrompt(id: string) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { error: "Необходима авторизация" };
    }

    // Проверяем, что промпт принадлежит пользователю
    const existing = await prisma.lifeScript.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!existing) {
      return { error: "Промпт не найден или нет доступа" };
    }

    await prisma.lifeScript.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[deletePrompt] Ошибка:", error);
    return { error: "Не удалось удалить промпт" };
  }
}

export async function togglePublic(id: string) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { error: "Необходима авторизация" };
    }

    const existing = await prisma.lifeScript.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!existing) {
      return { error: "Промпт не найден или нет доступа" };
    }

    const newIsPublic = !existing.isPublic;
    const prompt = await prisma.lifeScript.update({
      where: { id },
      data: {
        isPublic: newIsPublic,
        visibility: newIsPublic ? "PUBLIC" : "PRIVATE",
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: prompt };
  } catch (error) {
    console.error("[togglePublic] Ошибка:", error);
    return { error: "Не удалось изменить видимость" };
  }
}

export async function toggleFavorite(id: string) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { error: "Необходима авторизация" };
    }

    const existing = await prisma.lifeScript.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!existing) {
      return { error: "Промпт не найден или нет доступа" };
    }

    const prompt = await prisma.lifeScript.update({
      where: { id },
      data: {
        isFavorite: !existing.isFavorite,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: prompt };
  } catch (error) {
    console.error("[toggleFavorite] Ошибка:", error);
    return { error: "Не удалось изменить избранное" };
  }
}

export async function getPrompts(filters?: {
  isPublic?: boolean;
  isFavorite?: boolean;
  search?: string;
}) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { error: "Необходима авторизация", data: [] };
    }

    const where: any = {
      ownerId: userId,
    };

    if (filters?.isPublic !== undefined) {
      where.isPublic = filters.isPublic;
    }

    if (filters?.isFavorite !== undefined) {
      where.isFavorite = filters.isFavorite;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { content: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const prompts = await prisma.lifeScript.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
      take: 50, // Ограничиваем до 50 записей
    });

    return { success: true, data: prompts };
  } catch (error) {
    console.error("[getPrompts] Ошибка:", error);
    return { error: "Не удалось загрузить промпты", data: [] };
  }
}

export async function getPublicPrompts(search?: string) {
  try {
    const where: any = {
      isPublic: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const prompts = await prisma.lifeScript.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return { success: true, data: prompts };
  } catch (error) {
    console.error("[getPublicPrompts] Ошибка:", error);
    return { error: "Не удалось загрузить публичные промпты", data: [] };
  }
}
