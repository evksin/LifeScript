# Исправление ошибки "Configuration" на Vercel

## Проблема:
Ошибка "Configuration" при попытке входа через Google на Vercel. Это означает, что NextAuth не может определить базовый URL приложения.

## Решение:

### Шаг 1: Проверьте переменную AUTH_URL на Vercel

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите ваш проект **life-script**
3. Перейдите в **Settings** → **Environment Variables**
4. Найдите переменную **AUTH_URL**
5. Убедитесь, что она установлена и равна:
   ```
   https://life-script-swart.vercel.app
   ```
   
   **ВАЖНО:**
   - Используйте `https://`, а не `http://`
   - Не добавляйте слэш в конце (`/`)
   - URL должен быть точно таким, как ваш production домен

### Шаг 2: Если AUTH_URL отсутствует или неправильный

1. Если переменной нет - добавьте её:
   - **Key:** `AUTH_URL`
   - **Value:** `https://life-script-swart.vercel.app`
   - **Environment:** Выберите **Production**, **Preview** и **Development**

2. Если переменная есть, но значение неправильное:
   - Нажмите на переменную
   - Измените значение на `https://life-script-swart.vercel.app`
   - Сохраните

### Шаг 3: Пересоберите проект БЕЗ кэша

**ОБЯЗАТЕЛЬНО** пересоберите проект после изменения переменных:

1. Vercel Dashboard → ваш проект → **Deployments**
2. Найдите последний деплой
3. Нажмите **"..."** (три точки) → **"Redeploy"**
4. **ВАЖНО:** Выберите **"Use existing Build Cache"** = **No**
5. Нажмите **"Redeploy"**

### Шаг 4: Проверьте логи после пересборки

После пересборки проверьте Runtime Logs:

1. Vercel Dashboard → ваш проект → **Logs** → **Runtime Logs**
2. Ищите сообщения с префиксом `[NextAuth]`
3. Должно быть сообщение:
   ```
   [NextAuth] URL конфигурация: {
     AUTH_URL: 'установлен',
     ...
   }
   ```
4. Если видите `AUTH_URL: 'не установлен'` - переменная не установлена правильно

### Шаг 5: Проверьте вход

1. Откройте `https://life-script-swart.vercel.app/login`
2. Нажмите "Войти через Google"
3. Если ошибка "Configuration" исчезла - проблема решена!
4. Если ошибка сохраняется - проверьте Runtime Logs на наличие ошибок

## Альтернативное решение (если AUTH_URL не помогает):

Если проблема сохраняется, попробуйте также установить `NEXTAUTH_URL`:

1. Vercel Dashboard → **Settings** → **Environment Variables**
2. Добавьте переменную:
   - **Key:** `NEXTAUTH_URL`
   - **Value:** `https://life-script-swart.vercel.app`
   - **Environment:** Production, Preview, Development
3. Пересоберите проект БЕЗ кэша

## Проверка:

Убедитесь, что:
- ✅ `AUTH_URL` установлен и равен `https://life-script-swart.vercel.app`
- ✅ Используется `https://`, а не `http://`
- ✅ Нет слэша в конце URL
- ✅ Проект пересобран БЕЗ кэша
- ✅ В Runtime Logs видно `AUTH_URL: 'установлен'`

## Если проблема сохраняется:

1. Проверьте Runtime Logs на наличие сообщений `[NextAuth] КРИТИЧЕСКАЯ ОШИБКА`
2. Убедитесь, что переменные действительно сохранены (откройте их снова в Vercel Dashboard)
3. Попробуйте удалить и заново добавить переменную `AUTH_URL`
4. Проверьте, что вы используете правильный домен (может быть другой, если у вас кастомный домен)
