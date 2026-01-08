## Что есть в системе (сущности):

Note - заметки
User — владелец промтов, автор, голосующий
LifeScript — сам промт (может быть приватным или публичным)
Tag — метки (многие-ко-многим с LifeScript)
Vote — голос пользователя за публичный промт (уникально: один пользователь → один голос на промт)
(опционально) Collection / Folder — папки/коллекции для организации
(опционально) LifeScriptVersion — версии промта (история изменений)

## Ключевые правила:

- Публичность — это свойство LifeScript (visibility)
- Голосовать можно только по публичным (проверяется на уровне приложения; можно усилить триггером/констрейнтом позже)
- Голос уникален: (userId, LifeScriptId) — уникальный индекс

## Схема базы данных

- Note: id, ownerId -> User, title, createdAt
- User: id (cuid), email unique, name optional, createdAt
- LifeScript: id, ownerId -> User, title, content, description optional, categoryId -> Category,
  visibility (PRIVATE|PUBLIC, default PRIVATE), createdAt, updatedAt, publishedAt nullable
- Vote: id, userId -> User, LifeScriptId -> LifeScript, value int default 1, createdAt
- Category: id, category
- Ограничение: один пользователь может проголосовать за промт только один раз:
  UNIQUE(userId, LifeScriptId)
- Индексы:
  LifeScript(ownerId, updatedAt)
  LifeScript(visibility, createdAt)
  Vote(LifeScriptId)
  Vote(userId)
- onDelete: Cascade для связей
