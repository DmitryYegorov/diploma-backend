/*
  Warnings:

  - Added the required column `order` to the `schedule-classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekDay` to the `schedule-classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedule-classes" ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "weekDay" INTEGER NOT NULL;
