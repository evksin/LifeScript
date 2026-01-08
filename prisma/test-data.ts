import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Создание тестовых данных...");

  // 1. Создаём тестового пользователя
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Тестовый пользователь",
    },
  });
  console.log("✓ Создан пользователь:", user);

  // 2. Создаём категорию (если её нет)
  const category = await prisma.category.upsert({
    where: { category: "Развитие" },
    update: {},
    create: {
      category: "Развитие",
    },
  });
  console.log("✓ Создана категория:", category);

  // 3. Создаём тестовый промт (LifeScript)
  const lifeScript = await prisma.lifeScript.create({
    data: {
      title: "Тестовый промт для развития",
      content: "Это тестовый контент промта. Здесь может быть любой текст сценария.",
      description: "Описание тестового промта",
      categoryId: category.id,
      ownerId: user.id,
      visibility: "PUBLIC",
      publishedAt: new Date(),
    },
  });
  console.log("✓ Создан промт:", lifeScript);

  // 4. Создаём голос (Vote) от пользователя за промт
  const vote = await prisma.vote.create({
    data: {
      userId: user.id,
      lifeScriptId: lifeScript.id,
      value: 1,
    },
  });
  console.log("✓ Создан голос:", vote);

  // 5. Проверяем результаты
  const userWithData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      lifeScripts: true,
      votes: true,
      notes: true,
    },
  });

  console.log("\n=== Результаты ===");
  console.log("Пользователь:", userWithData?.email);
  console.log("Промтов создано:", userWithData?.lifeScripts.length);
  console.log("Голосов отдано:", userWithData?.votes.length);
  console.log("Заметок создано:", userWithData?.notes.length);

  console.log("\n✓ Все тестовые данные успешно созданы!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Ошибка:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

