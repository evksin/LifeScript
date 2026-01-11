-- AlterTable: Добавляем новые поля
ALTER TABLE "life_scripts" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "life_scripts" ADD COLUMN "isFavorite" BOOLEAN NOT NULL DEFAULT false;

-- Синхронизируем isPublic с visibility для существующих записей
UPDATE "life_scripts" SET "isPublic" = (visibility = 'PUBLIC'::"Visibility");

-- Делаем categoryId опциональным (согласно обновленной схеме)
-- Сначала нужно удалить foreign key constraint, если он есть
ALTER TABLE "life_scripts" ALTER COLUMN "categoryId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "life_scripts_isPublic_idx" ON "life_scripts"("isPublic");
CREATE INDEX IF NOT EXISTS "life_scripts_isFavorite_idx" ON "life_scripts"("isFavorite");
