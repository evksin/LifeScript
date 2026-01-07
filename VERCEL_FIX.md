# Исправление ошибки сборки на Vercel

## Проблема

Ошибка `Environment variable not found: DATABASE_URL` возникает потому, что `prisma migrate deploy` в buildCommand выполняется до того, как переменные окружения загружены на Vercel.

## Решение

Убрал `prisma migrate deploy` из buildCommand, так как:
1. Миграции уже применены вручную через SQL в NeonDB
2. Таблица уже создана
3. `prisma generate` не требует DATABASE_URL и работает корректно

## Что изменилось

**Было:**
```json
"buildCommand": "prisma generate && prisma migrate deploy && next build"
```

**Стало:**
```json
"buildCommand": "prisma generate && next build"
```

## Что делать дальше

1. **Закоммитьте изменения:**
   ```powershell
   git add vercel.json package.json
   git commit -m "Исправление: убрал migrate deploy из build команды"
   git push
   ```

2. **Vercel автоматически пересоберет проект** после пуша

3. **Проверьте результат** - данные должны отображаться

## Если нужно применять миграции автоматически в будущем

Если в будущем понадобится автоматически применять миграции на Vercel, используйте один из подходов:

### Вариант 1: Через Vercel CLI (рекомендуется)
```powershell
vercel env pull .env.production
npx prisma migrate deploy
```

### Вариант 2: Через отдельный скрипт
Создайте скрипт, который применяет миграции только если DATABASE_URL доступен, и вызывайте его вручную при необходимости.

### Вариант 3: Использовать Vercel Post-Deploy Hook
Настройте webhook или функцию, которая применяет миграции после деплоя.

