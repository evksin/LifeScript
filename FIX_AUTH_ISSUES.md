# Исправление проблем с авторизацией

## Проблема 1: На localhost ошибка "missing required error components"

### Решение:

1. **Очистите кэш Next.js:**
   ```powershell
   Remove-Item -Recurse -Force .next
   ```

2. **Перезапустите dev-сервер:**
   ```powershell
   npm run dev
   ```

3. **Проверьте переменные окружения в `.env.local`:**
   ```env
   DATABASE_URL="..."
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   AUTH_SECRET="..."
   ```

## Проблема 2: На Vercel нет формы Google и можно войти без авторизации

### Причина:
**Переменные окружения не настроены на Vercel** или **проект не пересобран** после их добавления.

### Решение:

#### Шаг 1: Добавьте переменные окружения на Vercel

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **Settings** → **Environment Variables**
4. Добавьте **ВСЕ** переменные для **Production**, **Preview** и **Development**:

   - `DATABASE_URL` - ваш production DATABASE_URL
   - `GOOGLE_CLIENT_ID` - тот же, что локально
   - `GOOGLE_CLIENT_SECRET` - тот же, что локально
   - `AUTH_SECRET` - тот же, что локально

#### Шаг 2: Пересоберите проект

**ВАЖНО:** После добавления переменных **ОБЯЗАТЕЛЬНО** пересоберите проект!

**Вариант 1: Через Dashboard**
1. Vercel Dashboard → ваш проект → **Deployments**
2. Найдите последний деплой
3. Нажмите **"..."** (три точки) → **"Redeploy"**
4. Выберите **"Use existing Build Cache"** = **No**

**Вариант 2: Через Git**
```powershell
git commit --allow-empty -m "Пересборка для переменных окружения"
git push
```

#### Шаг 3: Проверьте Google OAuth redirect URI

1. Откройте [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Найдите ваш OAuth 2.0 Client ID
3. Убедитесь, что добавлен redirect URI:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```
   (Замените `your-domain` на ваш реальный домен Vercel)

#### Шаг 4: Проверьте работу

1. Откройте `https://your-domain.vercel.app/login`
2. **Должна появиться форма** с кнопкой "Войти через Google"
3. Откройте `https://your-domain.vercel.app/dashboard` без авторизации
4. **Должно перенаправить** на `/login`

## Диагностика

### Проверка переменных окружения на Vercel:

1. Vercel Dashboard → ваш проект → **Settings** → **Environment Variables**
2. Убедитесь, что все переменные добавлены
3. Проверьте, что они добавлены для нужных окружений (Production/Preview/Development)

### Проверка логов:

1. Vercel Dashboard → ваш проект → **Deployments** → последний деплой → **Build Logs**
2. Ищите ошибки, связанные с:
   - `GOOGLE_CLIENT_ID`
   - `AUTH_SECRET`
   - `DATABASE_URL`

### Проверка в браузере:

1. Откройте консоль браузера (F12 → Console)
2. Откройте `https://your-domain.vercel.app/login`
3. Ищите ошибки в консоли

## Частые ошибки

### "redirect_uri_mismatch"
- Проверьте, что redirect URI в Google Console точно совпадает с вашим Vercel доменом
- Убедитесь, что используется `https://`, а не `http://`

### Форма не появляется
- Проверьте, что переменные окружения добавлены на Vercel
- Убедитесь, что проект пересобран после добавления переменных
- Проверьте логи деплоя на Vercel

### Можно войти без авторизации
- Проверьте, что middleware работает (попробуйте открыть `/dashboard` без авторизации)
- Убедитесь, что страницы защищены (проверьте `app/dashboard/page.tsx` и `app/my-prompts/page.tsx`)

