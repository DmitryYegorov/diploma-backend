-- AlterTable
ALTER TABLE "report-load" ADD COLUMN     "scheduleClassId" UUID,
ADD COLUMN     "scheduleClassUpdateId" UUID,
ALTER COLUMN "type" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "report-load" ADD CONSTRAINT "report-load_scheduleClassId_fkey" FOREIGN KEY ("scheduleClassId") REFERENCES "schedule-classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report-load" ADD CONSTRAINT "report-load_scheduleClassUpdateId_fkey" FOREIGN KEY ("scheduleClassUpdateId") REFERENCES "schedule-class-update"("id") ON DELETE SET NULL ON UPDATE CASCADE;
