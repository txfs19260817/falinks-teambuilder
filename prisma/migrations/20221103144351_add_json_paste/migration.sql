/*
  Warnings:

  - You are about to drop the column `public` on the `Pokepaste` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pokepaste" DROP COLUMN "public",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jsonPaste" JSONB;
