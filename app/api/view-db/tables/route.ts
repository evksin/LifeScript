import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Получаем список всех моделей из Prisma
    const models = [
      { name: "users", displayName: "Пользователи" },
      { name: "notes", displayName: "Заметки" },
      { name: "categories", displayName: "Категории" },
      { name: "life_scripts", displayName: "LifeScripts" },
      { name: "tags", displayName: "Теги" },
      { name: "tag_on_life_script", displayName: "Теги на LifeScript" },
      { name: "votes", displayName: "Голоса" },
    ];

    // Проверяем доступность каждой таблицы
    const tablesWithCounts = await Promise.all(
      models.map(async (model) => {
        try {
          let count = 0;
          switch (model.name) {
            case "users":
              count = await prisma.user.count();
              break;
            case "notes":
              count = await prisma.note.count();
              break;
            case "categories":
              count = await prisma.category.count();
              break;
            case "life_scripts":
              count = await prisma.lifeScript.count();
              break;
            case "tags":
              count = await prisma.tag.count();
              break;
            case "tag_on_life_script":
              count = await prisma.tagOnLifeScript.count();
              break;
            case "votes":
              count = await prisma.vote.count();
              break;
          }
          return { ...model, count, available: true };
        } catch (error) {
          return { ...model, count: 0, available: false };
        }
      })
    );

    return NextResponse.json({ tables: tablesWithCounts });
  } catch (error) {
    console.error("Ошибка при получении списка таблиц:", error);
    return NextResponse.json(
      { error: "Ошибка при получении списка таблиц" },
      { status: 500 }
    );
  }
}

