/*
  Warnings:

  - You are about to drop the column `groupIds` on the `schedule-classes` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MANAGER';

-- AlterTable
ALTER TABLE "schedule-classes" DROP COLUMN "groupIds";

-- CreateTable
CREATE TABLE "group_schedule-classes" (
    "id" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "scheduleClassId" UUID NOT NULL,

    CONSTRAINT "group_schedule-classes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "group_schedule-classes" ADD CONSTRAINT "group_schedule-classes_scheduleClassId_fkey" FOREIGN KEY ("scheduleClassId") REFERENCES "schedule-classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_schedule-classes" ADD CONSTRAINT "group_schedule-classes_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
