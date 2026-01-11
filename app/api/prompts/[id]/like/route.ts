import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      );
    }

    const promptId = params.id;

    // Проверяем, что промпт существует и публичный
    const prompt = await prisma.lifeScript.findFirst({
      where: {
        id: promptId,
        isPublic: true,
      },
    });

    if (!prompt) {
      return NextResponse.json(
        { error: "Промпт не найден или не публичный" },
        { status: 404 }
      );
    }

    // Проверяем, есть ли уже лайк
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        promptId,
      },
    });

    if (existingLike) {
      // Удаляем лайк
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // Создаем лайк
      await prisma.like.create({
        data: {
          userId,
          promptId,
        },
      });
    }

    // Получаем количество лайков
    const likesCount = await prisma.like.count({
      where: {
        promptId,
      },
    });

    // Проверяем, лайкнул ли текущий пользователь
    const liked = !existingLike;

    return NextResponse.json({
      liked,
      likesCount,
    });
  } catch (error) {
    console.error("[like] Ошибка:", error);
    return NextResponse.json(
      { error: "Не удалось обработать лайк" },
      { status: 500 }
    );
  }
}
