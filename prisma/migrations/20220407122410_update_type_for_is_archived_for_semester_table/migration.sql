-- AlterTable
ALTER TABLE "semester" ALTER COLUMN "isArchived" DROP NOT NULL,
ALTER COLUMN "isArchived" SET DEFAULT false;
