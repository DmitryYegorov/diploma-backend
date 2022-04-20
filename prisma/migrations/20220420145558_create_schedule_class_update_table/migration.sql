-- CreateEnum
CREATE TYPE "ScheduleClassUpdateType" AS ENUM ('SWAP', 'CANCEL', 'RESCHEDULED');

-- CreateTable
CREATE TABLE "schedule-class-update" (
    "id" UUID NOT NULL,
    "scheduleClassId" UUID NOT NULL,
    "type" "ScheduleClassUpdateType" NOT NULL,
    "teacherId" UUID,
    "classDate" TIMESTAMP(3) NOT NULL,
    "rescheduleDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedule-class-update_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "schedule-class-update" ADD CONSTRAINT "schedule-class-update_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule-class-update" ADD CONSTRAINT "schedule-class-update_scheduleClassId_fkey" FOREIGN KEY ("scheduleClassId") REFERENCES "schedule-classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
