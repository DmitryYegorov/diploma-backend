-- DropForeignKey
ALTER TABLE "group_schedule-classes" DROP CONSTRAINT "group_schedule-classes_groupId_fkey";

-- DropForeignKey
ALTER TABLE "group_schedule-classes" DROP CONSTRAINT "group_schedule-classes_scheduleClassId_fkey";

-- AddForeignKey
ALTER TABLE "group_schedule-classes" ADD CONSTRAINT "group_schedule-classes_scheduleClassId_fkey" FOREIGN KEY ("scheduleClassId") REFERENCES "schedule-classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_schedule-classes" ADD CONSTRAINT "group_schedule-classes_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
