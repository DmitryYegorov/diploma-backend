/*
  Warnings:

  - You are about to drop the `study-load` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "study-load" DROP CONSTRAINT "study-load_reportId_fkey";

-- DropForeignKey
ALTER TABLE "study-load" DROP CONSTRAINT "study-load_subjectId_fkey";

-- DropTable
DROP TABLE "study-load";

-- CreateTable
CREATE TABLE "report-load" (
    "id" UUID NOT NULL,
    "type" "LoadType" NOT NULL,
    "subjectId" UUID,
    "reportId" UUID NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report-load_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "report-load" ADD CONSTRAINT "report-load_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report-load" ADD CONSTRAINT "report-load_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
