-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "topcut" SMALLINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TournamentTeam" ADD COLUMN     "country" VARCHAR(2);
