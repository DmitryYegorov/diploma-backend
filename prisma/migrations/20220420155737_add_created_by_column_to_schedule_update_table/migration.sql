/*
  Warnings:

  - Added the required column `createdBy` to the `schedule-class-update` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedule-class-update" ADD COLUMN     "createdBy" UUID NOT NULL;
