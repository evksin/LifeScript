# Инструкция по деплою на Vercel с базой данных

## Проблема: Разные базы данных

**Важно понимать:** Локальная база данных (development) и база данных на Vercel (production) - это **разные базы данных**. Данные не синхронизируются автоматически.

## Решение: Применить миграции и seed на production

### Шаг 1: Убедитесь, что миграции применены

Миграции теперь применяются автоматически при сборке на Vercel (благодаря `prisma migrate deploy` в `buildCommand`).

### Шаг 2: Запустите seed на production базе

После деплоя нужно один раз заполнить production базу данных тестовыми данными.

#### Вариант 1: Через Vercel CLI (рекомендуется)

```powershell
# Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# Логин
vercel login

# Подключитесь к проекту
vercel link

# Запустите seed с production переменными окружения
vercel env pull .env.production
npx prisma migrate deploy
npm run db:seed
```

#### Вариант 2: Через Vercel Dashboard

1. Перейдите в настройки проекта на Vercel
2. Откройте вкладку "Settings" → "Environment Variables"
3. Убедитесь, что `DATABASE_URL` настроен для Production
4. Используйте Vercel CLI для выполнения команды:

```powershell
vercel env pull .env.production
npx prisma migrate deploy
npm run db:seed
```

#### Вариант 3: Вручную через NeonDB Dashboard

1. Откройте [NeonDB Dashboard](https://console.neon.tech)
2. Найдите вашу production базу данных
3. Используйте SQL Editor для вставки данных:

```sql
-- Вставьте тестовые данные
INSERT INTO notes (id, title, "createdAt") VALUES
  (gen_random_uuid(), 'Первая заметка', NOW()),
  (gen_random_uuid(), 'Вторая заметка', NOW()),
  (gen_random_uuid(), 'Третья заметка', NOW());
```

### Шаг 3: Проверьте результат

После применения миграций и seed, обновите страницу на Vercel - вы должны увидеть заметки.

## Автоматическое применение миграций

Миграции теперь применяются автоматически при каждом деплое благодаря настройке в `vercel.json`:

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

Это означает, что при каждом деплое:
1. Генерируется Prisma Client
2. Применяются все pending миграции к production базе
3. Собирается Next.js приложение

## Важно

- **Seed НЕ запускается автоматически** - это нужно сделать вручную один раз после первого деплоя
- **КРИТИЧЕСКИ ВАЖНО:** Убедитесь, что `DATABASE_URL` в Vercel указывает на **правильный проект NeonDB**. Если данные не отображаются, проверьте:
  1. Vercel Dashboard → Settings → Environment Variables
  2. Убедитесь, что `DATABASE_URL` для Production указывает на тот же проект NeonDB, где вы вставили данные
  3. Connection string должен совпадать с тем, что в NeonDB Dashboard
- Миграции применяются автоматически при каждом деплое (если настроено)

