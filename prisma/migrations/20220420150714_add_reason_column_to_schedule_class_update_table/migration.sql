/*
  Warnings:

  - Added the required column `reason` to the `schedule-class-update` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedule-class-update" ADD COLUMN     "reason" TEXT NOT NULL;