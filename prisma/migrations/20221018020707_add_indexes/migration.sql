-- AlterTable
ALTER TABLE "Pokepaste" ADD COLUMN     "isOfficial" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Pokepaste_format_createdAt_idx" ON "Pokepaste"("format", "createdAt" DESC);
