/*
  Warnings:

  - You are about to drop the column `recurrencePattern` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "recurrencePattern",
ADD COLUMN     "rRule" TEXT;
