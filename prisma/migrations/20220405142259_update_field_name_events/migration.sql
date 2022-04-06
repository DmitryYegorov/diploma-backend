/*
  Warnings:

  - You are about to drop the column `recurrencePatter` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "recurrencePatter",
ADD COLUMN     "recurrencePattern" TEXT;
