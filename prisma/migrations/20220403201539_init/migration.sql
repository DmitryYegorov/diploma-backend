-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "ClassType" AS ENUM ('LAB', 'LECTION', 'PRACTICE_CLASS');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('LECTION', 'PRACTICE_CLASS', 'LAB', 'CONSULTATION', 'COURSE_WORK', 'EXAM', 'CREDIT', 'POSTGRADUATE', 'TESTING', 'PRACTICE', 'DIPLOMA_DESIGN', 'STATE_EXAMINATION_BOARD');

-- CreateEnum
CREATE TYPE "Week" AS ENUM ('FIRST', 'SECOND', 'WEEKLY');

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
    "recurrenceStart" TIMESTAMP(3) NOT NULL,
    "recurrenceEnd" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" UUID NOT NULL,
    "updatedBy" UUID NOT NULL,

    CONSTRAINT "schedule-classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "EventType" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isRecurring" BOOLEAN NOT NULL,
    "isAllDay" BOOLEAN NOT NULL,
    "recurrencePatter" TEXT,
    "recurenceUnti" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "schedule-classes" ADD CONSTRAINT "schedule-classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule-classes" ADD CONSTRAINT "schedule-classes_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
