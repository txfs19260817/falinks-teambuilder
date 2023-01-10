-- CreateTable
CREATE TABLE "replay" (
    "id" TEXT NOT NULL,
    "p1" VARCHAR(45) NOT NULL,
    "p2" VARCHAR(45) NOT NULL,
    "format" VARCHAR(45) NOT NULL,
    "uploadtime" TIMESTAMP(6) NOT NULL,
    "log" TEXT NOT NULL,
    "rating" SMALLINT NOT NULL DEFAULT 1000,
    "p1team" TEXT[],
    "p2team" TEXT[],

    CONSTRAINT "id" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uploadtime" ON "replay"("uploadtime" DESC);

-- CreateIndex
CREATE INDEX "format" ON "replay"("format", "uploadtime" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "p1" ON "replay"("p1", "uploadtime");

-- CreateIndex
CREATE UNIQUE INDEX "p2" ON "replay"("p2", "uploadtime");
