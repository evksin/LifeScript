# Исправление бесконечного цикла OAuth

## Проблемы:

1. **Локально:** После выбора аккаунта Google показывается ошибка входа
2. **На Vercel:** Бесконечный цикл - форма → выбор аккаунта → снова форма

## Решения:

### 1. Проверьте redirect URI в Google Console

**КРИТИЧНО:** Redirect URI должен **ТОЧНО** совпадать с URL вашего приложения.

1. Откройте [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Найдите ваш OAuth 2.0 Client ID
3. Проверьте раздел **"Authorized redirect URIs"**

**Для локального хоста:**
```
http://localhost:3000/api/auth/callback/google
```

**Для Vercel:**
```
https://life-script-swart.vercel.app/api/auth/callback/google
```

⚠️ **Важно:**
- Используйте `http://` для localhost, `https://` для Vercel
- URL должен быть **точно** таким же (без лишних слешей, без порта для Vercel)
- После изменения в Google Console может потребоваться несколько минут

### 2. Проверьте переменные окружения

**Локально (`.env.local`):**
```env
DATABASE_URL="postgresql://..."
GOOGLE_CLIENT_ID="ваш-client-id"
GOOGLE_CLIENT_SECRET="ваш-client-secret"
AUTH_SECRET="ваш-auth-secret"
```

**На Vercel:**
- Vercel Dashboard → Settings → Environment Variables
- Убедитесь, что все переменные добавлены для **Production**
- **AUTH_SECRET должен быть одинаковым** на локальном и Vercel (или разным, но стабильным)

### 3. Проверьте базу данных

Убедитесь, что:
- База данных доступна
- Таблицы `users`, `accounts`, `sessions` созданы (через Prisma migrations)
- Prisma Client сгенерирован

**Проверка:**
```powershell
# Локально
npm run db:migrate
npx prisma generate

# Проверьте, что таблицы созданы
npx prisma studio
```

### 4. Очистите cookies и сессии

Если проблема сохраняется:

1. **В браузере:**
   - Очистите cookies для вашего домена
   - Или используйте режим инкогнито

2. **В базе данных:**
   ```sql
   -- Удалите старые сессии (если нужно)
   DELETE FROM sessions;
   ```

### 5. Проверьте логи

**Локально:**
- Проверьте терминал, где запущен `npm run dev`
- Ищите ошибки, связанные с:
  - Prisma
  - NextAuth
  - База данных

**На Vercel:**
- Vercel Dashboard → ваш проект → Deployments → последний деплой → Logs
- Ищите ошибки при обработке callback

### 6. Диагностика

Откройте в браузере (после попытки входа):

**Локально:**
- `http://localhost:3000/api/auth/session` - должна вернуться информация о сессии

**На Vercel:**
- `https://your-domain.vercel.app/api/auth/session` - должна вернуться информация о сессии

Если сессия не создается, проблема в обработке callback.

## Частые причины:

1. **Redirect URI не совпадает** - самая частая причина
2. **AUTH_SECRET разный** на локальном и Vercel
3. **База данных недоступна** или таблицы не созданы
4. **PrismaAdapter не работает** - проверьте подключение к БД

## Быстрая проверка:

1. ✅ Redirect URI добавлен в Google Console
2. ✅ Переменные окружения настроены
3. ✅ База данных доступна
4. ✅ Таблицы созданы через миграции
5. ✅ Cookies очищены
6. ✅ Пересобран проект на Vercel

