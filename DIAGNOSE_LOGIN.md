# Диагностика проблемы с формой авторизации

## Проблема: Форма авторизации не отображается ни в локале, ни на Vercel

## Шаг 1: Проверка в браузере

1. Откройте страницу `/login` в браузере
2. Откройте консоль разработчика (F12 → Console)
3. Проверьте, есть ли ошибки в консоли
4. Проверьте, что выводится в консоли при загрузке страницы

## Шаг 2: Проверка API NextAuth

1. Откройте в браузере: `http://localhost:3000/api/auth/providers`
2. Должен вернуться JSON с провайдерами (должен быть Google)
3. Если ошибка 404 или 500 - проблема с API роутом

## Шаг 3: Проверка переменных окружения

### Локально:
```powershell
# Проверьте, что файл .env.local существует и содержит:
Get-Content .env.local | Select-String -Pattern "GOOGLE|AUTH"
```

Должны быть:
- `GOOGLE_CLIENT_ID=...`
- `GOOGLE_CLIENT_SECRET=...`
- `AUTH_SECRET=...`

### На Vercel:
1. Vercel Dashboard → ваш проект → Settings → Environment Variables
2. Проверьте, что все переменные добавлены для Production/Preview/Development

## Шаг 4: Проверка логов

### Локально:
- Проверьте терминал, где запущен `npm run dev`
- Ищите ошибки, связанные с NextAuth или переменными окружения

### На Vercel:
1. Vercel Dashboard → ваш проект → Deployments → последний деплой → Build Logs
2. Ищите ошибки при сборке

## Шаг 5: Проверка SessionProvider

Убедитесь, что `SessionProvider` правильно обёрнут в `app/layout.tsx`:

```typescript
<SessionProvider>{children}</SessionProvider>
```

## Возможные причины:

1. **Переменные окружения не загружаются**
   - Решение: Перезапустите dev-сервер после изменения `.env.local`
   - На Vercel: Пересоберите проект после добавления переменных

2. **NextAuth API не работает**
   - Проверьте `/api/auth/providers`
   - Проверьте, что файл `app/api/auth/[...nextauth]/route.ts` существует

3. **useSession зависает в "loading"**
   - Проверьте консоль браузера на ошибки
   - Проверьте, что SessionProvider правильно настроен

4. **Ошибка в конфигурации auth.ts**
   - Проверьте, что `GOOGLE_CLIENT_ID` и `GOOGLE_CLIENT_SECRET` не пустые
   - Проверьте, что `AUTH_SECRET` установлен

## Быстрая проверка:

1. Откройте `/login` в браузере
2. Откройте консоль (F12)
3. Проверьте, что выводится в консоли
4. Попробуйте открыть `/api/auth/providers` напрямую
5. Проверьте Network tab в DevTools - есть ли запросы к `/api/auth/*`

