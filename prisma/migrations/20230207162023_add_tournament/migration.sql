-- CreateTable
CREATE TABLE "Tournament" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "format" VARCHAR(45) NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentTeam" (
    "id" SERIAL NOT NULL,
    "author" TEXT NOT NULL,
    "standing" INTEGER NOT NULL,
    "paste" TEXT NOT NULL,
    "tournamentId" INTEGER NOT NULL,

    CONSTRAINT "TournamentTeam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tournament_format_date_idx" ON "Tournament"("format", "date" DESC);

-- CreateIndex
CREATE INDEX "TournamentTeam_tournamentId_standing_idx" ON "TournamentTeam"("tournamentId", "standing" ASC);

-- AddForeignKey
ALTER TABLE "TournamentTeam" ADD CONSTRAINT "TournamentTeam_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
