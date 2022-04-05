/*
  Warnings:

  - You are about to drop the column `recurenceUntil` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "recurenceUntil",
ADD COLUMN     "recurrenceUntil" TIMESTAMP(3);
