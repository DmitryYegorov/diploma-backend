/*
  Warnings:

  - You are about to alter the column `campus` on the `room` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(5)`.

*/
-- AlterTable
ALTER TABLE "room" ALTER COLUMN "campus" SET DATA TYPE VARCHAR(5);
