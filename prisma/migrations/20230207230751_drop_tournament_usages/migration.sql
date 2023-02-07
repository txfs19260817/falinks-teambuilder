/*
  Warnings:

  - You are about to drop the column `usages` on the `Tournament` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "usages",
ADD COLUMN     "country" VARCHAR(2);
