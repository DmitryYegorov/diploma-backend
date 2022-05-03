/*
  Warnings:

  - Made the column `name` on table `semester` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "semester" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" DROP DEFAULT;
