/*
  Warnings:

  - Added the required column `academicYearId` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event" ADD COLUMN     "academicYearId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic-year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
