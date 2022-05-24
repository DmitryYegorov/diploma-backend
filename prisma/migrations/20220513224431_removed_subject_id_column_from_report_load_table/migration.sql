/*
  Warnings:

  - You are about to drop the column `subjectId` on the `report-load` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "report-load" DROP CONSTRAINT "report-load_subjectId_fkey";

-- AlterTable
ALTER TABLE "report-load" DROP COLUMN "subjectId";
