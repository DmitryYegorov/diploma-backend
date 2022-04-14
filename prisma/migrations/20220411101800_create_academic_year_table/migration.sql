/*
  Warnings:

  - Added the required column `academicYearId` to the `semester` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "semester" ADD COLUMN     "academicYearId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "academic-year" (
    "id" UUID NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isArchived" BOOLEAN DEFAULT false,

    CONSTRAINT "academic-year_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "semester" ADD CONSTRAINT "semester_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic-year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
