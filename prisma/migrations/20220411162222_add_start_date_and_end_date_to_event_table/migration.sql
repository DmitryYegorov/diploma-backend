/*
  Warnings:

  - You are about to drop the column `endTime` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `event` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `event` table without a default value. This is not possible if the table is not empty.
  - Made the column `note` on table `event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "note" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL;
