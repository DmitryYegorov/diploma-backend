-- CreateTable
CREATE TABLE "ScheduleClassesException" (
    "id" UUID NOT NULL,
    "scheduleClassId" UUID NOT NULL,
    "fieldName" VARCHAR NOT NULL,
    "oldValue" VARCHAR NOT NULL,
    "newValue" VARCHAR NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID NOT NULL,

    CONSTRAINT "ScheduleClassesException_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScheduleClassesException" ADD CONSTRAINT "ScheduleClassesException_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleClassesException" ADD CONSTRAINT "ScheduleClassesException_scheduleClassId_fkey" FOREIGN KEY ("scheduleClassId") REFERENCES "schedule-classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
