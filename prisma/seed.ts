import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Начинаем seeding...')

  // Создаём или получаем пользователя для заметок
  const user = await prisma.user.upsert({
    where: { email: 'seed@example.com' },
    update: {},
    create: {
      email: 'seed@example.com',
      name: 'Seed User',
    },
  })

  console.log(`Используем пользователя: ${user.email}`)

  // Удаляем все существующие заметки
  const deleted = await prisma.note.deleteMany({})
  console.log(`Удалено заметок: ${deleted.count}`)

  // Создаём 3 новые заметки
  const note1 = await prisma.note.create({
    data: {
      title: 'Первая заметка',
      ownerId: user.id,
    },
  })

  const note2 = await prisma.note.create({
    data: {
      title: 'Вторая заметка',
      ownerId: user.id,
    },
  })

  const note3 = await prisma.note.create({
    data: {
      title: 'Третья заметка',
      ownerId: user.id,
    },
  })

  console.log('Создано заметок:', { note1, note2, note3 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


