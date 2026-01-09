# Исправление ошибки UnknownAction в NextAuth v5

## Проблема:
Ошибка `UnknownAction: Unsupported action` при попытке входа через Google в NextAuth v5 beta.30.

## Решение:

### Шаг 1: Убедитесь, что AUTH_URL установлен

Откройте файл `.env.local` и убедитесь, что там есть:
```env
AUTH_URL=http://localhost:3000
```

Или:
```env
NEXTAUTH_URL=http://localhost:3000
```

### Шаг 2: Очистите кэш Next.js

```powershell
Remove-Item -Recurse -Force .next
```

### Шаг 3: Перезапустите сервер

1. Остановите сервер: `Ctrl+C`
2. Запустите снова:
   ```powershell
   npm run dev
   ```

### Шаг 4: Если проблема сохраняется - обновите NextAuth

Ошибка `UnknownAction` может быть багом в NextAuth v5 beta.30. Попробуйте обновить до более новой версии:

```powershell
npm install next-auth@latest
```

Или до конкретной версии:
```powershell
npm install next-auth@5.0.0-beta.31
```

После обновления перезапустите сервер.

## Альтернативное решение:

Если обновление не помогает, можно попробовать использовать NextAuth v4 (стабильная версия):

```powershell
npm install next-auth@^4.24.5
```

Но это потребует изменения кода, так как API отличается.
