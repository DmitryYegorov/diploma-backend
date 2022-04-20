/*
  Warnings:

  - You are about to drop the `ScheduleClassesException` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event-exception` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ScheduleClassesException" DROP CONSTRAINT "ScheduleClassesException_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleClassesException" DROP CONSTRAINT "ScheduleClassesException_scheduleClassId_fkey";

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_userId_fkey";

-- DropForeignKey
ALTER TABLE "event-exception" DROP CONSTRAINT "event-exception_eventId_fkey";

-- DropTable
DROP TABLE "ScheduleClassesException";

-- DropTable
DROP TABLE "event";

-- DropTable
DROP TABLE "event-exception";
