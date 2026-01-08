# LifeScript

Минимальный рабочий проект на Next.js (App Router) + Prisma + NeonDB (PostgreSQL), готовый к деплою на Vercel.

## Технологии

- **Next.js 14** (TypeScript, App Router)
- **Prisma** (ORM)
- **NeonDB** (PostgreSQL)
- **Vercel** (деплой)

## Быстрый старт

### 1. Установка зависимостей

```powershell
npm install
```

### 2. Настройка базы данных

1. Создайте базу данных на [NeonDB](https://neon.tech)
2. Скопируйте connection string
3. Создайте файл `.env.local` и добавьте:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
AUTH_SECRET="your-auth-secret"
```

**Получение Google OAuth credentials:**
1. Перейдите в [Google Cloud Console](https://console.cloud.google.com)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API
4. Перейдите в "Credentials" → "Create Credentials" → "OAuth client ID"
5. Выберите "Web application"
6. Добавьте Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (для разработки)
   - `https://your-domain.vercel.app/api/auth/callback/google` (для production)
7. Скопируйте Client ID и Client Secret

**Генерация AUTH_SECRET:**
```powershell
# Используйте OpenSSL или любой генератор случайных строк
openssl rand -base64 32
```

### 3. Настройка Prisma и миграция

```powershell
# Генерация Prisma Client
npx prisma generate

# Создание и применение миграции
npm run db:migrate
```

### 4. Заполнение базы данных (seed)

```powershell
npm run db:seed
```

### 5. Запуск проекта

```powershell
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build
npm start
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Деплой на Vercel

### 1. Подготовка

1. Убедитесь, что все изменения закоммичены в Git
2. Создайте репозиторий на GitHub (если еще нет)

### 2. Деплой через Vercel CLI

```powershell
# Установка Vercel CLI (если еще не установлен)
npm i -g vercel

# Логин в Vercel
vercel login

# Деплой
vercel
```

### 3. Настройка переменных окружения на Vercel

1. Перейдите в настройки проекта на Vercel
2. Добавьте переменную окружения:
   - **Name**: `DATABASE_URL`
   - **Value**: ваш connection string от NeonDB

### 4. Деплой через GitHub

1. Подключите репозиторий к Vercel
2. Добавьте переменную окружения `DATABASE_URL` в настройках проекта
3. Vercel автоматически соберет и задеплоит проект

## Структура проекта

```
.
├── app/
│   ├── layout.tsx      # Корневой layout
│   ├── page.tsx        # Главная страница с запросом к БД
│   └── globals.css     # Глобальные стили
├── lib/
│   └── prisma.ts       # Singleton для Prisma Client
├── prisma/
│   ├── schema.prisma   # Схема базы данных
│   └── seed.ts         # Seed файл для заполнения БД
├── .env.example        # Пример переменных окружения
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── vercel.json         # Конфигурация для Vercel
```

## Модель данных

### Note

- `id` (String, UUID) - уникальный идентификатор
- `title` (String) - заголовок заметки
- `createdAt` (DateTime) - дата создания

## Полезные команды

```powershell
# Разработка
npm run dev

# Сборка
npm run build

# Запуск продакшен версии
npm start

# Prisma команды
npm run db:migrate      # Создать и применить миграцию
npm run db:seed         # Заполнить БД тестовыми данными
npm run db:studio       # Открыть Prisma Studio
```

## Примечания

- Все переменные окружения должны быть настроены в Vercel перед деплоем
- Prisma Client генерируется автоматически при сборке (`npm run build`)
- Для продакшена убедитесь, что `DATABASE_URL` настроен в переменных окружения Vercel
