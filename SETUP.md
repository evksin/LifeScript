# Инструкция по настройке проекта

## Шаг 1: Установка зависимостей

```powershell
npm install
```

## Шаг 2: Настройка базы данных NeonDB

1. Зарегистрируйтесь на [https://neon.tech](https://neon.tech)
2. Создайте новый проект и базу данных
3. Скопируйте connection string (он выглядит как `postgresql://user:password@host:5432/database?sslmode=require`)

## Шаг 3: Создание файла .env.local

Создайте файл `.env.local` в корне проекта и добавьте:

```env
DATABASE_URL="ваш_connection_string_от_neon"
```

## Шаг 4: Генерация Prisma Client

```powershell
npx prisma generate
```

## Шаг 5: Создание и применение миграции

```powershell
npm run db:migrate
```

При первом запуске Prisma спросит имя миграции. Введите, например: `init`

## Шаг 6: Заполнение базы данных тестовыми данными

```powershell
npm run db:seed
```

## Шаг 7: Запуск проекта

```powershell
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) - вы должны увидеть список заметок из базы данных.

## Деплой на Vercel

### Вариант 1: Через Vercel CLI

```powershell
# Установка Vercel CLI
npm i -g vercel

# Логин
vercel login

# Деплой
vercel
```

### Вариант 2: Через GitHub

1. Создайте репозиторий на GitHub
2. Закоммитьте и запушьте код
3. Перейдите на [vercel.com](https://vercel.com)
4. Импортируйте репозиторий
5. В настройках проекта добавьте переменную окружения:
   - **Name**: `DATABASE_URL`
   - **Value**: ваш connection string от NeonDB
6. Нажмите Deploy

После деплоя Vercel автоматически:

- Установит зависимости
- Сгенерирует Prisma Client (`prisma generate`)
- Соберет проект (`next build`)
- Задеплоит на продакшен

**Важно**: Не забудьте добавить переменную окружения `DATABASE_URL` в настройках проекта Vercel!
