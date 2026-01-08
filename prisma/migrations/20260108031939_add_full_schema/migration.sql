/*
  Warnings:

  - Added the required column `ownerId` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Создаём тестового пользователя для существующих notes
INSERT INTO "users" ("id", "email", "name", "createdAt")
VALUES ('migration-default-user', 'migration@example.com', 'Migration User', NOW());

-- Добавляем колонку ownerId с временным значением
ALTER TABLE "notes" ADD COLUMN "ownerId" TEXT;

-- Обновляем существующие notes, присваивая им ownerId тестового пользователя
UPDATE "notes" SET "ownerId" = 'migration-default-user' WHERE "ownerId" IS NULL;

-- Делаем колонку NOT NULL
ALTER TABLE "notes" ALTER COLUMN "ownerId" SET NOT NULL;

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "life_scripts" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "life_scripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag_on_life_script" (
    "id" TEXT NOT NULL,
    "lifeScriptId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tag_on_life_script_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lifeScriptId" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_key" ON "categories"("category");

-- CreateIndex
CREATE INDEX "life_scripts_ownerId_updatedAt_idx" ON "life_scripts"("ownerId", "updatedAt");

-- CreateIndex
CREATE INDEX "life_scripts_visibility_createdAt_idx" ON "life_scripts"("visibility", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tag_on_life_script_lifeScriptId_tagId_key" ON "tag_on_life_script"("lifeScriptId", "tagId");

-- CreateIndex
CREATE INDEX "votes_lifeScriptId_idx" ON "votes"("lifeScriptId");

-- CreateIndex
CREATE INDEX "votes_userId_idx" ON "votes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "votes_userId_lifeScriptId_key" ON "votes"("userId", "lifeScriptId");

-- CreateIndex
CREATE INDEX "notes_ownerId_idx" ON "notes"("ownerId");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "life_scripts" ADD CONSTRAINT "life_scripts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "life_scripts" ADD CONSTRAINT "life_scripts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_on_life_script" ADD CONSTRAINT "tag_on_life_script_lifeScriptId_fkey" FOREIGN KEY ("lifeScriptId") REFERENCES "life_scripts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_on_life_script" ADD CONSTRAINT "tag_on_life_script_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_lifeScriptId_fkey" FOREIGN KEY ("lifeScriptId") REFERENCES "life_scripts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
