/*
  Warnings:

  - You are about to drop the column `recurenceUnti` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "recurenceUnti",
ADD COLUMN     "recurenceUntil" TIMESTAMP(3);
