/*
  Warnings:

  - You are about to drop the `StudyLoad` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudyLoad" DROP CONSTRAINT "StudyLoad_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "StudyLoad" DROP CONSTRAINT "StudyLoad_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "StudyLoad" DROP CONSTRAINT "StudyLoad_teacherId_fkey";

-- DropTable
DROP TABLE "StudyLoad";

-- CreateTable
CREATE TABLE "study-load" (
    "id" UUID NOT NULL,
    "type" "EventType" NOT NULL,
    "subjectId" UUID,
    "semesterId" UUID NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "teacherId" UUID NOT NULL,

    CONSTRAINT "study-load_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "study-load" ADD CONSTRAINT "study-load_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study-load" ADD CONSTRAINT "study-load_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study-load" ADD CONSTRAINT "study-load_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
