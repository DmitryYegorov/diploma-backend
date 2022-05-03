/*
  Warnings:

  - Added the required column `reportId` to the `study-load` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "study-load" DROP CONSTRAINT "study-load_semesterId_fkey";

-- AlterTable
ALTER TABLE "study-load" ADD COLUMN     "reportId" UUID NOT NULL,
ALTER COLUMN "semesterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "study-load" ADD CONSTRAINT "study-load_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study-load" ADD CONSTRAINT "study-load_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
