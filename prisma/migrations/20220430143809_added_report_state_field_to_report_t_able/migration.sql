-- CreateEnum
CREATE TYPE "ReportState" AS ENUM ('DRAFT', 'SENT', 'APPROVED');

-- AlterTable
ALTER TABLE "report" ADD COLUMN     "state" "ReportState" DEFAULT E'DRAFT';
