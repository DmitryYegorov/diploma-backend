/*
  Warnings:

  - You are about to drop the column `order` on the `schedule-classes` table. All the data in the column will be lost.
  - Added the required column `scheduleTimeId` to the `schedule-classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedule-classes" DROP COLUMN "order",
ADD COLUMN     "scheduleTimeId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "schedule-time" (
    "id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "startHours" INTEGER NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endHours" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,

    CONSTRAINT "schedule-time_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "schedule-classes" ADD CONSTRAINT "schedule-classes_scheduleTimeId_fkey" FOREIGN KEY ("scheduleTimeId") REFERENCES "schedule-time"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
