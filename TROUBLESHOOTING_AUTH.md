# Устранение проблем с авторизацией

## Проблема 1: Ошибка "missing required error components" на localhost

### Решение:
1. Перезапустите dev-сервер:
   ```powershell
   # Остановите сервер (Ctrl+C)
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

2. Проверьте, что все переменные окружения в `.env.local`:
   ```env
   DATABASE_URL="..."
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   AUTH_SECRET="..."
   ```

3. Убедитесь, что файл `app/api/auth/error/page.tsx` существует

## Проблема 2: На Vercel нет формы Google и можно войти без авторизации

### Причины и решения:

#### 1. Переменные окружения не настроены на Vercel

**Проверка:**
1. Откройте Vercel Dashboard → ваш проект → Settings → Environment Variables
2. Убедитесь, что добавлены:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `AUTH_SECRET`
   - `DATABASE_URL`

**Решение:**
- Добавьте все переменные для **Production**, **Preview** и **Development**
- После добавления **пересоберите проект** (Redeploy)

#### 2. Redirect URI не добавлен в Google Console

**Проверка:**
1. Откройте [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Найдите ваш OAuth 2.0 Client ID
3. Проверьте раздел "Authorized redirect URIs"

**Решение:**
- Добавьте ваш Vercel URL: `https://your-domain.vercel.app/api/auth/callback/google`
- Убедитесь, что используется `https://`, а не `http://`
- URL должен точно совпадать (без лишних слешей)

#### 3. Middleware не работает

**Проверка:**
- Откройте `/dashboard` на Vercel - должны перенаправить на `/login`
- Если не перенаправляет, middleware не работает

**Решение:**
- Проверьте, что `middleware.ts` находится в корне проекта
- Убедитесь, что `matcher` правильно настроен
- Проверьте логи деплоя на Vercel

#### 4. Переменные окружения не загружаются

**Решение:**
- После добавления переменных на Vercel **обязательно пересоберите проект**
- Или сделайте пустой коммит:
  ```powershell
  git commit --allow-empty -m "Пересборка для переменных окружения"
  git push
  ```

## Проверка работоспособности

### Локально:
1. Откройте `http://localhost:3000/login`
2. Должна появиться форма с кнопкой "Войти через Google"
3. При попытке открыть `/dashboard` без авторизации - должно перенаправить на `/login`

### На Vercel:
1. Откройте `https://your-domain.vercel.app/login`
2. Должна появиться форма с кнопкой "Войти через Google"
3. При попытке открыть `/dashboard` без авторизации - должно перенаправить на `/login`
4. После входа через Google - должно перенаправить на `/dashboard`

## Диагностика

### Проверка переменных окружения на Vercel:
1. Vercel Dashboard → ваш проект → Settings → Environment Variables
2. Убедитесь, что все переменные добавлены для нужных окружений

### Проверка логов:
1. Vercel Dashboard → ваш проект → Deployments → последний деплой → Logs
2. Ищите ошибки, связанные с:
   - `GOOGLE_CLIENT_ID`
   - `AUTH_SECRET`
   - `DATABASE_URL`

### Проверка Google OAuth:
1. Откройте [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Проверьте, что OAuth consent screen настроен
3. Проверьте, что redirect URIs добавлены правильно

