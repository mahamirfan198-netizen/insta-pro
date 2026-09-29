-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "gender" VARCHAR(30),
ADD COLUMN     "musicUrl" TEXT,
ADD COLUMN     "notes" VARCHAR(60),
ADD COLUMN     "pronouns" VARCHAR(30),
ADD COLUMN     "sleepMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "website" VARCHAR(100);
