/*
  Warnings:

  - You are about to drop the column `recurrenceEnd` on the `schedule-classes` table. All the data in the column will be lost.
  - You are about to drop the column `recurrenceStart` on the `schedule-classes` table. All the data in the column will be lost.
  - Added the required column `semesterId` to the `schedule-classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedule-classes" DROP COLUMN "recurrenceEnd",
DROP COLUMN "recurrenceStart",
ADD COLUMN     "semesterId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "schedule-classes" ADD CONSTRAINT "schedule-classes_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
