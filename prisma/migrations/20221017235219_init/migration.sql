-- CreateTable
CREATE TABLE "Pokepaste" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "paste" TEXT NOT NULL,
    "notes" TEXT,
    "source" TEXT,
    "format" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pokepaste_pkey" PRIMARY KEY ("id")
);
