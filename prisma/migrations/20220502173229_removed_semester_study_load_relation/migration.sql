/*
  Warnings:

  - You are about to drop the column `semesterId` on the `study-load` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "study-load" DROP CONSTRAINT "study-load_semesterId_fkey";

-- AlterTable
ALTER TABLE "study-load" DROP COLUMN "semesterId";
