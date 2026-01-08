# Настройка авторизации для Localhost и Vercel

Авторизация должна работать **и на localhost, и на Vercel**. Для этого нужно настроить оба окружения.

## Шаг 1: Настройка Google OAuth в Google Cloud Console

1. Откройте [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Выберите ваш проект
3. Перейдите в "APIs & Services" → "Credentials"
4. Найдите ваш OAuth 2.0 Client ID и нажмите "Edit"
5. В разделе **"Authorized redirect URIs"** добавьте **ОБА** URL:

   ```
   http://localhost:3000/api/auth/callback/google
   https://your-domain.vercel.app/api/auth/callback/google
   ```

   ⚠️ **Важно:** Замените `your-domain` на ваш реальный домен Vercel (например, `life-script-abc123.vercel.app`)

6. Нажмите "Save"

## Шаг 2: Настройка переменных окружения

### Локально (`.env.local`):

Создайте файл `.env.local` в корне проекта:

```env
DATABASE_URL="postgresql://..."
GOOGLE_CLIENT_ID="ваш-client-id"
GOOGLE_CLIENT_SECRET="ваш-client-secret"
AUTH_SECRET="ваш-auth-secret"
```

### На Vercel:

1. Откройте ваш проект на [Vercel Dashboard](https://vercel.com/dashboard)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте следующие переменные для **Production**, **Preview** и **Development**:

   - `DATABASE_URL` - ваш production DATABASE_URL
   - `GOOGLE_CLIENT_ID` - тот же, что и локально
   - `GOOGLE_CLIENT_SECRET` - тот же, что и локально
   - `AUTH_SECRET` - тот же, что и локально (или другой, но стабильный)

4. Нажмите "Save" для каждой переменной

## Шаг 3: Проверка конфигурации

Текущая конфигурация в `auth.ts` уже поддерживает оба окружения:

```typescript
trustHost: true,  // Это позволяет работать и на localhost, и на Vercel
```

## Шаг 4: Тестирование

### Локально:

1. Запустите `npm run dev`
2. Откройте `http://localhost:3000/login`
3. Попробуйте войти через Google

### На Vercel:

1. После деплоя откройте `https://your-domain.vercel.app/login`
2. Попробуйте войти через Google

## Важные моменты

1. **Один и тот же Client ID/Secret** используется для обоих окружений
2. **Разные redirect URIs** должны быть добавлены в Google Console
3. **AUTH_SECRET** должен быть одинаковым (или разным, но стабильным) для обоих окружений
4. **DATABASE_URL** может быть разным (локальная БД vs production БД)

## Troubleshooting

### Ошибка "redirect_uri_mismatch" на Vercel:

- Проверьте, что redirect URI в Google Console точно совпадает с вашим Vercel доменом
- Убедитесь, что используется `https://`, а не `http://`
- Проверьте, что нет лишних слешей или пробелов

### Авторизация работает локально, но не на Vercel:

- Проверьте, что все переменные окружения добавлены на Vercel
- Убедитесь, что redirect URI добавлен в Google Console
- Проверьте логи деплоя на Vercel

### Авторизация работает на Vercel, но не локально:

- Проверьте, что `.env.local` существует и содержит все переменные
- Перезапустите dev-сервер после изменения `.env.local`
- Убедитесь, что используете `http://localhost:3000`, а не другой порт
