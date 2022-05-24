-- CreateTable
CREATE TABLE "calculated-report" (
    "id" UUID NOT NULL,
    "reportId" UUID NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "calculated-report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "calculated-report" ADD CONSTRAINT "calculated-report_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
