# Решение проблем с базой данных на Vercel

## Проблема: Данные не отображаются на Vercel

### Шаг 1: Проверьте, что миграции применены

Миграции должны применяться автоматически при сборке. Проверьте логи деплоя на Vercel:

1. Перейдите в Vercel Dashboard → ваш проект → Deployments
2. Откройте последний деплой
3. Проверьте логи сборки (Build Logs)
4. Убедитесь, что видите: `✔ Applied migration` или `Database is up to date`

### Шаг 2: Убедитесь, что таблица существует

Выполните в NeonDB SQL Editor (для production базы):

```sql
-- Проверьте, существует ли таблица
SELECT * FROM notes;

-- Если таблицы нет, создайте её вручную:
CREATE TABLE IF NOT EXISTS "notes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);
```

### Шаг 3: Проверьте DATABASE_URL на Vercel

1. Перейдите в Vercel Dashboard → Settings → Environment Variables
2. Убедитесь, что `DATABASE_URL` настроен для **Production**
3. Проверьте, что это тот же connection string, что и в NeonDB Dashboard

### Шаг 4: Пересоберите проект

После применения миграций и вставки данных:

1. В Vercel Dashboard → Deployments
2. Найдите последний деплой
3. Нажмите "Redeploy" (или сделайте новый коммит и пуш)

### Шаг 5: Проверьте данные напрямую

Выполните в NeonDB SQL Editor:

```sql
-- Проверьте количество записей
SELECT COUNT(*) FROM notes;

-- Посмотрите все записи
SELECT * FROM notes;
```

Если данные есть в базе, но не отображаются на сайте - проблема в коде или кэше.

### Шаг 6: Очистите кэш Vercel

1. Vercel Dashboard → Settings → Data Cache
2. Очистите кэш или пересоберите проект

## Быстрое решение

Если ничего не помогает, выполните полный пересбор:

```powershell
# 1. Убедитесь, что миграции применены локально
npx prisma migrate deploy

# 2. Проверьте данные
npx prisma studio

# 3. Сделайте коммит и пуш (это запустит новый деплой)
git add .
git commit -m "Применить миграции на production"
git push
```

## Проверка через Vercel CLI

```powershell
# Получите production переменные
vercel env pull .env.production

# Примените миграции локально с production БД
npx prisma migrate deploy

# Проверьте данные
npx prisma studio
```

