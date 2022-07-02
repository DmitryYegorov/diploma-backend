-- DropForeignKey
ALTER TABLE "schedule-class-update" DROP CONSTRAINT "schedule-class-update_scheduleClassId_fkey";

-- DropForeignKey
ALTER TABLE "schedule-class-update" DROP CONSTRAINT "schedule-class-update_teacherId_fkey";

-- AddForeignKey
ALTER TABLE "schedule-class-update" ADD CONSTRAINT "schedule-class-update_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule-class-update" ADD CONSTRAINT "schedule-class-update_scheduleClassId_fkey" FOREIGN KEY ("scheduleClassId") REFERENCES "schedule-classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
