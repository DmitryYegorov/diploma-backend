/*
  Warnings:

  - You are about to drop the column `scheduleClassId` on the `report-load` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleClassUpdateId` on the `report-load` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "report-load" DROP CONSTRAINT "report-load_scheduleClassId_fkey";

-- DropForeignKey
ALTER TABLE "report-load" DROP CONSTRAINT "report-load_scheduleClassUpdateId_fkey";

-- AlterTable
ALTER TABLE "report-load" DROP COLUMN "scheduleClassId",
DROP COLUMN "scheduleClassUpdateId",
ADD COLUMN     "subjectId" UUID;

-- AddForeignKey
ALTER TABLE "report-load" ADD CONSTRAINT "report-load_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
