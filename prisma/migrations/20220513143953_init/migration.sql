-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'USER');

-- CreateEnum
CREATE TYPE "ClassType" AS ENUM ('LAB', 'LECTION', 'PRACTICE_CLASS');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('COMPUTER', 'LECTURE');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CONSULTATION', 'COURSE_WORK', 'EXAM', 'CREDIT', 'POSTGRADUATE', 'TESTING', 'PRACTICE', 'DIPLOMA_DESIGN', 'STATE_EXAMINATION_BOARD');

-- CreateEnum
CREATE TYPE "LoadType" AS ENUM ('CONSULTATION', 'COURSE_WORK', 'EXAM', 'CREDIT', 'POSTGRADUATE', 'TESTING', 'PRACTICE', 'DIPLOMA_DESIGN', 'STATE_EXAMINATION_BOARD', 'LAB', 'LECTION', 'PRACTICE_CLASS');

-- CreateEnum
CREATE TYPE "Week" AS ENUM ('FIRST', 'SECOND', 'WEEKLY');

-- CreateEnum
CREATE TYPE "ScheduleClassUpdateType" AS ENUM ('SWAP', 'CANCEL', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "ReportState" AS ENUM ('DRAFT', 'SENT', 'APPROVED');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "email" VARCHAR NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "middleName" VARCHAR,
    "lastName" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "activationCode" VARCHAR,
    "activatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitedBy" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "shortName" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "createdBy" UUID NOT NULL,
    "deletedBy" UUID,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule-classes" (
    "id" UUID NOT NULL,
    "teacherId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "type" "ClassType" NOT NULL,
    "week" "Week" NOT NULL DEFAULT E'WEEKLY',
    "semesterId" UUID NOT NULL,
    "roomId" UUID NOT NULL,
    "weekDay" INTEGER NOT NULL,
    "scheduleTimeId" UUID NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" UUID NOT NULL,
    "updatedBy" UUID,

    CONSTRAINT "schedule-classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_schedule-classes" (
    "id" UUID NOT NULL,
    "scheduleClassId" UUID NOT NULL,
    "groupId" UUID NOT NULL,

    CONSTRAINT "group_schedule-classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "shortName" VARCHAR NOT NULL,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group" (
    "id" UUID NOT NULL,
    "facultyId" UUID NOT NULL,
    "group" INTEGER NOT NULL,
    "subGroup" INTEGER NOT NULL,
    "courese" INTEGER NOT NULL,
    "semesterId" UUID NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room" (
    "id" UUID NOT NULL,
    "campus" VARCHAR(5) NOT NULL,
    "room" VARCHAR(5) NOT NULL,
    "type" "RoomType" NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "semester" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "academicYearId" UUID NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isArchived" BOOLEAN DEFAULT false,

    CONSTRAINT "semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic-year" (
    "id" UUID NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isArchived" BOOLEAN DEFAULT false,

    CONSTRAINT "academic-year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study-load" (
    "id" UUID NOT NULL,
    "type" "LoadType" NOT NULL,
    "subjectId" UUID,
    "reportId" UUID NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study-load_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "other-load" (
    "id" UUID NOT NULL,
    "type" "EventType" NOT NULL,
    "groupsCount" INTEGER,
    "studentsCount" INTEGER,
    "facultyId" UUID NOT NULL,
    "subjectId" UUID,
    "duration" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID NOT NULL,

    CONSTRAINT "other-load_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule-class-update" (
    "id" UUID NOT NULL,
    "scheduleClassId" UUID NOT NULL,
    "type" "ScheduleClassUpdateType" NOT NULL,
    "teacherId" UUID,
    "classDate" TIMESTAMP(3) NOT NULL,
    "rescheduleDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "createdBy" UUID NOT NULL,

    CONSTRAINT "schedule-class-update_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "state" "ReportState" DEFAULT E'DRAFT',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID NOT NULL,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule-classes" ADD CONSTRAINT "schedule-classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule-classes" ADD CONSTRAINT "schedule-classes_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule-classes" ADD CONSTRAINT "schedule-classes_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule-classes" ADD CONSTRAINT "schedule-classes_scheduleTimeId_fkey" FOREIGN KEY ("scheduleTimeId") REFERENCES "schedule-time"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule-classes" ADD CONSTRAINT "schedule-classes_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_schedule-classes" ADD CONSTRAINT "group_schedule-classes_scheduleClassId_fkey" FOREIGN KEY ("scheduleClassId") REFERENCES "schedule-classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_schedule-classes" ADD CONSTRAINT "group_schedule-classes_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester" ADD CONSTRAINT "semester_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic-year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study-load" ADD CONSTRAINT "study-load_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study-load" ADD CONSTRAINT "study-load_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "other-load" ADD CONSTRAINT "other-load_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "other-load" ADD CONSTRAINT "other-load_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "other-load" ADD CONSTRAINT "other-load_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule-class-update" ADD CONSTRAINT "schedule-class-update_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule-class-update" ADD CONSTRAINT "schedule-class-update_scheduleClassId_fkey" FOREIGN KEY ("scheduleClassId") REFERENCES "schedule-classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
